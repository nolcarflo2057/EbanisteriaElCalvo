import { z } from "zod";

export const tenantLegalesSchema = z.object({
	privacyMarkdown: z.string().optional().default(""),
	termsMarkdown: z.string().optional().default(""),
	legalNoticeMarkdown: z.string().optional().default(""),
});

export type TenantLegalesInput = z.infer<typeof tenantLegalesSchema>;
