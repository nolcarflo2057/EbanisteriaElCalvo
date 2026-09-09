import { pgTable, text, uuid, timestamp, boolean, jsonb, index } from "drizzle-orm/pg-core";
import { tenants } from "./core";

export const globalAttributes = pgTable(
  "global_attributes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => tenants.id, { onDelete: "cascade" }),
    key: text("key").notNull(),
    name: text("name").notNull(),
    type: text("type").notNull().default("text"),
    allowedValues: jsonb("allowed_values").$type<string[]>().default([]),
    metadata: jsonb("metadata").$type<Record<string, any>>().default({}),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("global_attributes_tenantId_idx").on(table.tenantId),
  ],
);
