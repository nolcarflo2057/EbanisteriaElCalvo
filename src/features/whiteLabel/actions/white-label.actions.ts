"use server";

import { db } from "@/db";
import { tenantSettings } from "@/db/schema/core";
import { eq } from "drizzle-orm";
import { requireAuth } from "@/lib/auth/auth-server";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { RolesService } from "@/features/roles/services/roles.service";
import { getWhiteLabelConfig, upsertWhiteLabelConfig } from "../services/config.service";
import { whiteLabelConfigSchema, type WhiteLabelConfigInput } from "../schema/white-label.schema";
import { revalidatePath } from "next/cache";
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

export async function getWhiteLabelConfigAction() {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		if (!tenantId) {
			return { success: false, error: "Tenant no encontrado" };
		}
		const config = await getWhiteLabelConfig(tenantId);
		return { success: true, data: config };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function updateWhiteLabelConfigAction(data: WhiteLabelConfigInput) {
	try {
		await verifyAdmin();
		const tenantId = await getTenantIdFromHeaders();
		if (!tenantId) {
			return { success: false, error: "Tenant no encontrado" };
		}

		// Validar datos con Zod
		const validated = whiteLabelConfigSchema.parse(data);

		// Guardar contactEmail en tenantSettings para que lleguen los leads al correo configurado
		if (validated.contactEmail) {
			await db
				.update(tenantSettings)
				.set({ contactEmail: validated.contactEmail })
				.where(eq(tenantSettings.tenantId, tenantId));
		}

		const updated = await upsertWhiteLabelConfig(tenantId, validated);
		revalidatePath("/", "layout");
		return { success: true, data: updated };
	} catch (error: unknown) {
		return { success: false, error: getErrorMessage(error) };
	}
}
