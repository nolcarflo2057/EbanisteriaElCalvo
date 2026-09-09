import { z } from "zod";

export const tenantSettingsSchema = z.object({
	name: z.string().min(1, "El nombre del tenant es requerido"),
	currency: z.string().min(1).default("USD"),
	locale: z.string().min(1).default("en-US"),
	timezone: z.string().min(1).default("UTC"),
	taxRate: z.string().regex(/^\d+(\.\d{1,2})?$/).default("0.00"),
	shippingCost: z.coerce.number().int().min(0).default(0),
	contactEmail: z.string().email("Email inválido").nullable().optional().or(z.literal("")),
	contactPhone: z.string().nullable().optional().or(z.literal("")),
});

export const themeConfigSchema = z.object({
	buttonStyle: z.enum(["rounded", "pill", "sharp"]).default("rounded"),
	navbarStyle: z.enum(["glass", "solid", "transparent"]).default("glass"),
	widgetShape: z.enum(["circle", "rounded", "square"]).default("circle"),
});

export const tenantAppearanceSchema = z.object({
	logoUrl: z.string().url().nullable().optional().or(z.literal("")),
	logoDarkUrl: z.string().url().nullable().optional().or(z.literal("")),
	faviconUrl: z.string().url().nullable().optional().or(z.literal("")),
	primaryColor: z.string().min(1).default("#F97316"),
	secondaryColor: z.string().min(1).default("#F4F4F5"),
	accentColor: z.string().min(1).default("#EA580C"),
	borderRadius: z.string().min(1).default("0.375rem"),
	shadowStyle: z.string().min(1).default("shadow-xs"),
	fontSettings: z.object({
		sans: z.string().optional(),
		serif: z.string().optional(),
		mono: z.string().optional(),
	}).default({}),
	themeConfig: themeConfigSchema.default({}),
});

export type TenantSettingsInput = z.infer<typeof tenantSettingsSchema>;
export type TenantAppearanceInput = z.infer<typeof tenantAppearanceSchema>;
export type ThemeConfigInput = z.infer<typeof themeConfigSchema>;
