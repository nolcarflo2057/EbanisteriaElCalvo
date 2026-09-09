import { db } from "@/db";
import { leads, tenantMembers } from "@/db/schema/core";
import { eq, desc, inArray } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";
import { NotificationsService } from "@/features/notifications/services/notifications.service";

export type LeadStatus = "new" | "contacted" | "converted" | "ignored";

export interface CreateLeadInput {
	tenantId: string;
	name: string;
	email?: string | null;
	phone?: string | null;
	message: string;
}

export interface Lead {
	id: string;
	tenantId: string;
	name: string;
	email: string | null;
	phone: string | null;
	message: string;
	status: string;
	createdAt: Date;
}

const LEAD_CACHE_TAG = (tenantId: string) => `tenant:${tenantId}:leads`;

export class LeadService {
	static async create(input: CreateLeadInput): Promise<Lead> {
		const [lead] = await db
			.insert(leads)
			.values({
				tenantId: input.tenantId,
				name: input.name,
				email: input.email || null,
				phone: input.phone || null,
				message: input.message,
				status: "new",
			})
			.returning();

		// Notify all tenant members in real-time
		try {
			const members = await db
				.select({ userId: tenantMembers.userId })
				.from(tenantMembers)
				.where(eq(tenantMembers.tenantId, input.tenantId));

			for (const member of members) {
				await NotificationsService.createAndNotify({
					userId: member.userId,
					title: "Nuevo Lead de Contacto",
					message: `Has recibido un mensaje de ${input.name}.`,
					type: "info",
					data: { leadId: lead.id },
				});
			}
		} catch (err) {
			console.error("Error sending real-time notification for lead:", err);
		}

		revalidateTag(LEAD_CACHE_TAG(input.tenantId), "default");
		return lead;
	}

	static async list(tenantId: string): Promise<Lead[]> {
		const cached = unstable_cache(
			async (id: string) => {
				return db
					.select()
					.from(leads)
					.where(eq(leads.tenantId, id))
					.orderBy(desc(leads.createdAt))
					.limit(200);
			},
			[LEAD_CACHE_TAG(tenantId)],
			{ tags: [LEAD_CACHE_TAG(tenantId)] }
		);

		return cached(tenantId);
	}

	static async updateStatus(leadId: string, status: LeadStatus): Promise<void> {
		const [lead] = await db
			.select({ tenantId: leads.tenantId })
			.from(leads)
			.where(eq(leads.id, leadId))
			.limit(1);

		if (!lead) return;

		await db.update(leads).set({ status }).where(eq(leads.id, leadId));
		revalidateTag(LEAD_CACHE_TAG(lead.tenantId), "default");
	}

	static async delete(leadId: string): Promise<void> {
		const [lead] = await db
			.select({ tenantId: leads.tenantId })
			.from(leads)
			.where(eq(leads.id, leadId))
			.limit(1);

		if (!lead) return;

		await db.delete(leads).where(eq(leads.id, leadId));
		revalidateTag(LEAD_CACHE_TAG(lead.tenantId), "default");
	}

	static async deleteMany(leadIds: string[]): Promise<void> {
		if (leadIds.length === 0) return;
		const [lead] = await db
			.select({ tenantId: leads.tenantId })
			.from(leads)
			.where(inArray(leads.id, leadIds))
			.limit(1);

		if (!lead) return;

		await db.delete(leads).where(inArray(leads.id, leadIds));
		revalidateTag(LEAD_CACHE_TAG(lead.tenantId), "default");
	}
}
