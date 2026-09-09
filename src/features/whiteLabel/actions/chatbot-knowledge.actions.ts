"use server";

import { getServerSession } from "@/lib/auth/session";
import { ChatbotKnowledgeService } from "@/features/whiteLabel/services/chatbot-knowledge.service";

async function requireTenant(): Promise<string> {
	const session = await getServerSession();
	const user = session?.user as { role?: string; activeTenantId?: string } | undefined;
	if (!user || user.role !== "admin" || !user.activeTenantId) {
		throw new Error("No autorizado");
	}
	return user.activeTenantId;
}

export async function listKnowledgeAction() {
	const tenantId = await requireTenant();
	return ChatbotKnowledgeService.getEnabled(tenantId);
}

export async function listPendingAction() {
	const tenantId = await requireTenant();
	return ChatbotKnowledgeService.listPending(tenantId);
}

export async function upsertKnowledgeAction(question: string, answer: string) {
	const q = (question || "").trim();
	const a = (answer || "").trim();
	if (!q || !a) throw new Error("Pregunta y respuesta son requeridas");
	const tenantId = await requireTenant();
	return ChatbotKnowledgeService.upsert(tenantId, q, a, "dashboard");
}

export async function deleteKnowledgeAction(id: string) {
	const tenantId = await requireTenant();
	await ChatbotKnowledgeService.remove(tenantId, id);
}

export async function answerPendingAction(id: string, question: string, answer: string) {
	const q = (question || "").trim();
	const a = (answer || "").trim();
	if (!q || !a) throw new Error("Pregunta y respuesta son requeridas");
	const tenantId = await requireTenant();
	await ChatbotKnowledgeService.upsert(tenantId, q, a, "dashboard");
	await ChatbotKnowledgeService.resolvePending(tenantId, id);
}
