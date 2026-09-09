import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { getServerSession } from "@/lib/auth/session";
import { ChatService } from "@/features/whiteLabel/services/chat.service";
import { ChatbotKnowledgeService } from "@/features/whiteLabel/services/chatbot-knowledge.service";
import { NextRequest, NextResponse } from "next/server";

/**
 * Determina si el usuario autenticado es dueño/admin del tenant resuelto.
 */
async function resolveIsAdmin(tenantId: string): Promise<boolean> {
	try {
		const session = await getServerSession();
		const user = session?.user as { role?: string; activeTenantId?: string } | undefined;
		if (!user) return false;
		return user.role === "admin" && user.activeTenantId === tenantId;
	} catch {
		return false;
	}
}

/**
 * GET /api/chat?pending=1 → preguntas sin responder (solo admin del tenant).
 */
export async function GET(req: NextRequest) {
	const pending = req.nextUrl.searchParams.get("pending");
	if (pending !== "1") {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}
	try {
		const tenantId = await getTenantIdFromHeaders();
		if (!tenantId) return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
		const isAdmin = await resolveIsAdmin(tenantId);
		if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		const questions = await ChatbotKnowledgeService.listPending(tenantId);
		return NextResponse.json({ questions });
	} catch (error) {
		console.error("[chat] GET pending error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

/**
 * POST /api/chat — envía un mensaje al chatbot y persiste en chat_messages.
 * En modo avanzado usa IA; si el usuario es dueño (admin) activa el modo
 * entrenador que puede guardar conocimiento del negocio.
 */
export async function POST(req: NextRequest) {
	try {
		const tenantId = await getTenantIdFromHeaders();
		if (!tenantId) {
			return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
		}

		const body = await req.json();
		const message = typeof body?.message === "string" ? body.message.trim() : "";

		if (!message) {
			return NextResponse.json({ error: "Message is required" }, { status: 400 });
		}

		const isAdmin = await resolveIsAdmin(tenantId);
		const result = await ChatService.send(tenantId, message, { isAdmin });
		return NextResponse.json({ message: result.agent });
	} catch (error) {
		console.error("[chat] error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
