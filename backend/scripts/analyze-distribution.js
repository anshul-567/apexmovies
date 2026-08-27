require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function analyzeShowsDistribution() {
  const movies = await pool.query('SELECT id, title, status FROM movies ORDER BY title');
  const theaters = await pool.query('SELECT t.id, t.name, t.city, sc.id as screen_id FROM theaters t JOIN screens sc ON sc.theater_id = t.id');
  const shows = await pool.query('SELECT count(*) as count FROM shows');

  console.log(`Total Movies: ${movies.rows.length}`);
  console.log(`Total Theaters with Screens: ${theaters.rows.length}`);
  console.log(`Total Existing Shows: ${shows.rows[0].count}`);

  const cities = Array.from(new Set(theaters.rows.map(t => t.city)));
  console.log(`Total Cities: ${cities.length}`);

  await pool.end();
}

analyzeShowsDistribution().catch(console.error);
