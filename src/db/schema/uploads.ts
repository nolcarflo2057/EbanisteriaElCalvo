import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";
import { users } from "./auth";

export const files = pgTable("files", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(), // Nombre del archivo original
	key: text("key").notNull().unique(), // Clave única de almacenamiento (S3, UploadThing)
	url: text("url").notNull(), // URL de acceso
	mimeType: text("mime_type").notNull(), // Tipo MIME (e.g. image/jpeg)
	size: integer("size").notNull(), // Tamaño en bytes
	uploadedBy: text("uploaded_by").references(() => users.id, { onDelete: "set null" }),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
