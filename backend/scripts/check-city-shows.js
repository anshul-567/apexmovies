require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function checkCityShows() {
  const cities = await pool.query('SELECT city, count(DISTINCT t.id) as theaters, count(DISTINCT sh.id) as shows FROM theaters t LEFT JOIN screens sc ON sc.theater_id = t.id LEFT JOIN shows sh ON sh.screen_id = sc.id GROUP BY city ORDER BY city');
  console.table(cities.rows);
  await pool.end();
}

checkCityShows().catch(console.error);
