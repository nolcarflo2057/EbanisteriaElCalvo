"use server";

import { db } from "@/db";
import { tenantIntegrations } from "@/db/schema/core";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { eq } from "drizzle-orm";
import { IntegrationsInput, integrationsSchema } from "../../settings/schema/integrations.schema";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import { requireAuth } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";

/**
 * Verifica sesión activa y rol admin. Sin esto, cualquier usuario autenticado
 * podría leer/escribir IDs de tracking e inyectar scripts en la tienda pública.
 */
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

export async function getIntegrationsAction(): Promise<IntegrationsInput | null> {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		const [config] = await db
			.select()
			.from(tenantIntegrations)
			.where(eq(tenantIntegrations.tenantId, tenantId))
			.limit(1);

		if (!config) {
			return {
				ga4Enabled: false,
				ga4MeasurementId: "",
				metaPixelEnabled: false,
				metaPixelId: "",
				gtmEnabled: false,
				gtmContainerId: "",
			};
		}

		return {
			ga4Enabled: config.ga4Enabled ?? false,
			ga4MeasurementId: config.ga4MeasurementId ?? "",
			metaPixelEnabled: config.metaPixelEnabled ?? false,
			metaPixelId: config.metaPixelId ?? "",
			gtmEnabled: config.gtmEnabled ?? false,
			gtmContainerId: config.gtmContainerId ?? "",
		};
	} catch (error) {
		console.error("Error getting integrations:", error);
		return null;
	}
}

export async function updateIntegrationsAction(data: IntegrationsInput) {
	try {
		await verifyAdmin();
		const parsed = integrationsSchema.parse(data);
		const tenantId = await getTenantIdFromHeaders();

		await db
			.insert(tenantIntegrations)
			.values({
				tenantId,
				ga4Enabled: parsed.ga4Enabled,
				ga4MeasurementId: parsed.ga4MeasurementId || null,
				metaPixelEnabled: parsed.metaPixelEnabled,
				metaPixelId: parsed.metaPixelId || null,
				gtmEnabled: parsed.gtmEnabled,
				gtmContainerId: parsed.gtmContainerId || null,
			})
			.onConflictDoUpdate({
				target: tenantIntegrations.tenantId,
				set: {
					ga4Enabled: parsed.ga4Enabled,
					ga4MeasurementId: parsed.ga4MeasurementId || null,
					metaPixelEnabled: parsed.metaPixelEnabled,
					metaPixelId: parsed.metaPixelId || null,
					gtmEnabled: parsed.gtmEnabled,
					gtmContainerId: parsed.gtmContainerId || null,
					updatedAt: new Date(),
				},
			});

		// Invalidar caché de integraciones (usada por AnalyticsInjector en el sitio público)
		updateTag(`tenant-integrations:${tenantId}`);
		updateTag(`tenant:${tenantId}`);
		revalidateTag(`tenant-integrations:${tenantId}`, "default");
		revalidateTag(`tenant:${tenantId}`, "default");
		revalidatePath("/dashboard/settings/integrations");
		return { success: true };
	} catch (error) {
		console.error("Error updating integrations:", error);
		return { success: false, error: "Error al actualizar integraciones" };
	}
}
