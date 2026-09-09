import { z } from "zod";

/**
 * Patrón seguro para IDs de tracking (Google Ads / GTM / Meta Pixel).
 * Solo permite [A-Za-z0-9-_] para evitar inyección de HTML en los scripts.
 */
const trackingIdPattern = /^[A-Za-z0-9-_]*$/;

export const tenantTrackingSchema = z.object({
	googleAdsId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "ID de Google Ads inválido")
		.optional()
		.default(""),
	facebookPixelId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "ID de Meta Pixel inválido")
		.optional()
		.default(""),
	gtmId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "Container ID de GTM inválido")
		.optional()
		.default(""),
	ga4MeasurementId: z
		.string()
		.max(40)
		.regex(trackingIdPattern, "ID de GA4 inválido")
		.optional()
		.default(""),
});

export type TenantTrackingInput = z.infer<typeof tenantTrackingSchema>;
