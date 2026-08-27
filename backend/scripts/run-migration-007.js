require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  const client = await pool.connect();
  try {
    const sqlPath = path.join(__dirname, '../src/migrations/007_reviews_and_memberships.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log('✓ Migration 007 applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
