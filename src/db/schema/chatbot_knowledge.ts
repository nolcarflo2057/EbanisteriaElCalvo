import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./core";

/**
 * Memoria de negocio a largo plazo del chatbot (modo avanzado / IA).
 * Cada fila es un par pregunta-respuesta que la IA usa como contexto y que
 * el dueño puede alimentar vía dashboard o conversación de entrenamiento.
 */
export const knowledgeSourceEnum = pgEnum("knowledge_source", ["seed", "dashboard", "admin_chat"]);

export const chatbotKnowledge = pgTable("chatbot_knowledge", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenant_id")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	question: text("question").notNull(),
	answer: text("answer").notNull(),
	source: knowledgeSourceEnum("source").notNull().default("seed"),
	enabled: boolean("enabled").notNull().default(true),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Preguntas de visitantes que la IA no supo responder (modo público).
 * Se acumulan para que el dueño las conteste y alimente la base de conocimiento.
 */
export const unknownQuestionStatusEnum = pgEnum("unknown_question_status", ["pending", "resolved"]);

export const chatbotUnknownQuestions = pgTable("chatbot_unknown_questions", {
	id: uuid("id").primaryKey().defaultRandom(),
	tenantId: uuid("tenant_id")
		.notNull()
		.references(() => tenants.id, { onDelete: "cascade" }),
	question: text("question").notNull(),
	askedCount: integer("asked_count").notNull().default(1),
	status: unknownQuestionStatusEnum("status").notNull().default("pending"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	lastAskedAt: timestamp("last_asked_at").defaultNow().notNull(),
	resolvedAt: timestamp("resolved_at"),
});
