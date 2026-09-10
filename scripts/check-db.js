import { Client } from "pg";

const client = new Client({
  connectionString: "postgresql://neondb_owner:npg_wUBjA8M9xpsr@ep-curly-term-ay1gpyhc-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
});

async function main() {
  await client.connect();
  
  // List all tables
  const tables = await client.query(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public'"
  );
  
  console.log("=== TABLAS EN LA DB NUEVA ===");
  const tableNames = [];
  for (const t of t.rows) {
    const countResp = await client.query(`SELECT count(*) as count FROM "${t.tablename}"`);
    console.log(`  ${t.tablename}: ${r.rows[0].count} registros`);
    tableNames.push(t.tablename);
  }
  
  // Try to get data from key tables
  const keyTables = ["tenants", "white_label_config", "users", "sessions"];
  for (const table of keyTables) {
    if (tableNames.includes(table)) {
      const r = await client.query(`SELECT * FROM "${table}" LIMIT 3`);
      console.log(`\n${table}:`);
      console.log(JSON.stringify(r.rows, null, 2));
    }
  }
  
  await client.end();
}

main().catch(console.error);