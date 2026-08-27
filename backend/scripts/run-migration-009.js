require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sqlPath = path.join(__dirname, '../src/migrations/009_giftcards_wallet_cancellations.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Running migration 009_giftcards_wallet_cancellations.sql...');
  await pool.query(sql);
  console.log('✓ Migration 009 applied successfully.');
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
