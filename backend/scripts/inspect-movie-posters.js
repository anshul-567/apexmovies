require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function listAllMovies() {
  const res = await pool.query('SELECT id, title, genre, poster_url FROM movies ORDER BY genre, title');
  console.log(`Found ${res.rows.length} movies:`);
  console.table(res.rows);
  await pool.end();
}

listAllMovies().catch(console.error);
