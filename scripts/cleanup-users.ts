import { Client } from "pg";
const c = new Client({ connectionString: "postgresql://neondb_owner:npg_wUBjA8M9xpsr@ep-curly-term-ay1gpyhc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require" });
c.connect().then(async () => {
  const keepEmail = "nolcarflo2057@gmail.com";
  const keepUser = await c.query("SELECT id FROM users WHERE email = $1", [keepEmail]);
  
  if (keepUser.rows.length === 0) {
    console.log("Usuario no existe, se creara via signup");
    await c.end();
    return;
  }
  
  const keepId = keepUser.rows[0].id;
  console.log("Manteniendo usuario:", keepId);

  await c.query("DELETE FROM sessions WHERE user_id != $1", [keepId]);
  await c.query("DELETE FROM audit_logs WHERE user_id != $1", [keepId]);
  await c.query("DELETE FROM accounts WHERE user_id != $1", [keepId]);
  await c.query("DELETE FROM files WHERE uploaded_by != $1", [keepId]);
  await c.query("DELETE FROM tenant_members WHERE user_id != $1", [keepId]);
  await c.query("DELETE FROM users WHERE id != $1", [keepId]);

  const users = await c.query("SELECT id,email,name FROM users");
  console.log("USERS:", JSON.stringify(users.rows));
  const accounts = await c.query("SELECT user_id FROM accounts");
  console.log("ACCOUNTS:", JSON.stringify(accounts.rows));
  await c.end();
}).catch(e => console.error(e.message));
