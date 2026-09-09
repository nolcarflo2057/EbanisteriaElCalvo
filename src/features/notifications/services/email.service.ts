import { db } from "@/db";
import { tenants, tenantSettings, tenantMembers, tenantAppearance } from "@/db/schema/core";
import { users } from "@/db/schema/auth";
import { eq, inArray } from "drizzle-orm";
import { transporter } from "@/lib/nodemailer";

const DEFAULT_FROM = process.env.EMAIL_FROM || "no-reply@carvin.dev";

interface StoreEmailInfo {
	storeName: string;
	fromEmail: string;
	ownerEmails: string[];
	primaryColor: string;
}

async function getStoreEmailInfo(tenantId: string): Promise<StoreEmailInfo> {
	const [store] = await db
		.select({ name: tenants.name, contactEmail: tenantSettings.contactEmail })
		.from(tenants)
		.leftJoin(tenantSettings, eq(tenantSettings.tenantId, tenants.id))
		.where(eq(tenants.id, tenantId))
		.limit(1);

	const [appearance] = await db
		.select({ primaryColor: tenantAppearance.primaryColor })
		.from(tenantAppearance)
		.where(eq(tenantAppearance.tenantId, tenantId))
		.limit(1);

	const members = await db
		.select({ email: users.email })
		.from(tenantMembers)
		.innerJoin(users, eq(users.id, tenantMembers.userId))
		.where(eq(tenantMembers.tenantId, tenantId));

	const ownerEmails = new Set<string>();
	members.forEach((m) => m.email && ownerEmails.add(m.email));
	if (store?.contactEmail) ownerEmails.add(store.contactEmail);

	return {
		storeName: store?.name || "Mi Tienda",
		// From siempre es un remitente verificado (EMAIL_FROM). El contactEmail del
		// cliente es el DESTINO (To), no el From, para cumplir politicas de SPF/DKIM.
		fromEmail: DEFAULT_FROM,
		ownerEmails: Array.from(ownerEmails),
		primaryColor: appearance?.primaryColor || "#F97316",
	};
}

function baseHtml(storeName: string, primaryColor: string, content: string): string {
	return `
		<div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 12px;">
			<div style="text-align: center; padding-bottom: 16px; border-bottom: 2px solid ${primaryColor};">
				<span style="font-size: 20px; font-weight: 700; color: #18181b;">${storeName}</span>
			</div>
			<div style="padding: 20px 0; color: #3f3f46; font-size: 15px; line-height: 1.6;">
				${content}
			</div>
			<hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
			<p style="font-size: 12px; color: #71717a; text-align: center; margin: 0;">
				Correo automático enviado por ${storeName}. Por favor no respondas a este mensaje.
			</p>
		</div>
	`;
}

export async function sendEmail(opts: { to: string; subject: string; html: string; from?: string; storeName?: string }) {
	try {
		const info = await transporter.sendMail({
			from: opts.from ? `"${opts.storeName || ""}" <${opts.from}>` : `"${opts.storeName || "Carvin"}" <${DEFAULT_FROM}>`,
			to: opts.to,
			subject: opts.subject,
			html: opts.html,
		return { success: true, messageId: info.messageId };
	} catch (error) {
		console.error("[email] error enviando a %s:", opts.to, error);
		return { success: false, error };
	}
}

export async function notifyNewLead({
	tenantId,
	leadId,
	name,
	email,
	phone,
	message,
}: {
	tenantId: string;
	leadId: string;
	name: string;
	email?: string | null;
	phone?: string | null;
	message: string;
}) {
	try {
		const info = await getStoreEmailInfo(tenantId);
		if (!info.ownerEmails.length) return { success: false, error: "Sin destinatarios" };

		const content = `
			<h2 style="color: #18181b; margin-top: 0;">Nuevo mensaje de contacto</h2>
			<p style="margin: 0 0 12px;">Has recibido un nuevo mensaje en tu landing page:</p>
			<div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0;">
				<p style="margin: 0;"><strong>Nombre:</strong> ${name}</p>
				${email ? `<p style="margin: 6px 0 0;"><strong>Email:</strong> ${email}</p>` : ""}
				${phone ? `<p style="margin: 6px 0 0;"><strong>Teléfono:</strong> ${phone}</p>` : ""}
				<p style="margin: 6px 0 0;"><strong>Referencia:</strong> #${leadId.slice(0, 8)}</p>
			</div>
			<div style="background-color: #fafafa; border-left: 3px solid ${info.primaryColor}; padding: 12px 16px; border-radius: 6px; margin: 12px 0;">
				<p style="margin: 0; white-space: pre-wrap;">${message}</p>
			</div>
			<p style="margin: 16px 0 0;">Revisa tus leads en el panel de control para responder a este cliente.</p>
		`;

		for (const ownerEmail of info.ownerEmails) {
			await sendEmail({
				to: ownerEmail,
				from: info.fromEmail,
				storeName: info.storeName,
				subject: `Nuevo mensaje de ${name}`,
				html: baseHtml(info.storeName, info.primaryColor, content),
			});
		}
		return { success: true };
	} catch (error) {
		console.error("[email] notifyNewLead:", error);
		return { success: false, error };
	}
}

export async function sendLeadConfirmationEmail({
	tenantId,
	to,
	name,
	message,
}: {
	tenantId: string;
	to: string;
	name: string;
	message: string;
}) {
	try {
		if (!to) return { success: false, error: "Sin email de destinatario" };
		const info = await getStoreEmailInfo(tenantId);

		const content = `
			<h2 style="color: #18181b; margin-top: 0;">¡Gracias por escribirnos, ${name}!</h2>
			<p>Hemos recibido tu mensaje correctamente. Nuestro equipo te responderá muy pronto.</p>
			<div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0;">
				<p style="margin: 0; font-size: 13px; color: #71717a;">Tu mensaje</p>
				<p style="margin: 6px 0 0; white-space: pre-wrap;">${message}</p>
			</div>
			<p style="margin: 16px 0 0;">Atentamente,<br />El equipo de <strong>${info.storeName}</strong></p>
		`;

		return await sendEmail({
			to,
			from: info.fromEmail,
			storeName: info.storeName,
			subject: `Recibimos tu mensaje, ${name}`,
			html: baseHtml(info.storeName, info.primaryColor, content),
		});
	} catch (error) {
		console.error("[email] sendLeadConfirmationEmail:", error);
		return { success: false, error };
	}
}

export async function notifyNewAppointment({
	tenantId,
	appointmentId,
	customerName,
	customerEmail,
	customerPhone,
	date,
	timeSlot,
	notes,
}: {
	tenantId: string;
	appointmentId: string;
	customerName: string;
	customerEmail?: string | null;
	customerPhone?: string | null;
	date: Date;
	timeSlot: string;
	notes?: string | null;
}) {
	try {
		const info = await getStoreEmailInfo(tenantId);
		if (!info.ownerEmails.length) return { success: false, error: "Sin destinatarios" };

		const formattedDate = new Intl.DateTimeFormat(info.ownerEmails.length ? "es" : "en", {
			dateStyle: "long",
			timeZone: "UTC",
		}).format(date);

		const content = `
			<h2 style="color: #18181b; margin-top: 0;">Nueva cita agendada</h2>
			<p style="margin: 0 0 12px;">Un cliente ha agendado una cita:</p>
			<div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0;">
				<p style="margin: 0;"><strong>Cliente:</strong> ${customerName}</p>
				${customerEmail ? `<p style="margin: 6px 0 0;"><strong>Email:</strong> ${customerEmail}</p>` : ""}
				${customerPhone ? `<p style="margin: 6px 0 0;"><strong>Teléfono:</strong> ${customerPhone}</p>` : ""}
				<p style="margin: 6px 0 0;"><strong>Fecha:</strong> ${formattedDate}</p>
				<p style="margin: 6px 0 0;"><strong>Hora:</strong> ${timeSlot}</p>
				${notes ? `<p style="margin: 6px 0 0;"><strong>Notas:</strong> ${notes}</p>` : ""}
			</div>
			<p style="margin: 16px 0 0;">Gestiona esta cita desde el panel de control.</p>
		`;

		for (const ownerEmail of info.ownerEmails) {
			await sendEmail({
				to: ownerEmail,
				from: info.fromEmail,
				storeName: info.storeName,
				subject: `Nueva cita de ${customerName}`,
				html: baseHtml(info.storeName, info.primaryColor, content),
			});
		}
		return { success: true };
	} catch (error) {
		console.error("[email] notifyNewAppointment:", error);
		return { success: false, error };
	}
}

export async function sendAppointmentConfirmationEmail({
	tenantId,
	to,
	customerName,
	date,
	timeSlot,
}: {
	tenantId: string;
	to: string;
	customerName: string;
	date: Date;
	timeSlot: string;
}) {
	try {
		if (!to) return { success: false, error: "Sin email de destinatario" };
		const info = await getStoreEmailInfo(tenantId);

		const formattedDate = new Intl.DateTimeFormat("es", {
			dateStyle: "long",
			timeZone: "UTC",
		}).format(date);

		const content = `
			<h2 style="color: #18181b; margin-top: 0;">¡Cita confirmada, ${customerName}!</h2>
			<p>Tu cita en <strong>${info.storeName}</strong> quedó registrada con los siguientes datos:</p>
			<div style="background-color: #f4f4f5; padding: 16px; border-radius: 8px; margin: 12px 0;">
				<p style="margin: 0;"><strong>Fecha:</strong> ${formattedDate}</p>
				<p style="margin: 6px 0 0;"><strong>Hora:</strong> ${timeSlot}</p>
			</div>
			<p style="margin: 16px 0 0;">Si necesitas reagendar o cancelar, por favor contáctanos.</p>
			<p style="margin: 12px 0 0;">Atentamente,<br />El equipo de <strong>${info.storeName}</strong></p>
		`;

		return await sendEmail({
			to,
			from: info.fromEmail,
			storeName: info.storeName,
			subject: `Tu cita en ${info.storeName} ha sido registrada`,
			html: baseHtml(info.storeName, info.primaryColor, content),
		});
	} catch (error) {
		console.error("[email] sendAppointmentConfirmationEmail:", error);
		return { success: false, error };
	}
}
