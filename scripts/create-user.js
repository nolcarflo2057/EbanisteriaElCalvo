import { Client } from "pg";
const c = new Client({ connectionString: "postgresql://neondb_owner:npg_wUBjA8M9xpsr@ep-curly-term-ay1gpyhc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" });
c.connect().then(async () => {
  // Verificar usuarios existentes
  const existing = await c.query("SELECT id, email, email_verified FROM users");
  console.log("Usuarios actuales:", JSON.stringify(existing.rows, null, 2));
  
  // Crear nuevo usuario con mejor-auth format
  const newId = "usr_" + Date.now().toString(36);
  await c.query(
    "INSERT INTO users (id, email, name, email_verified, created_at) VALUES ($1, $2, $3, true, now())",
    [newId, "nolcarflo2057@gmail.com", "Nolberto Cardona"]
  );
  
  const r = await c.query("SELECT id, email, email_verified FROM users");
  console.log("Usuarios después:", JSON.stringify(r.rows, null, 2));
  await c.end();
}).catch(e => console.error(e.message));