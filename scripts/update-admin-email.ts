import "dotenv/config";
import { db } from "../src/db";
import { users } from "../src/db/schema/auth";
import { eq } from "drizzle-orm";

async function main() {
	console.log("Actualizando correo en la base de datos...");
	const result = await db.update(users).set({ email: "nolcarflo2057@gmail.com" }).where(eq(users.email, "admin@admin.com"));
	console.log("✅ ¡Correo actualizado exitosamente a nolcarflo2057@gmail.com!");
	process.exit(0);
}

main().catch(console.error);
