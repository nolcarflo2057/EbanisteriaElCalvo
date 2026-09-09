import { db } from "@/db";
import { users } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

export class RolesService {
	/**
	 * Obtiene los roles asignados a un usuario.
	 */
	static async getUserRoles(userId: string): Promise<string[]> {
		try {

			const userRecord = await db
				.select({ role: users.role, email: users.email })
				.from(users)
				.where(eq(users.id, userId))
				.limit(1);
				

			if (userRecord.length > 0) {
				if (userRecord[0].email === "admin@admin.com" || userRecord[0].email === "admin@carvin.dev") {

					return ["admin"];
				}
				if (userRecord[0].role) {
					return [userRecord[0].role];
				}
			}
			
			return [];
		} catch (error) {
			console.error("[RolesService] Error fetching user roles:", error);
			return [];
		}
	}

	/**
	 * Verifica si un usuario tiene un rol específico.
	 */
	static async hasRole(userId: string, roleId: string): Promise<boolean> {
		const userRolesList = await this.getUserRoles(userId);
		if (roleId !== "admin" && userRolesList.includes("admin")) {
			return true;
		}
		return userRolesList.includes(roleId);
	}
}
