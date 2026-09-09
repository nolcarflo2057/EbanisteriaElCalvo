import "dotenv/config";
import { auth } from "../src/lib/auth/auth";

async function main() {
  try {
    console.log("Intentando iniciar sesión con nolcarflo2057@gmail.com y N10124254...");
    const res = await auth.api.signInEmail({
      body: {
        email: "nolcarflo2057@gmail.com",
        password: "N10124254"
      }
    });
    console.log("Login exitoso:", !!res?.user);
  } catch (error: any) {
    console.error("Fallo el login:", error.message || error);
  }
  process.exit(0);
}

main().catch(console.error);
