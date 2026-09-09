import { pgTable, uuid, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./core";

export const chatSenderEnum = pgEnum("chat_sender", ["user", "agent"]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  tenantId: uuid("tenant_id")
    .notNull()
    .references(() => tenants.id, { onDelete: "cascade" }),
  sender: chatSenderEnum("sender").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
