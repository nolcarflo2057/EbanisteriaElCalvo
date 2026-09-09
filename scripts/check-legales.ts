import { db } from "@/core/db";
import { tenants } from "@/db/schema/core";
import { eq } from "drizzle-orm";

async function main() {
  const slug = process.argv[2] || "ebanisteria";
  const [row] = await db
    .select({ id: tenants.id, settings: tenants.settings })
    .from(tenants)
    .where(eq(tenants.slug, slug))
    .limit(1);

  if (!row) {
    console.log("NO TENANT", slug);
    return;
  }
  const legales = row.settings?.legales;
  console.log("legales present:", !!legales);
  console.log("privacyMarkdown:", JSON.stringify((legales?.privacyMarkdown ?? "<nulo>").toString().slice(0, 140)));
  console.log("termsMarkdown:", JSON.stringify((legales?.termsMarkdown ?? "<nulo>").toString().slice(0, 140)));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
