import { pgTable, text, timestamp, primaryKey } from "drizzle-orm/pg-core";

export const roles = pgTable("roles", {
	id: text("id").primaryKey(), // e.g. "admin", "user"
	name: text("name").notNull(),
	description: text("description"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
