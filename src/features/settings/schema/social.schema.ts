import { z } from "zod";

export const tenantSocialSchema = z.object({
	ogTitle: z.string().max(70, "Máximo 70 caracteres").optional().default(""),
	ogDescription: z.string().max(160, "Máximo 160 caracteres").optional().default(""),
	ogImage: z.string().optional().default(""),
	twitterCard: z.enum(["summary", "summary_large_image"]).optional().default("summary_large_image"),
});

export type TenantSocialInput = z.infer<typeof tenantSocialSchema>;
