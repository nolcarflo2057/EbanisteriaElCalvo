import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const auditLogs = pgTable("audit_logs", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id").references(() => users.id, { onDelete: "set null" }), // Quién lo hizo (null = sistema/anónimo)
	action: text("action").notNull(), // Acción realizada (e.g., "CREATE", "UPDATE", "DELETE", "AUTH_LOGIN")
	entity: text("entity").notNull(), // Nombre de la entidad/tabla afectada (e.g., "products", "users")
	entityId: text("entity_id"), // ID de la fila afectada
	metadata: jsonb("metadata"), // Datos adicionales o delta anterior/nuevo
	ipAddress: text("ip_address"), // IP del cliente
	userAgent: text("user_agent"), // Navegador/dispositivo
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
