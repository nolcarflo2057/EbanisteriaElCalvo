import { db } from "@/db";
import { auditLogs } from "@/db/schema/audit";
import { headers } from "next/headers";
import type { AuditParams } from "../types/audit.types";

export type { AuditParams } from "../types/audit.types";

export class AuditService {
	/**
	 * Registra una acción de auditoría de forma transversal.
	 * Puede ser llamado desde Server Actions, API Routes, controladores o scripts.
	 */
	static async log(params: AuditParams): Promise<void> {
		try {
			let ipAddress: string | null = null;
			let userAgent: string | null = null;

			// Intentar leer la IP y el UserAgent de la petición HTTP si estamos en un contexto de servidor
			try {
				const reqHeaders = await headers();
				ipAddress = reqHeaders.get("x-forwarded-for") || reqHeaders.get("x-real-ip");
				userAgent = reqHeaders.get("user-agent");
			} catch {
				// Ignorar errores si no estamos dentro de un request context de Next.js (e.g., cron o semillas)
			}

			await db.insert(auditLogs).values({
				userId: params.userId || null,
				action: params.action.toUpperCase(),
				entity: params.entity.toLowerCase(),
				entityId: params.entityId || null,
				metadata: params.metadata || {},
				ipAddress,
				userAgent,
			});
		} catch (error) {
			console.error("[AuditService] Error guardando log de auditoría:", error);
		}
	}
}
