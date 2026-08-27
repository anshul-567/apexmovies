require('dotenv').config();
const { Pool } = require('pg');

async function fastShowSeeder() {
  console.log('=== FAST SHOW SEEDER FOR CLOUD DATABASE ===\n');

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1')
      ? { rejectUnauthorized: false }
      : false,
  });

  const client = await pool.connect();

  try {
    const movies = (await client.query('SELECT id, title FROM movies')).rows;
    const screens = (await client.query('SELECT id, theater_id FROM screens')).rows;

    console.log(`Found ${movies.length} movies and ${screens.length} screens.`);

    // Clear old shows and booking dependencies
    console.log('Cleaning old shows...');
    await client.query(`
      DELETE FROM booking_seats;
      DELETE FROM bookings;
      DELETE FROM show_seats;
      DELETE FROM shows;
    `);

    const dates = ['2026-08-27', '2026-08-28', '2026-08-29'];
    const SLOTS = [
      { start: '10:30:00', end: '13:00:00', price: 250 },
      { start: '14:00:00', end: '16:30:00', price: 300 },
      { start: '18:00:00', end: '20:30:00', price: 380 },
      { start: '21:30:00', end: '23:59:00', price: 420 },
    ];

    const showValues = [];
    let mIdx = 0;

    for (const d of dates) {
      for (const sc of screens) {
        for (const slot of SLOTS) {
          const m = movies[mIdx % movies.length];
          mIdx++;
          const startTime = `${d} ${slot.start}+05:30`;
          const endTime = `${d} ${slot.end}+05:30`;
          showValues.push(`('${m.id}', '${sc.id}', '${startTime}', '${endTime}', ${slot.price})`);
        }
      }
    }

    console.log(`Inserting ${showValues.length} shows across 3 days...`);
    const CHUNK_SIZE = 2000;
    for (let i = 0; i < showValues.length; i += CHUNK_SIZE) {
      const chunk = showValues.slice(i, i + CHUNK_SIZE);
      await client.query(`
        INSERT INTO shows (movie_id, screen_id, start_time, end_time, base_price)
        VALUES ${chunk.join(',')}
      `);
      process.stdout.write(`Inserted ${Math.min(i + CHUNK_SIZE, showValues.length)} / ${showValues.length} shows...\r`);
    }

    console.log('\nMaterializing bookable seats in database...');
    await client.query(`
      INSERT INTO show_seats (show_id, seat_id, status, price)
      SELECT 
        sh.id AS show_id,
        s.id AS seat_id,
        'available' AS status,
        ROUND(
          sh.base_price * CASE 
            WHEN s.seat_type = 'recliner' THEN 2.0 
            WHEN s.seat_type = 'premium' THEN 1.5 
            ELSE 1.0 
          END, 2
        ) AS price
      FROM shows sh
      JOIN screens sc ON sc.id = sh.screen_id
      JOIN seats s ON s.screen_id = sc.id;
    `);

    const summary = (await client.query(`
      SELECT 
        COUNT(DISTINCT sh.movie_id) as active_movies,
        COUNT(DISTINCT sc.theater_id) as active_theaters,
        COUNT(sh.id) as total_shows,
        COUNT(ss.id) as total_seats
      FROM shows sh
      JOIN screens sc ON sc.id = sh.screen_id
      JOIN show_seats ss ON ss.show_id = sh.id
    `)).rows[0];

    console.log('\n=== CLOUD DATABASE FULLY SEEDED! ===');
    console.table(summary);

  } catch (err) {
    console.error('Show seeding failed:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

fastShowSeeder();
