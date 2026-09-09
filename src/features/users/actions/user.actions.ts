"use server";

import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { tenants } from "@/db/schema/core";
import { getServerSession } from "@/lib/auth/auth-server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/errors";

export async function getTenantsAction() {
	try {
		const session = await getServerSession();
		if (!session || session.user.role !== "admin") {
			return { success: false, error: "No autorizado" };
		}

		const allUsers = await db.select().from(users);
		const allTenants = await db.select().from(tenants);

		const tenantsList = allUsers.map((user) => {
			const tenant = user.activeTenantId
				? allTenants.find((t) => t.id === user.activeTenantId)
				: null;
			return {
				id: user.id,
				name: user.name,
				email: user.email,
				role: user.role,
				tenantId: tenant?.id ?? null,
			};
		});

		return { success: true, tenants: tenantsList };
	} catch (error: unknown) {
		console.error("Error fetching tenants:", error);
		return { success: false, error: getErrorMessage(error) };
	}
}

export async function setActiveTenantAction(userId: string, tenantId: string) {
	try {
		const session = await getServerSession();
		if (!session || session.user.role !== "admin") {
			return { success: false, error: "No autorizado" };
		}

		await db
			.update(users)
			.set({ activeTenantId: tenantId })
			.where(eq(users.id, userId));

		revalidatePath("/admin/users");
		return { success: true };
	} catch (error: unknown) {
		console.error("Error setting active tenant:", error);
		return { success: false, error: getErrorMessage(error) };
	}
}
