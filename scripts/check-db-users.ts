import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema/auth";

async function main() {
  const allUsers = await db.select().from(users);
  console.log("Usuarios en BD:", allUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));
  process.exit(0);
}

main().catch(console.error);
