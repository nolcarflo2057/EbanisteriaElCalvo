import { pgTable, text, timestamp, uuid, boolean, jsonb } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const notifications = pgTable("notifications", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }), // Usuario destinatario
	type: text("type").notNull().default("info"), // e.g. "info", "warning", "success", "alert"
	title: text("title").notNull(), // Título de la notificación
	message: text("message").notNull(), // Cuerpo del mensaje
	read: boolean("read").default(false).notNull(), // Si fue leída
	data: jsonb("data"), // Metadata flexible
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
