import { z } from "zod";

export const whiteLabelConfigSchema = z.object({
	slug: z.string().min(1, "El slug es obligatorio").max(100),
	businessName: z.string().min(1, "El nombre del negocio es obligatorio").max(255),
	hours: z.string().min(1, "El horario de atención es obligatorio").max(255),
	phone: z.string().min(1, "El teléfono es obligatorio").max(50),
	address: z.string().min(1, "La dirección es obligatoria"),
	extraInfo: z.string().nullable().optional(),
	logo: z.string().nullable().optional(),
	primaryColor: z.string().max(7).nullable().optional(),
	secondaryColor: z.string().max(7).nullable().optional(),
	fontFamily: z.string().max(100).nullable().optional(),
	contactEmail: z.string().email("Email de notificaciones inválido").nullable().optional(),
	whatsappNumber: z.string().nullable().optional(),
	whatsappMessage: z.string().nullable().optional(),
	showWhatsapp: z.boolean().default(false),
	showChatbot: z.boolean().default(false),
	chatbotMode: z.enum(["simple", "advanced"]).default("advanced"),
	// AI chatbot configuration
	aiProvider: z.string().nullable().optional(),
	aiModel: z.string().nullable().optional(),
	aiSystemPrompt: z.string().nullable().optional(),
	aiTemperature: z.string().nullable().optional(),
	chatbotPrompt: z.string().nullable().optional(),
	chatbotModel: z.string().nullable().optional(),
	chatbotTemperature: z.string().nullable().optional(),
	chatbotGreeting: z.string().nullable().optional(),
	chatbotTags: z.array(z.object({
		id: z.string(),
		tag: z.string().min(1, "La pregunta es obligatoria"),
		response: z.string().min(1, "La respuesta es obligatoria")
	})).default([]),
});

export type WhiteLabelConfigInput = z.infer<typeof whiteLabelConfigSchema>;
