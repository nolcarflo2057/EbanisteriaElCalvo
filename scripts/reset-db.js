const { Client } = require('pg');
require('dotenv').config();

async function resetDb() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to DB, dropping schema...');
    await client.query('DROP SCHEMA public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    await client.query('GRANT ALL ON SCHEMA public TO public;');
    console.log('Schema reset successfully.');
  } catch (err) {
    console.error('Error resetting DB:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

resetDb();
