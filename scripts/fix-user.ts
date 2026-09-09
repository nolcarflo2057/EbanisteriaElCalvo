import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema/auth";
import { tenantMembers, tenants } from "../src/db/schema/core";
import { eq } from "drizzle-orm";
import { auth } from "../src/lib/auth/auth";

async function fix() {
	const targetEmail = "nolcarflo2057@gmail.com";
	
	// 1. Give admin role to the user
	await db.update(users).set({ role: "admin", emailVerified: true }).where(eq(users.email, targetEmail));
	
	const user = await db.select().from(users).where(eq(users.email, targetEmail)).limit(1);
	if (!user[0]) {
		console.error("User not found!");
		process.exit(1);
	}

	const tenant = await db.select().from(tenants).limit(1);
	if (tenant[0]) {
		await db.update(users).set({ activeTenantId: tenant[0].id }).where(eq(users.email, targetEmail));
		
		await db
			.insert(tenantMembers)
			.values({ tenantId: tenant[0].id, userId: user[0].id, role: "admin" })
			.onConflictDoNothing();
		
		console.log("User updated to admin and linked to tenant.");
	} else {
		console.log("No tenant found!");
	}

	process.exit(0);
}
fix();
