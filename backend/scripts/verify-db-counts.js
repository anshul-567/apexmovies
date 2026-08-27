require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function verify() {
  const m = await pool.query('SELECT genre, count(*) FROM movies GROUP BY genre ORDER BY genre');
  console.log('--- MOVIES PER CATEGORY ---');
  console.table(m.rows);

  const t = await pool.query('SELECT count(DISTINCT city) AS cities, count(*) AS theaters FROM theaters');
  console.log('\n--- CITIES & THEATERS ---');
  console.log(t.rows[0]);

  const s = await pool.query('SELECT count(*) AS total_shows FROM shows');
  console.log('\n--- SHOWS COUNT ---');
  console.log(s.rows[0]);

  const gm = await pool.query("SELECT id, title, genre, rating, poster_url FROM movies WHERE title ILIKE '%Glass Meridian%'");
  console.log('\n--- GLASS MERIDIAN DETAILS ---');
  console.log(gm.rows[0]);

  await pool.end();
}

verify().catch(console.error);
