require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkShows() {
  const res = await pool.query(`
    SELECT m.title, m.id AS movie_id, t.name AS theater_name, t.city, s.start_time
    FROM shows s
    JOIN movies m ON s.movie_id = m.id
    JOIN screens sc ON s.screen_id = sc.id
    JOIN theaters t ON sc.theater_id = t.id
    ORDER BY s.start_time
    LIMIT 10
  `);
  console.log(res.rows);
  await pool.end();
}

checkShows().catch(console.error);
