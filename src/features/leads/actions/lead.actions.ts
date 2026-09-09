"use server";

import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { LeadService } from "@/features/leads/services/lead.service";
import { leadSchema, type LeadInput } from "@/features/leads/schema/lead.schema";
import { requireAuth } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";
import { AuditService } from "@/features/audit/services/audit.service";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { notifications } from "@/db/schema/notifications";
import { and, eq } from "drizzle-orm";
import { notifyNewLead, sendLeadConfirmationEmail } from "@/features/notifications/services/email.service";

/**
 * Envío de lead desde el formulario público del bloque `contact`.
 * No requiere autenticación: cualquiera puede escribir en la landing.
 */
export async function submitLeadAction(data: LeadInput) {
	try {
		const parsed = leadSchema.safeParse(data);
		if (!parsed.success) {
			const first = parsed.error.issues[0];
			return { error: first?.message || "Datos de contacto inválidos" };
		}

		const tenantId = await getTenantIdFromHeaders();

		const lead = await LeadService.create({
			tenantId,
			name: parsed.data.name,
			email: parsed.data.email || null,
			phone: parsed.data.phone || null,
			message: parsed.data.message,
		});

		await AuditService.log({
			userId: null,
			action: "LEAD_CREATED",
			entity: "lead",
			entityId: lead.id,
			metadata: { tenantId, name: parsed.data.name },
		});

		// Notificaciones por email (dueño + confirmación al cliente) sin bloquear la respuesta
		void notifyNewLead({
			tenantId,
			leadId: lead.id,
			name: parsed.data.name,
			email: parsed.data.email,
			phone: parsed.data.phone,
			message: parsed.data.message,
		});
		if (parsed.data.email) {
			void sendLeadConfirmationEmail({
				tenantId,
				to: parsed.data.email,
				name: parsed.data.name,
				message: parsed.data.message,
			});
		}

		return { success: true, leadId: lead.id };
	} catch (error: unknown) {
		console.error("[submitLeadAction]", error);
		return { error: "No se pudo enviar el mensaje. Intenta de nuevo." };
	}
}

async function assertAdminTenantId(): Promise<string | null> {
	const { session, isAuth } = await requireAuth();
	if (!isAuth || !session) return null;
	const isAdmin = await RolesService.hasRole(session.user.id, "admin");
	if (!isAdmin) return null;
	const tenantId = await getTenantIdFromHeaders();
	if (!tenantId) return null;
	return tenantId;
}

export async function getLeadsAction(requestedTenantId?: string) {
	try {
		const tenantId = requestedTenantId || await assertAdminTenantId();
		if (!tenantId) return { error: "No autorizado" };

		const leads = await LeadService.list(tenantId);
		return { success: true, leads, tenantId };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al cargar leads" };
	}
}

	export async function updateLeadStatusAction(leadId: string, status: "new" | "contacted" | "converted" | "ignored") {
	try {
		const tenantId = await assertAdminTenantId();
		if (!tenantId) return { error: "No autorizado" };

		await LeadService.updateStatus(leadId, status);
		revalidatePath("/dashboard/leads");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al actualizar el lead" };
	}
}

export async function deleteLeadAction(leadId: string) {
	try {
		const tenantId = await assertAdminTenantId();
		if (!tenantId) return { error: "No autorizado" };

		await LeadService.delete(leadId);
		revalidatePath("/dashboard/leads");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al eliminar el lead" };
	}
}

export async function deleteLeadsAction(leadIds: string[]) {
	try {
		const tenantId = await assertAdminTenantId();
		if (!tenantId) return { error: "No autorizado" };

		await LeadService.deleteMany(leadIds);
		revalidatePath("/dashboard/leads");
		return { success: true };
	} catch (error: unknown) {
		return { error: (error as Error).message || "Error al eliminar los leads" };
	}
}

export async function getNewLeadsCountAction() {
	try {
		const { session } = await requireAuth();
		if (!session) return { count: 0 };

		const results = await db
			.select()
			.from(notifications)
			.where(
				and(
					eq(notifications.userId, session.user.id),
					eq(notifications.read, false),
					eq(notifications.title, "Nuevo Lead de Contacto")
				)
			);

		return { success: true, count: results.length };
	} catch {
		return { count: 0 };
	}
}

export async function markLeadNotificationsAsReadAction() {
	try {
		const { session } = await requireAuth();
		if (!session) return { success: false };

		await db
			.update(notifications)
			.set({ read: true })
			.where(
				and(
					eq(notifications.userId, session.user.id),
					eq(notifications.title, "Nuevo Lead de Contacto"),
					eq(notifications.read, false)
				)
			);

		revalidatePath("/dashboard/leads");
		return { success: true };
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
}
