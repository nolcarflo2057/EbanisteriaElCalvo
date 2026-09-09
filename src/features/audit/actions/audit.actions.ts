"use server";

import { requireAuth } from "@/lib/auth/auth-server";
import { RolesService } from "@/features/roles/services/roles.service";
import { db } from "@/db";
import { auditLogs } from "@/db/schema/audit";
import { users } from "@/db/schema/auth";
import { desc, eq } from "drizzle-orm";

export async function getAuditLogsAction() {
	const { session, isAuth } = await requireAuth();
	if (!isAuth || !session) {
		return { error: "No autorizado" };
	}

	// Verificar si el usuario es administrador
	const isAdmin = await RolesService.hasRole(session.user.id, "admin");
	if (!isAdmin) {
		return { error: "Permisos insuficientes" };
	}

	try {
		const logs = await db
			.select({
				id: auditLogs.id,
				action: auditLogs.action,
				entity: auditLogs.entity,
				entityId: auditLogs.entityId,
				metadata: auditLogs.metadata,
				ipAddress: auditLogs.ipAddress,
				userAgent: auditLogs.userAgent,
				createdAt: auditLogs.createdAt,
				user: {
					name: users.name,
					email: users.email,
				},
			})
			.from(auditLogs)
			.leftJoin(users, eq(auditLogs.userId, users.id))
			.orderBy(desc(auditLogs.createdAt))
			.limit(100);

		return { success: true, logs };
	} catch (error) {
		console.error("Error fetching audit logs:", error);
		return { error: "Error al cargar la auditoría" };
	}
}
