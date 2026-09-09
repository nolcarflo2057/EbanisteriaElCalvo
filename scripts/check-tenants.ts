import "dotenv/config";
import { db } from "../src/db";
import { tenants } from "../src/db/schema/core";

async function main() {
  const all = await db.select().from(tenants);
  console.log("TOTAL:", all.length);
  for (const t of all) console.log(JSON.stringify({ slug: t.slug, name: t.name, active: t.active, id: t.id }));
}
main().catch((e) => { console.error("ERR", e.message); process.exit(1); });
