import { db } from "@/db";
import { tenantSettings, tenantAppearance, tenants } from "@/db/schema/core";
import { eq } from "drizzle-orm";
import { requireTenantContext } from "@/core/tenant/tenant-context";
import type { TenantSettingsInput, TenantAppearanceInput } from "../schema/settings.schema";
import type { TenantSeoInput } from "../schema/seo.schema";
import type { TenantSocialInput } from "../schema/social.schema";
import type { TenantTrackingInput } from "../schema/tracking.schema";
import type { TenantThemeConfig } from "@/core/tenant/tenant-theme.types";
import { DEFAULT_THEME_CONFIG } from "@/core/tenant/tenant-theme.types";

export class SettingsRepository {
	static async getSettings(tenantId: string) {
		const result = await db
			.select({
				tenantId: tenantSettings.tenantId,
				currency: tenantSettings.currency,
				locale: tenantSettings.locale,
				timezone: tenantSettings.timezone,
				taxRate: tenantSettings.taxRate,
				shippingCost: tenantSettings.shippingCost,
				contactEmail: tenantSettings.contactEmail,
				contactPhone: tenantSettings.contactPhone,
				name: tenants.name,
			})
			.from(tenantSettings)
			.innerJoin(tenants, eq(tenants.id, tenantSettings.tenantId))
			.where(eq(tenantSettings.tenantId, tenantId))
			.limit(1);
		
		return result[0] || null;
	}

	static async getAppearance(tenantId: string) {
		const result = await db
			.select()
			.from(tenantAppearance)
			.where(eq(tenantAppearance.tenantId, tenantId))
			.limit(1);

		return result[0] || null;
	}



	static async updateSettings(data: TenantSettingsInput) {
		const { tenantId } = requireTenantContext();
		
		// Actualizar el nombre en la tabla tenants
		await db
			.update(tenants)
			.set({ name: data.name })
			.where(eq(tenants.id, tenantId));

		const [updated] = await db
			.insert(tenantSettings)
			.values({
				tenantId,
				currency: data.currency,
				locale: data.locale,
				timezone: data.timezone,
				taxRate: data.taxRate,
				shippingCost: data.shippingCost,
				contactEmail: data.contactEmail,
				contactPhone: data.contactPhone,
			})
			.onConflictDoUpdate({
				target: [tenantSettings.tenantId],
				set: {
					currency: data.currency,
					locale: data.locale,
					timezone: data.timezone,
					taxRate: data.taxRate,
					shippingCost: data.shippingCost,
					contactEmail: data.contactEmail,
					contactPhone: data.contactPhone,
				},
			})
			.returning();

		return {
			...updated,
			name: data.name,
		};
	}

	static async updateAppearance(data: TenantAppearanceInput) {
		const { tenantId } = requireTenantContext();

		const themeConfig = {
			buttonStyle: data.themeConfig?.buttonStyle ?? "rounded",
			navbarStyle: data.themeConfig?.navbarStyle ?? "glass",
			widgetShape: data.themeConfig?.widgetShape ?? "circle",
			colorScheme: {
				primary: data.primaryColor,
				secondary: data.secondaryColor,
				accent: data.accentColor,
			},
		};

		const [updated] = await db
			.insert(tenantAppearance)
			.values({
				tenantId,
				logoUrl: data.logoUrl,
				logoDarkUrl: data.logoDarkUrl,
				faviconUrl: data.faviconUrl,
				primaryColor: data.primaryColor,
				secondaryColor: data.secondaryColor,
				accentColor: data.accentColor,
				borderRadius: data.borderRadius,
				shadowStyle: data.shadowStyle,
				fontSettings: data.fontSettings,
				themeConfig,
			})
			.onConflictDoUpdate({
				target: [tenantAppearance.tenantId],
				set: {
					logoUrl: data.logoUrl,
					logoDarkUrl: data.logoDarkUrl,
					faviconUrl: data.faviconUrl,
					primaryColor: data.primaryColor,
					secondaryColor: data.secondaryColor,
					accentColor: data.accentColor,
					borderRadius: data.borderRadius,
					shadowStyle: data.shadowStyle,
					fontSettings: data.fontSettings,
					themeConfig,
				},
			})
			.returning();

		return updated;
	}

	static async getSeo(tenantId: string) {
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return row?.settings?.seo ?? null;
	}

	static async updateSeo(data: TenantSeoInput) {
		const { tenantId } = requireTenantContext();
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		const current = row?.settings ?? {};

		await db
			.update(tenants)
			.set({
				settings: {
					...current,
					seo: {
						title: data.title,
						description: data.description,
						keywords: data.keywords,
						canonicalUrl: data.canonicalUrl,
						robots: data.robots,
						jsonLd: data.jsonLd,
					},
				},
				updatedAt: new Date(),
			})
			.where(eq(tenants.id, tenantId));

		return data;
	}

	static async getSocial(tenantId: string) {
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return row?.settings?.social ?? null;
	}

	static async updateSocial(data: TenantSocialInput) {
		const { tenantId } = requireTenantContext();
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		const current = row?.settings ?? {};

		await db
			.update(tenants)
			.set({
				settings: {
					...current,
					social: {
						ogTitle: data.ogTitle,
						ogDescription: data.ogDescription,
						ogImage: data.ogImage,
						twitterCard: data.twitterCard,
					},
				},
				updatedAt: new Date(),
			})
			.where(eq(tenants.id, tenantId));

		return data;
	}

	static async getTracking(tenantId: string) {
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return row?.settings?.tracking ?? null;
	}

	static async updateTracking(data: TenantTrackingInput) {
		const { tenantId } = requireTenantContext();
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		const current = row?.settings ?? {};

		await db
			.update(tenants)
			.set({
				settings: {
					...current,
					tracking: {
						googleAdsId: data.googleAdsId,
						facebookPixelId: data.facebookPixelId,
						gtmId: data.gtmId,
					},
				},
				updatedAt: new Date(),
			})
			.where(eq(tenants.id, tenantId));

		return data;
	}

	static async getCustomDomain(tenantId: string) {
		const [row] = await db
			.select({ customDomain: tenants.customDomain })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return row?.customDomain ?? null;
	}

	static async updateCustomDomain(domain: string | null) {
		const { tenantId } = requireTenantContext();
		await db
			.update(tenants)
			.set({
				customDomain: domain,
				updatedAt: new Date(),
			})
			.where(eq(tenants.id, tenantId));

		return domain;
	}

	static async getLegales(tenantId: string) {
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		return row?.settings?.legales ?? null;
	}

	static async updateLegales(data: { privacyMarkdown?: string; termsMarkdown?: string; legalNoticeMarkdown?: string }) {
		const { tenantId } = requireTenantContext();
		const [row] = await db
			.select({ settings: tenants.settings })
			.from(tenants)
			.where(eq(tenants.id, tenantId))
			.limit(1);

		const current = row?.settings ?? {};

		await db
			.update(tenants)
			.set({
				settings: {
					...current,
					legales: {
						privacyMarkdown: data.privacyMarkdown ?? "",
						termsMarkdown: data.termsMarkdown ?? "",
						legalNoticeMarkdown: data.legalNoticeMarkdown ?? "",
					},
				},
				updatedAt: new Date(),
			})
			.where(eq(tenants.id, tenantId));

		return data;
	}

	/**
	 * Obtiene la configuración de tema (diseño de componentes) del tenant.
	 * Si no existe themeConfig en BD, retorna los defaults.
	 */
	static async getThemeConfig(tenantId: string): Promise<TenantThemeConfig> {
		const [row] = await db
			.select({ themeConfig: tenantAppearance.themeConfig })
			.from(tenantAppearance)
			.where(eq(tenantAppearance.tenantId, tenantId))
			.limit(1);

		return row?.themeConfig ?? DEFAULT_THEME_CONFIG;
	}

	/**
	 * Actualiza la configuración de tema (diseño de componentes) del tenant.
	 */
	static async updateThemeConfig(data: TenantThemeConfig) {
		const { tenantId } = requireTenantContext();
		const [updated] = await db
			.insert(tenantAppearance)
			.values({
				tenantId,
				themeConfig: data,
			})
			.onConflictDoUpdate({
				target: [tenantAppearance.tenantId],
				set: {
					themeConfig: data,
				},
			})
			.returning();

		return updated;
	}

}
