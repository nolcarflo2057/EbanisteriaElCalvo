import { sql } from "drizzle-orm";

export async function up(db) {
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS white_label_config (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(100) NOT NULL UNIQUE,
      "business_name" VARCHAR(255) NOT NULL,
      hours VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NOT NULL,
      address TEXT NOT NULL,
      extra_info TEXT
    );
  `);
}

export async function down(db) {
  await db.run(sql`DROP TABLE IF EXISTS white_label_config;`);
}
