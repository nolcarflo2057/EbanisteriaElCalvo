import { z } from "zod";

/**
 * Patrón seguro para IDs de tracking.
 * Solo permite letras, números, guiones y guiones bajos.
 */
const trackingIdPattern = /^[A-Za-z0-9-_]*$/;

export const integrationsSchema = z.object({
	ga4Enabled: z.boolean().default(false),
	ga4MeasurementId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "ID de Google Analytics inválido")
		.optional()
		.default(""),
	metaPixelEnabled: z.boolean().default(false),
	metaPixelId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "ID de Meta Pixel inválido")
		.optional()
		.default(""),
	gtmEnabled: z.boolean().default(false),
	gtmContainerId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "Container ID de GTM inválido")
		.optional()
		.default(""),
});

export type IntegrationsInput = z.infer<typeof integrationsSchema>;
