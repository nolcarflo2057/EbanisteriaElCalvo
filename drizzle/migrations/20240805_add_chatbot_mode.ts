import { sql } from "drizzle-orm";

export async function up(db) {
  await db.run(sql`
    ALTER TABLE white_label_config
    ADD COLUMN chatbot_mode TEXT NOT NULL DEFAULT 'advanced';
  `);
}

export async function down(db) {
  await db.run(sql`
    ALTER TABLE white_label_config
    DROP COLUMN chatbot_mode;
  `);
}
