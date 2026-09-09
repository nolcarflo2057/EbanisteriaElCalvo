import { z } from "zod";

export const leadSchema = z.object({
	name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(120),
	email: z.string().email("Correo inválido").optional().or(z.literal("")),
	phone: z.string().min(6, "Teléfono inválido").max(30).optional().or(z.literal("")),
	message: z.string().min(3, "El mensaje debe tener al menos 3 caracteres").max(2000),
});

export type LeadInput = z.infer<typeof leadSchema>;
