require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function reset() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    console.log('✅ Schema reset completed');
  } catch (err) {
    console.error('❌ Error resetting schema', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

reset();
