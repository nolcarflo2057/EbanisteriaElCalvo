import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema/auth";

async function check() {
	const allUsers = await db.select().from(users);
	console.log("Users in DB:", allUsers.map(u => ({ email: u.email, id: u.id, role: u.role })));
	process.exit(0);
}
check();
