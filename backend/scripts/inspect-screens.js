require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function inspectScreenSeats() {
  const screens = await pool.query('SELECT sc.id, sc.name, t.name as theater, t.city, count(s.id) as seat_count FROM screens sc JOIN theaters t ON t.id = sc.theater_id LEFT JOIN seats s ON s.screen_id = sc.id GROUP BY sc.id, sc.name, t.name, t.city LIMIT 10');
  console.table(screens.rows);
  await pool.end();
}

inspectScreenSeats().catch(console.error);
