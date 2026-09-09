import { sql } from "drizzle-orm";

export async function up(db) {
  await db.run(sql`
    ALTER TABLE tenants
    ADD CONSTRAINT tenants_slug_unique UNIQUE (slug) ON CONFLICT DO NOTHING;
  `);
}

export async function down(db) {
  await db.run(sql`ALTER TABLE tenants DROP CONSTRAINT IF EXISTS tenants_slug_unique;`);
}
