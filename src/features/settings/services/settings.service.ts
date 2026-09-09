import { unstable_cache, revalidateTag, updateTag } from "next/cache";
import { withTenant } from "@/core/tenant/tenant-context";
import { SettingsRepository } from "../repositories/settings.repository";
import { tenantSettingsSchema, tenantAppearanceSchema } from "../schema/settings.schema";
import { tenantSeoSchema } from "../schema/seo.schema";
import { tenantSocialSchema } from "../schema/social.schema";
import { tenantTrackingSchema } from "../schema/tracking.schema";
import { AuditService } from "@/features/audit/services/audit.service";
import type { TenantSettingsInput, TenantAppearanceInput } from "../schema/settings.schema";
import type { TenantSeoInput } from "../schema/seo.schema";
import type { TenantSocialInput } from "../schema/social.schema";
import type { TenantTrackingInput } from "../schema/tracking.schema";
import type { TenantThemeConfig } from "@/core/tenant/tenant-theme.types";

export class SettingsService {
	/**
	 * Obtiene la configuración general del tenant de forma optimizada mediante caché de Next.js.
	 */
	static async getSettings(tenantId: string) {
		return SettingsRepository.getSettings(tenantId);
	}

	/**
	 * Obtiene la configuración de apariencia visual del tenant de forma optimizada mediante caché de Next.js.
	 */
	static async getAppearance(tenantId: string) {
		return SettingsRepository.getAppearance(tenantId);
	}

	/**
	 * Actualiza la configuración regional y fiscal del tenant, invalida la caché y registra la auditoría.
	 */
	static async updateSettings(userId: string, tenantId: string, data: TenantSettingsInput) {
		const parsed = tenantSettingsSchema.parse(data);

		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateSettings(parsed)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:settings`);
		updateTag(`tenant-config:${tenantId}`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:settings`, "default");
		revalidateTag(`tenant-config:${tenantId}`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_settings",
			entityId: tenantId,
			metadata: parsed,
		});

		return updated;
	}

	/**
	 * Actualiza la identidad visual y los tokens estéticos del tenant, invalida la caché y registra la auditoría.
	 */
	static async updateAppearance(userId: string, tenantId: string, data: TenantAppearanceInput) {
		const parsed = tenantAppearanceSchema.parse(data);

		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateAppearance(parsed)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:appearance`);
		updateTag(`tenant-config:${tenantId}`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:appearance`, "default");
		revalidateTag(`tenant-config:${tenantId}`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_appearance",
			entityId: tenantId,
			metadata: parsed,
		});

		return updated;
	}

	/**
	 * Obtiene la configuración SEO del tenant desde tenants.settings (jsonb).
	 */
	static async getSeo(tenantId: string) {
		return SettingsRepository.getSeo(tenantId);
	}

	/**
	 * Actualiza la configuración SEO del tenant, invalida la caché y registra la auditoría.
	 */
	static async updateSeo(userId: string, tenantId: string, data: TenantSeoInput) {
		const parsed = tenantSeoSchema.parse(data);

		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateSeo(parsed)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:seo`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:seo`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_seo",
			entityId: tenantId,
			metadata: parsed,
		});

		return updated;
	}

	/**
	 * Obtiene la configuración Social (Open Graph / Twitter) del tenant desde tenants.settings (jsonb).
	 */
	static async getSocial(tenantId: string) {
		return SettingsRepository.getSocial(tenantId);
	}

	/**
	 * Actualiza la configuración Social del tenant, invalida la caché y registra la auditoría.
	 */
	static async updateSocial(userId: string, tenantId: string, data: TenantSocialInput) {
		const parsed = tenantSocialSchema.parse(data);

		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateSocial(parsed)
		);

		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:social`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:social`, "default");

		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_social",
			entityId: tenantId,
			metadata: parsed,
		});

		return updated;
	}

	/**
	 * Obtiene la configuración de tracking del tenant desde tenants.settings (jsonb).
	 */
	static async getTracking(tenantId: string) {
		return SettingsRepository.getTracking(tenantId);
	}

	/**
	 * Actualiza la configuración de tracking del tenant, invalida la caché y registra la auditoría.
	 */
	static async updateTracking(userId: string, tenantId: string, data: TenantTrackingInput) {
		const parsed = tenantTrackingSchema.parse(data);

		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateTracking(parsed)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:tracking`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:tracking`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_tracking",
			entityId: tenantId,
			metadata: parsed,
		});

		return updated;
	}

	/**
	 * Obtiene el dominio personalizado del tenant.
	 */
	static async getCustomDomain(tenantId: string) {
		return SettingsRepository.getCustomDomain(tenantId);
	}

	/**
	 * Actualiza el dominio personalizado del tenant.
	 */
	static async updateCustomDomain(userId: string, tenantId: string, domain: string | null) {
		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateCustomDomain(domain)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:custom-domain`);
		updateTag(`tenant-resolver:${domain || ""}`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:custom-domain`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_custom_domain",
			entityId: tenantId,
			metadata: { customDomain: domain },
		});

		return updated;
	}

	/**
	 * Obtiene las páginas legales (Privacidad, Términos) en formato Markdown.
	 */
	static async getLegales(tenantId: string) {
		return SettingsRepository.getLegales(tenantId);
	}

	/**
	 * Obtiene la configuración de diseño de componentes (themeConfig) del tenant.
	 */
	static async getThemeConfig(tenantId: string) {
		return SettingsRepository.getThemeConfig(tenantId);
	}

	/**
	 * Actualiza la configuración de diseño de componentes del tenant.
	 */
	static async updateThemeConfig(userId: string, tenantId: string, data: TenantThemeConfig) {
		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateThemeConfig(data)
		);

		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:theme-config`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:theme-config`, "default");

		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_theme_config",
			entityId: tenantId,
			metadata: data,
		});

		return updated;
	}

	/**
	 * Actualiza las páginas legales (Privacidad, Términos) en formato Markdown.
	 */
	static async updateLegales(userId: string, tenantId: string, data: { privacyMarkdown?: string; termsMarkdown?: string; legalNoticeMarkdown?: string }) {
		const updated = await withTenant({ tenantId }, () =>
			SettingsRepository.updateLegales(data)
		);

		// Invalidación de caché reactiva y localizada
		updateTag(`tenant:${tenantId}`);
		updateTag(`tenant:${tenantId}:legales`);
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}:legales`, "default");

		// Registro de auditoría obligatorio
		await AuditService.log({
			userId,
			action: "UPDATE",
			entity: "tenant_legales",
			entityId: tenantId,
			metadata: data,
		});

		return updated;
	}
}
