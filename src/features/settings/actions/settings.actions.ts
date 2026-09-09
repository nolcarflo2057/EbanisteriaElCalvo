"use server";

import { requireAuth } from "@/lib/auth/auth-server";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { SettingsService } from "../services/settings.service";
import { RolesService } from "@/features/roles/services/roles.service";
import { revalidatePath } from "next/cache";
import type { TenantSettingsInput, TenantAppearanceInput } from "../schema/settings.schema";
import type { TenantSeoInput } from "../schema/seo.schema";
import type { TenantSocialInput } from "../schema/social.schema";
import type { TenantTrackingInput } from "../schema/tracking.schema";
import type { TenantLegalesInput } from "../schema/legales.schema";
import { getErrorMessage } from "@/lib/errors";

async function verifyAdmin() {
	const authResult = await requireAuth();
	if (!authResult.isAuth || !authResult.session) {
		throw new Error("No autenticado");
	}
	const isAdmin = await RolesService.hasRole(authResult.session.user.id, "admin");
	if (!isAdmin) {
		throw new Error("No autorizado");
	}
	return { userId: authResult.session.user.id };
}

export async function getSettingsAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const settings = await SettingsService.getSettings(tenantId);
		return { success: true, data: settings };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateSettingsAction(data: TenantSettingsInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateSettings(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getAppearanceAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const appearance = await SettingsService.getAppearance(tenantId);
		return { success: true, data: appearance };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateAppearanceAction(data: TenantAppearanceInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateAppearance(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getSeoAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const seo = await SettingsService.getSeo(tenantId);
		return { success: true, data: seo };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateSeoAction(data: TenantSeoInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateSeo(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getSocialAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const social = await SettingsService.getSocial(tenantId);
		return { success: true, data: social };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateSocialAction(data: TenantSocialInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateSocial(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getTrackingAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const tracking = await SettingsService.getTracking(tenantId);
		return { success: true, data: tracking };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateTrackingAction(data: TenantTrackingInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateTracking(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getCustomDomainAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const domain = await SettingsService.getCustomDomain(tenantId);
		return { success: true, data: domain };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateCustomDomainAction(domain: string | null) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateCustomDomain(userId, tenantId, domain);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function getLegalesAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const legales = await SettingsService.getLegales(tenantId);
		return { success: true, data: legales };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateLegalesAction(data: TenantLegalesInput) {
	try {
		const { userId } = await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const updated = await SettingsService.updateLegales(userId, tenantId, data);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}
