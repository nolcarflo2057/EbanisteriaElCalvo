import { db } from "@/db";
import { chatMessages } from "@/db/schema/chat_messages";
import { eq, desc, asc } from "drizzle-orm";
import { getWhiteLabelConfig } from "./config.service";
import { ChatbotKnowledgeService } from "./chatbot-knowledge.service";

export type ChatSender = "user" | "agent";

export interface ChatMessage {
	id: string;
	tenantId: string;
	sender: ChatSender;
	content: string;
	createdAt: Date;
}

/**
 * Palabras clave del modo "simple" (sin IA). Si no matchea nada, se considera
 * una pregunta desconocida y se registra para que el dueño la conteste.
 */
const KNOWN_KEYWORDS = /horario|hora|abierto|ubic|direcci|dónde|donde|precio|tarifa|costo|cuánto|contact|teléfono|telefono|whatsapp|hola|buenas|saludos|hey/i;

function autoReply(input: string): string {
	const text = input.toLowerCase();

	if (text.includes("horario") || text.includes("horarios") || text.includes("abierto") || text.includes("hora")) {
		return "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00. ¿Necesitas algo más?";
	}
	if (text.includes("ubic") || text.includes("direcci") || text.includes("dónde") || text.includes("donde")) {
		return "Puedes encontrarnos en la dirección indicada en nuestra sección de contacto. ¿Te ayudo con algo más?";
	}
	if (text.includes("precio") || text.includes("tarifa") || text.includes("costo") || text.includes("cuánto")) {
		return "Los precios varían según el proyecto. Te recomendamos enviar tu solicitud por el formulario de contacto o WhatsApp y recibirás una cotización personalizada.";
	}
	if (text.includes("contact") || text.includes("teléfono") || text.includes("telefono") || text.includes("whatsapp")) {
		return "Puedes contactarnos por WhatsApp o usando el formulario de la sección de contacto. ¡Te responderemos lo antes posible!";
	}
	if (text.includes("hola") || text.includes("buenas") || text.includes("saludos") || text.includes("hey")) {
		return "¡Hola! Encantado de ayudarte. Pregúntame por horarios, ubicación, precios o contacto.";
	}

	return "Gracias por tu mensaje. Un asesor te responderá a la brevedad. Mientras tanto, ¿puedo ayudarte con horarios, ubicación o precios?";
}

/**
 * Modo simple: empareja el mensaje con las respuestas predefinidas configuradas
 * por el dueño (chatbotTags). Devuelve la respuesta configurada o `null` si no
 * hay coincidencia (en cuyo caso se usa el fallback de `autoReply`).
 *  1) Coincidencia directa por el nombre del tag (cubre los chips y escritura exacta).
 *  2) Sinónimos para preguntas libres (palabra clave -> tag configurado).
 */
function matchSimpleTag(
	input: string,
	tags: { tag: string; response: string }[] | null | undefined,
): string | null {
	if (!tags || tags.length === 0) return null;
	const text = input.toLowerCase();

	for (const t of tags) {
		if (t.tag && t.response && text.includes(t.tag.toLowerCase())) return t.response;
	}

	const synonyms: Record<string, string> = {
		horario: "Horarios",
		hora: "Horarios",
		abierto: "Horarios",
		ubic: "Ubicación",
		direcci: "Ubicación",
		"dónde": "Ubicación",
		donde: "Ubicación",
		precio: "Precios",
		tarifa: "Precios",
		costo: "Precios",
		"cuánto": "Precios",
		contact: "Contacto",
		"teléfono": "Contacto",
		telefono: "Contacto",
		whatsapp: "Contacto",
	};
	for (const [syn, tagName] of Object.entries(synonyms)) {
		if (text.includes(syn)) {
			const t = tags.find((x) => x.tag.toLowerCase() === tagName.toLowerCase());
			if (t?.response && t.response.trim()) return t.response;
		}
	}
	return null;
}

function newId(): string {
	return globalThis.crypto?.randomUUID?.() ?? `m-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

async function persist(tenantId: string, sender: ChatSender, content: string): Promise<ChatMessage> {
	const [row] = await db
		.insert(chatMessages)
		.values({ tenantId, sender, content })
		.returning();
	return {
		id: row.id,
		tenantId: row.tenantId,
		sender: row.sender,
		content: row.content,
		createdAt: row.createdAt,
	};
}

/* ----------------------------- IA (modo avanzado) ---------------------------- */
/*
 * Proveedor: OpenRouter (API compatible con OpenAI). Ofrece modelos GRATUITOS
 * con soporte de tool-calling. Se llama directo por HTTP (fetch) para EVITAR
 * el SDK @ai-sdk/* roto en este repo (versiones desalineadas + requiere zod/v4
 * ausente en zod@3). La API key es OPEN_ROUTER_KEY (global en .env).
 */

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_FREE_MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

type ORMessage = {
	role: "system" | "user" | "assistant" | "tool";
	content?: string;
	tool_calls?: Array<{ id: string; type: "function"; function: { name: string; arguments: string } }>;
	tool_call_id?: string;
	name?: string;
};

const SAVE_KNOWLEDGE_TOOL = {
	type: "function",
	function: {
		name: "saveKnowledge",
		description:
			"Guarda un dato de negocio confirmado por el dueño. Úsalo cuando el dueño indique un hecho del negocio (productos, servicios, precios, política).",
		parameters: {
			type: "object",
			properties: {
				question: { type: "string", description: "Pregunta representativa, ej: ¿Hacen cocinas integrales?" },
				answer: { type: "string", description: "Respuesta/contenido del dato de negocio" },
			},
			required: ["question", "answer"],
		},
	},
};

const NEEDS_HUMAN_TOOL = {
	type: "function",
	function: {
		name: "needsHuman",
		description:
			"Llama esta función UNICAMENTE si la respuesta NO está en el CONTEXTO del negocio. Recibe la pregunta original del visitante.",
		parameters: {
			type: "object",
			properties: { question: { type: "string", description: "Pregunta original del visitante" } },
			required: ["question"],
		},
	},
};

// RESPOND_TOOL removed to allow elite natural language responses

function buildContext(opts: {
	businessName: string;
	hours?: string | null;
	address?: string | null;
	phone?: string | null;
	whatsapp?: string | null;
	knowledge?: string | null;
}): string {
	return [
		`Nombre del negocio: ${opts.businessName}`,
		opts.hours ? `Horario de atención: ${opts.hours}` : null,
		opts.address ? `Dirección: ${opts.address}` : null,
		opts.phone ? `Teléfono: ${opts.phone}` : null,
		opts.whatsapp ? `WhatsApp: ${opts.whatsapp}` : null,
		opts.knowledge ? `Preguntas frecuentes y datos del negocio:\n${opts.knowledge}` : null,
	]
		.filter(Boolean)
		.join("\n");
}

function normalize(s: string): string {
	return s.replace(/\s+/g, " ").trim();
}

async function callOpenRouter(opts: {
	model: string;
	userMessage: string;
	isAdmin: boolean;
	tenantId: string;
	whatsapp: string;
	businessName: string;
	hours?: string | null;
	address?: string | null;
	phone?: string | null;
	knowledge?: string | null;
	extraSystemPrompt?: string | null;
}): Promise<{ content: string; usedAi: true }> {
	const key = process.env.OPEN_ROUTER_KEY ?? process.env.OPENROUTER_API_KEY;
	if (!key) throw new Error("OPEN_ROUTER_KEY no configurada");

	const ctx = buildContext(opts);
	const whatsappMsg = `Lo siento, esa información no la tengo cargada. Por favor escríbenos por WhatsApp al ${opts.whatsapp || ""} y un asesor te ayudará enseguida.`;

	// ---- Modo entrenador (dueño): enseña al bot con saveKnowledge ----
	if (opts.isAdmin) {
		const system = `Eres el modo ENTRENADOR hablando con el dueño del negocio "${opts.businessName}". Ya conoces los datos ACTUALES del negocio (ver CONTEXTO abajo). Tu trabajo es COMPLETAR o ACTUALIZAR la base de conocimiento:
- Cuando el dueño confirme o corrija CUALQUIER dato del negocio (productos, servicios, precios, política, horario, ubicación, contacto), usa la herramienta saveKnowledge para guardarlo.
- Si un dato YA aparece en el CONTEXTO y el dueño lo confirma o lo matiza, guárdalo igualmente con saveKnowledge (así se refuerza).
- NO le pidas confirmación de datos que ya están en el CONTEXTO. Si el dueño los menciona, regístralos directamente con saveKnowledge.
- Sé breve, directo y cercano con el dueño (en español).${opts.extraSystemPrompt ? `\n\nInstrucciones adicionales: ${opts.extraSystemPrompt}` : ""}`;
		const messages: ORMessage[] = [
			{ role: "system", content: `${system}\n\nCONTEXTO ACTUAL DEL NEGOCIO:\n${ctx}` },
			{ role: "user", content: opts.userMessage },
		];
		for (let step = 0; step < 4; step++) {
			const res = await fetch(OPENROUTER_URL, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${key}`,
					"Content-Type": "application/json",
					"HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
					"X-Title": "carvin",
				},
				body: JSON.stringify({
					model: opts.model,
					messages,
					tools: [SAVE_KNOWLEDGE_TOOL],
					tool_choice: "auto",
					max_tokens: 800,
					temperature: 0.7,
				}),
			});
			if (!res.ok) throw new Error(`OpenRouter ${res.status}`);
			const data = await res.json();
			const msg = data?.choices?.[0]?.message;
			if (msg?.tool_calls?.length) {
				messages.push({
					role: "assistant",
					content: msg.content ?? "",
					tool_calls: msg.tool_calls,
				});
				for (const tc of msg.tool_calls) {
					let result = "";
					try {
						const args = JSON.parse(tc.function?.arguments || "{}");
						await ChatbotKnowledgeService.upsert(
							opts.tenantId,
							args.question,
							args.answer,
							"admin_chat",
						);
						result = "Conocimiento guardado en la base de datos del negocio.";
						// Si lo enseñado coincide con una pregunta pendiente del
						// público, la cerramos para que deje de acumularse.
						const pendings = await ChatbotKnowledgeService.listPending(opts.tenantId);
						const taught = normalize(args.question || "").replace(/[¿?¡!.,]/g, "");
						const hit = pendings.find(
							(p) => normalize(p.question).replace(/[¿?¡!.,]/g, "") === taught,
						);
						if (hit) await ChatbotKnowledgeService.resolvePending(opts.tenantId, hit.id);
					} catch (e) {
						result = `Error: ${(e as Error).message}`;
					}
					messages.push({ role: "tool", tool_call_id: tc.id, name: tc.function?.name, content: result });
				}
				continue;
			}
			return { content: msg?.content ?? "Listo.", usedAi: true };
		}
		return { content: "Listo.", usedAi: true };
	}

	// ---- Público: respuestas con IA avanzada basadas en CONTEXTO ----
	const system = `Eres el asistente virtual experto y de élite de "${opts.businessName}". Tu misión es dar respuestas brillantes, muy amables y persuasivas usando ÚNICAMENTE la información en el CONTEXTO que se te entrega.
Reglas estrictas:
1) NUNCA inventes información, precios, direcciones o servicios que no estén explícitamente en el CONTEXTO. Si te preguntan algo que no está en el CONTEXTO, usa SIEMPRE la herramienta needsHuman.
2) Sé empático, comercial y resuelve las dudas del cliente con un tono premium.
3) Adapta la información del contexto para que suene natural. Usa emojis con elegancia.
4) Responde SIEMPRE en español.
5) Si te preguntan por "ubicación", "dónde están" o "dirección", responde con la "Dirección" provista en el CONTEXTO, sin importar si es una dirección exacta o solo una ciudad/región.
6) IMPORTANTE: Escribe ÚNICAMENTE el mensaje final que leerá el cliente. NO incluyas tu proceso de pensamiento, ni análisis, ni texto en inglés al inicio.${opts.extraSystemPrompt ? `\n\nInstrucciones adicionales: ${opts.extraSystemPrompt}` : ""}`;

	const res = await fetch(OPENROUTER_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json",
			"HTTP-Referer": process.env.APP_URL ?? "http://localhost:3000",
			"X-Title": "carvin",
		},
		body: JSON.stringify({
			model: opts.model,
			messages: [
				{ role: "system", content: `${system}\n\nCONTEXTO:\n${ctx}` },
				{ role: "user", content: opts.userMessage },
			],
			tools: [NEEDS_HUMAN_TOOL],
			tool_choice: "auto",
			max_tokens: 400,
			temperature: 0.5,
		}),
	});
	if (!res.ok) throw new Error(`OpenRouter ${res.status}`);

	const data = await res.json();
	const msg = data?.choices?.[0]?.message;
	const tc = extractToolCall(msg) ?? (msg?.tool_calls?.[0] as ToolCall | undefined);

	if (tc?.function?.name === "needsHuman") {
		let q = opts.userMessage;
		try {
			const a = JSON.parse(tc.function?.arguments || "{}");
			if (a.question) q = a.question;
		} catch {}
		await ChatbotKnowledgeService.logUnknown(opts.tenantId, q);
		return { content: whatsappMsg, usedAi: true };
	}

	// Si el modelo dio una respuesta natural basada en el contexto
	if (msg?.content && msg.content.trim().length > 0) {
		let finalContent = msg.content;
		// Remover bloques <think> generados por modelos de razonamiento (ej: DeepSeek-R1)
		finalContent = finalContent.replace(/<think>[\s\S]*?<\/think>\n*/g, "").trim();
		// Si el modelo no usó tags pero igual puso su razonamiento en inglés, esto ayuda a limpiarlo parcialmente, 
		// pero la instrucción en el prompt es la principal defensa.
		
		if (finalContent.length > 0) {
			return { content: finalContent, usedAi: true };
		}
	}

	// Fallback
	await ChatbotKnowledgeService.logUnknown(opts.tenantId, opts.userMessage);
	return { content: whatsappMsg, usedAi: true };
}

type ToolCall = { id?: string; type?: string; function: { name: string; arguments: string } };

/** Extrae un tool-call embebido como JSON en el content (formato [[{name,parameters}]]) */
function extractToolCall(msg: { content?: string; tool_calls?: ToolCall[] } | undefined): ToolCall | null {
	if (!msg?.content) return null;
	const raw = msg.content.trim();
	if (!raw.includes("respondFromContext") && !raw.includes("needsHuman") && !raw.includes("saveKnowledge"))
		return null;
	try {
		const parsed = JSON.parse(raw.replace(/^\[\[/, "[").replace(/\]\]$/, "]"));
		const arr = Array.isArray(parsed) ? parsed.flat() : [parsed];
		const call = arr.find((c: { name?: string; function?: { name?: string } }) => c?.name || c?.function?.name);
		if (!call) return null;
		const name = call.name || call.function?.name;
		const params = call.parameters || call.function?.parameters || {};
		return {
			function: { name, arguments: typeof params === "string" ? params : JSON.stringify(params) },
		};
	} catch {
		return null;
	}
}

/* ------------------------------- Servicio ----------------------------------- */

export class ChatService {
	static async send(
		tenantId: string,
		message: string,
		opts: { isAdmin?: boolean } = {},
	): Promise<{ user: ChatMessage; agent: ChatMessage }> {
		const isAdmin = !!opts.isAdmin;
		const userMessage = await persist(tenantId, "user", message);

		const config = await getWhiteLabelConfig(tenantId);
		const mode = config?.chatbotMode ?? "simple";
		const whatsapp = config?.whatsappNumber || "";
		const businessName = config?.businessName || "el negocio";

		let agentContent = autoReply(message);
		let usedAi = false;
		let matchedTag = false;

		const { buildDefaultChatbotTags } = await import("./chatbot.constants");
		const tagsToMatch = config?.chatbotTags?.length
			? config.chatbotTags
			: buildDefaultChatbotTags({
					businessName: config?.businessName,
					hours: config?.hours,
					address: config?.address,
					phone: config?.phone,
					whatsappNumber: config?.whatsappNumber,
			  });

		const normalizeMatch = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
		const exactMatch = tagsToMatch.find((t) => normalizeMatch(t.tag) === normalizeMatch(message));

		if (exactMatch && exactMatch.response) {
			agentContent = exactMatch.response;
			matchedTag = true;
		} else if (mode === "advanced") {
			try {
				const model = config?.aiModel || DEFAULT_FREE_MODEL;
				const knowledge = await ChatbotKnowledgeService.getContextText(tenantId);
				const r = await callOpenRouter({
					model,
					userMessage: message,
					isAdmin,
					tenantId,
					whatsapp,
					businessName,
					hours: config?.hours,
					address: config?.address,
					phone: config?.phone,
					knowledge,
					extraSystemPrompt: config?.aiSystemPrompt ?? config?.chatbotPrompt ?? null,
				});
				agentContent = r.content;
				usedAi = r.usedAi;
			} catch (e) {
				console.error("[chat] OpenRouter falló, usando fallback:", e);
				agentContent = autoReply(message);
				usedAi = false;
			}
		} else {
			// Modo simple: usar las respuestas predefinidas configuradas (chatbotTags).
			const matched = matchSimpleTag(message, config?.chatbotTags);
			if (matched) {
				agentContent = matched;
				matchedTag = true;
			}
		}

		// Registro de preguntas desconocidas en modo público cuando no hubo IA
		// ni coincidencia con un tag configurado. Evita doble registro.
		if (!isAdmin && !usedAi && !matchedTag && !KNOWN_KEYWORDS.test(message)) {
			await ChatbotKnowledgeService.logUnknown(tenantId, message);
		}

		const agentMessage = await persist(tenantId, "agent", agentContent);
		return { user: userMessage, agent: agentMessage };
	}

	static async list(tenantId: string, limit = 50): Promise<ChatMessage[]> {
		return db
			.select()
			.from(chatMessages)
			.where(eq(chatMessages.tenantId, tenantId))
			.orderBy(desc(chatMessages.createdAt))
			.limit(limit);
	}
}
