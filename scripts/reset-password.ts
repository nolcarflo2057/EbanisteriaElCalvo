import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema/auth";
import { tenantMembers, tenants } from "../src/db/schema/core";
import { eq } from "drizzle-orm";
import { auth } from "../src/lib/auth/auth";

async function reset() {
	const targetEmail = "nolcarflo2057@gmail.com";
	const newPassword = "N10124254";

	console.log(`Resetting user ${targetEmail}...`);

	// Delete user if exists to start fresh with known password
	const existingUser = await db.select().from(users).where(eq(users.email, targetEmail)).limit(1);
	if (existingUser.length > 0) {
		console.log("Deleting existing user to recreate with new password...");
		await db.delete(users).where(eq(users.email, targetEmail));
	}

	// Create user
	console.log("Creating user with specified password...");
	const response = await auth.api.signUpEmail({
		body: {
			email: targetEmail,
			password: newPassword,
			name: "Admin Ebanistería",
		},
	});

	if (!response?.user) {
		console.error("Failed to create user via better-auth");
		process.exit(1);
	}

	const userId = response.user.id;

	// Assign admin role
	console.log("Assigning admin role...");
	await db.update(users).set({ role: "admin", emailVerified: true }).where(eq(users.id, userId));

	// Link to tenant
	const tenant = await db.select().from(tenants).limit(1);
	if (tenant[0]) {
		await db.update(users).set({ activeTenantId: tenant[0].id }).where(eq(users.id, userId));
		
		await db
			.insert(tenantMembers)
			.values({ tenantId: tenant[0].id, userId: userId, role: "admin" })
			.onConflictDoNothing();
		
		console.log("User updated to admin and linked to tenant.");
	}

	console.log("✅ Done. Try logging in with:", targetEmail, newPassword);
	process.exit(0);
}

reset();
