require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const sqlPath = path.join(__dirname, '../src/migrations/008_movie_age_ratings.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Running migration 008_movie_age_ratings.sql...');
  await pool.query(sql);
  console.log('✓ Migration 008 applied successfully.');

  const sample = await pool.query('SELECT title, genre, age_rating FROM movies LIMIT 10');
  console.table(sample.rows);
  await pool.end();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
