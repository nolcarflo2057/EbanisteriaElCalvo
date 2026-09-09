import { z } from "zod";

export const loginSchema = z.object({
	email: z.string().email({ message: "Por favor introduce un correo válido" }),
	password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
	name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
	email: z.string().email({ message: "Por favor introduce un correo válido" }),
	password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
