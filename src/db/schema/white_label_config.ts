import { pgTable, uuid, varchar, text, timestamp, serial, boolean, jsonb } from "drizzle-orm/pg-core";
import { tenants } from "./core";

export const whiteLabelConfig = pgTable("white_label_config", {
  id: serial("id").primaryKey(),
  tenantId: uuid("tenant_id")
    .notNull()
    .unique()
    .references(() => tenants.id, { onDelete: "cascade" }),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  hours: varchar("hours", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  extraInfo: text("extra_info"),
  logo: text("logo"),
  primaryColor: varchar("primary_color", { length: 7 }),
  secondaryColor: varchar("secondary_color", { length: 7 }),
  fontFamily: varchar("font_family", { length: 100 }),
  whatsappNumber: text("whatsapp_number"),
  whatsappMessage: text("whatsapp_message"),
  showWhatsapp: boolean("show_whatsapp").default(false).notNull(),
  showChatbot: boolean("show_chatbot").default(false).notNull(),
  chatbotMode: text("chatbot_mode").default('advanced').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  aiProvider: text("ai_provider"),
  aiModel: text("ai_model"),
  aiSystemPrompt: text("ai_system_prompt"),
  aiTemperature: varchar("ai_temperature", { length: 5 }),
  chatbotPrompt: text("chatbot_prompt"),
  chatbotModel: text("chatbot_model"),
  chatbotTemperature: varchar("chatbot_temperature", { length: 5 }),
  chatbotGreeting: text("chatbot_greeting"),
  chatbotTags: jsonb("chatbot_tags").$type<{ id: string; tag: string; response: string }[]>().default([])
});
