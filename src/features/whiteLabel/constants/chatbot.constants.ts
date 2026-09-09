/**
 * Tags por defecto del chatbot en modo "simple" (sin IA).
 * Deben coincidir con los botones rápidos que muestra el widget del chatbot.
 */
export const DEFAULT_SIMPLE_CHATBOT_TAGS = [
	"Horarios",
	"Ubicación",
	"Precios",
	"Contacto",
] as const;

export type ChatbotTag = {
	id: string;
	tag: string;
	response: string;
};

type ChatbotTagSource = {
	businessName?: string | null;
	hours?: string | null;
	address?: string | null;
	phone?: string | null;
	whatsappNumber?: string | null;
};

/**
 * Construye las entradas iniciales de `chatbotTags` para el modo simple,
 * precargando las respuestas con la información ya existente en la
 * configuración del negocio (horarios, ubicación, contacto) cuando está
 * disponible. "Precios" no tiene fuente de datos y queda vacío.
 * Usa el `crypto` global del navegador (disponible en cliente).
 */
export function buildDefaultChatbotTags(source: ChatbotTagSource = {}): ChatbotTag[] {
	const { businessName, hours, address, phone, whatsappNumber } = source;
	return [
		{
			id: crypto.randomUUID(),
			tag: "Horarios",
			response: hours ? `Nuestro horario de atención es ${hours}.` : "",
		},
		{
			id: crypto.randomUUID(),
			tag: "Ubicación",
			response: address ? `Nos encuentras en ${address}.` : "",
		},
		{
			id: crypto.randomUUID(),
			tag: "Precios",
			response: whatsappNumber
				? `Los precios varían según el proyecto. Te recomendamos enviar tu solicitud por el formulario "Pide tu presupuesto" de la página o por WhatsApp (https://wa.me/${whatsappNumber}) y recibirás una cotización personalizada.`
				: `Los precios varían según el proyecto. Te recomendamos enviar tu solicitud por el formulario "Pide tu presupuesto" de la página o por WhatsApp y recibirás una cotización personalizada.`,
		},
		{
			id: crypto.randomUUID(),
			tag: "Contacto",
			response: phone
				? `Puedes contactarnos al ${phone}.`
				: businessName
					? `Escríbenos para más información sobre ${businessName}.`
					: "",
		},
	];
}
