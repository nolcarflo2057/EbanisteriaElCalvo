import { db } from "@/db";
import { chatbotKnowledge, chatbotUnknownQuestions } from "@/db/schema/chatbot_knowledge";
import { eq, and, desc, sql } from "drizzle-orm";

export type KnowledgeSource = "seed" | "dashboard" | "admin_chat";

export interface KnowledgeEntry {
	id: string;
	question: string;
	answer: string;
	source: KnowledgeSource;
	enabled: boolean;
}

export interface UnknownQuestion {
	id: string;
	question: string;
	askedCount: number;
	status: "pending" | "resolved";
	createdAt: string;
	lastAskedAt: string;
}

/**
 * Capa de datos de la memoria de negocio del chatbot.
 * No depende del SDK de IA: es seguro usarla en cualquier momento.
 */
export const ChatbotKnowledgeService = {
	async getEnabled(tenantId: string): Promise<KnowledgeEntry[]> {
		const rows = await db
			.select()
			.from(chatbotKnowledge)
			.where(and(eq(chatbotKnowledge.tenantId, tenantId), eq(chatbotKnowledge.enabled, true)))
			.orderBy(desc(chatbotKnowledge.updatedAt));
		return rows.map((r) => ({
			id: r.id,
			question: r.question,
			answer: r.answer,
			source: r.source,
			enabled: r.enabled,
		}));
	},

	/** Texto de contexto que se inyecta al system prompt de la IA. */
	async getContextText(tenantId: string): Promise<string> {
		const rows = await this.getEnabled(tenantId);
		if (!rows.length) return "";
		const body = rows.map((r) => `- P: ${r.question}\n  R: ${r.answer}`).join("\n");
		return `BASE DE CONOCIMIENTO DEL NEGOCIO:\n${body}`;
	},

	/** Crea o actualiza una entrada por pregunta (case-insensitive). */
	async upsert(
		tenantId: string,
		question: string,
		answer: string,
		source: KnowledgeSource = "admin_chat",
	): Promise<string> {
		const q = question.trim();
		const a = answer.trim();
		if (!q || !a) return "";
		const existing = await db
			.select()
			.from(chatbotKnowledge)
			.where(and(eq(chatbotKnowledge.tenantId, tenantId), sql`lower(${chatbotKnowledge.question}) = lower(${q})`))
			.limit(1);
		if (existing.length) {
			await db
				.update(chatbotKnowledge)
				.set({ answer: a, source, enabled: true, updatedAt: new Date() })
				.where(eq(chatbotKnowledge.id, existing[0].id));
			return existing[0].id;
		}
		const [row] = await db
			.insert(chatbotKnowledge)
			.values({ tenantId, question: q, answer: a, source })
			.returning();
		return row.id;
	},

	async remove(tenantId: string, id: string): Promise<void> {
		await db
			.delete(chatbotKnowledge)
			.where(and(eq(chatbotKnowledge.tenantId, tenantId), eq(chatbotKnowledge.id, id)));
	},

	/** Registra (o incrementa) una pregunta sin responder del modo público. */
	async logUnknown(tenantId: string, question: string): Promise<void> {
		const q = question.trim();
		if (!q) return;
		const existing = await db
			.select()
			.from(chatbotUnknownQuestions)
			.where(
				and(
					eq(chatbotUnknownQuestions.tenantId, tenantId),
					eq(chatbotUnknownQuestions.status, "pending"),
					sql`lower(${chatbotUnknownQuestions.question}) = lower(${q})`,
				),
			)
			.limit(1);
		if (existing.length) {
			await db
				.update(chatbotUnknownQuestions)
				.set({ askedCount: sql`${chatbotUnknownQuestions.askedCount} + 1`, lastAskedAt: new Date() })
				.where(eq(chatbotUnknownQuestions.id, existing[0].id));
			return;
		}
		await db.insert(chatbotUnknownQuestions).values({ tenantId, question: q });
	},

	async listPending(tenantId: string): Promise<UnknownQuestion[]> {
		const rows = await db
			.select()
			.from(chatbotUnknownQuestions)
			.where(and(eq(chatbotUnknownQuestions.tenantId, tenantId), eq(chatbotUnknownQuestions.status, "pending")))
			.orderBy(desc(chatbotUnknownQuestions.lastAskedAt));
		return rows.map((r) => ({
			id: r.id,
			question: r.question,
			askedCount: r.askedCount,
			status: r.status,
			createdAt: r.createdAt.toISOString(),
			lastAskedAt: r.lastAskedAt.toISOString(),
		}));
	},

	async resolvePending(tenantId: string, id: string): Promise<void> {
		await db
			.update(chatbotUnknownQuestions)
			.set({ status: "resolved", resolvedAt: new Date() })
			.where(and(eq(chatbotUnknownQuestions.tenantId, tenantId), eq(chatbotUnknownQuestions.id, id)));
	},
};
