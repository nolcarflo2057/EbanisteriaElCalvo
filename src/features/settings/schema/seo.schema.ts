import { z } from "zod";

export const tenantSeoSchema = z.object({
	title: z.string().max(70, "Máximo 70 caracteres").optional().default(""),
	description: z.string().max(160, "Máximo 160 caracteres").optional().default(""),
	keywords: z.string().optional().default(""),
	canonicalUrl: z
		.union([z.literal(""), z.string().url("Debe ser una URL válida")])
		.optional()
		.default(""),
	robots: z
		.enum(["index,follow", "noindex,follow", "index,nofollow", "noindex,nofollow"])
		.optional()
		.default("index,follow"),
	jsonLd: z
		.string()
		.optional()
		.default("")
		.refine(
			(v) => {
				if (!v) return true;
				try {
					JSON.parse(v);
					return true;
				} catch {
					return false;
				}
			},
			{ message: "El JSON-LD no es un JSON válido" }
		),
});

export type TenantSeoInput = z.infer<typeof tenantSeoSchema>;
