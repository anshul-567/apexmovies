require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedGuaranteedShows() {
  const movies = (await pool.query("SELECT id, duration_mins FROM movies WHERE status = 'now_showing'")).rows;
  const screens = (await pool.query("SELECT screens.id FROM screens JOIN theaters ON screens.theater_id = theaters.id WHERE theaters.city IN ('Indore', 'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Pune')")).rows;

  console.log(`Adding shows for ${movies.length} movies across ${screens.length} key screens...`);

  let count = 0;
  for (const movie of movies) {
    for (const screen of screens) {
      for (const offset of [3, 7, 26, 30]) {
        const showRes = await pool.query(`
          INSERT INTO shows (movie_id, screen_id, start_time, end_time, base_price)
          VALUES ($1, $2, now() + ($3 * interval '1 hour'), now() + ($3 * interval '1 hour') + ($4 * interval '1 minute'), 280.00)
          RETURNING id, screen_id, base_price
        `, [movie.id, screen.id, offset, movie.duration_mins + 15]);

        const showId = showRes.rows[0].id;
        count++;

        // Add show_seats in batch
        await pool.query(`
          INSERT INTO show_seats (show_id, seat_id, status, price)
          SELECT $1, seats.id, 'available',
            ROUND(280.00 * CASE seats.seat_type WHEN 'recliner' THEN 2.0 WHEN 'premium' THEN 1.5 ELSE 1.0 END, 2)
          FROM seats
          WHERE seats.screen_id = $2
          ON CONFLICT (show_id, seat_id) DO NOTHING
        `, [showId, screen.id]);
      }
    }
  }
  console.log(`Successfully created ${count} shows with seats!`);
  await pool.end();
}

seedGuaranteedShows().catch(console.error);
