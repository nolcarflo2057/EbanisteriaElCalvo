import { NextRequest, NextResponse } from "next/server";
import { getTenantIdFromHeaders } from "@/core/tenant/server-store-id";
import { LeadService } from "@/features/leads/services/lead.service";
import { AuditService } from "@/features/audit/services/audit.service";

export async function POST(req: NextRequest) {
	try {
		const tenantId = await getTenantIdFromHeaders();
		if (!tenantId) {
			return NextResponse.json({ error: "Tenant not found" }, { status: 404 });
		}

		const body = await req.json();

		// Extract fields based on common key aliases
		const name = body.name || body.nombre || body.fullName || body.nombreCompleto || "Anónimo";
		const email = body.email || body.correo || body.emailContacto || body.correoElectronico || "";
		const phone = body.phone || body.telefono || body.telefonoContacto || body.celular || "";

		// Collect other fields to append to the message
		const primaryMessage = body.message || body.mensaje || body.detalles || body.comentario || "";
		
		const extraFields: string[] = [];
		for (const [key, value] of Object.entries(body)) {
			const lowerKey = key.toLowerCase();
			const isMapped = [
				"name", "nombre", "fullname", "nombrecompleto",
				"email", "correo", "emailcontacto", "correoelectronico",
				"phone", "telefono", "telefonocontacto", "celular",
				"message", "mensaje", "detalles", "comentario"
			].includes(lowerKey);

			if (!isMapped && value !== undefined && value !== null) {
				extraFields.push(`${key}: ${typeof value === "object" ? JSON.stringify(value) : value}`);
			}
		}

		let finalMessage = primaryMessage;
		if (extraFields.length > 0) {
			finalMessage = `${primaryMessage}\n\n[Información Adicional]\n${extraFields.join("\n")}`.trim();
		}

		if (!finalMessage) {
			finalMessage = "Formulario enviado sin mensaje.";
		}

		const lead = await LeadService.create({
			tenantId,
			name,
			email: email || null,
			phone: phone || null,
			message: finalMessage,
		});

		await AuditService.log({
			userId: null,
			action: "LEAD_CREATED",
			entity: "lead",
			entityId: lead.id,
			metadata: { tenantId, name },
		});

		return NextResponse.json({ success: true, leadId: lead.id }, { status: 201 });
	} catch (error) {
		console.error("[api/contact] POST error:", error);
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}
