require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function listMovies() {
  const res = await pool.query('SELECT id, title, genre, poster_url FROM movies ORDER BY title');
  console.log(`Found ${res.rows.length} movies:`);
  res.rows.forEach((m, idx) => console.log(`${idx + 1}. [${m.genre}] "${m.title}" -> ${m.poster_url}`));
  await pool.end();
}

listMovies().catch(console.error);
