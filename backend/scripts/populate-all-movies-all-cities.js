require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seedAllMoviesAllCitiesFast() {
  console.log('=== FAST SEEDING SHOWS FOR ALL MOVIES IN ALL 47 CITIES ===\n');

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Clear old data
    await client.query(`
      DELETE FROM booking_seats;
      DELETE FROM bookings;
      DELETE FROM show_seats;
      DELETE FROM shows;
    `);

    // 2. Fetch all theaters and movies
    const theaters = (await client.query('SELECT id, name, city FROM theaters ORDER BY city, name')).rows;
    const movies = (await client.query('SELECT id, title FROM movies ORDER BY title')).rows;

    console.log(`Theaters: ${theaters.length}, Movies: ${movies.length}`);

    // 3. For each theater, ensure 4 standard screens exist
    const SCREEN_NAMES = ['Audi 1 4K Laser', 'IMAX Audi 2', 'Audi 3 Dolby Atmos', 'Gold Class Audi 4'];

    for (const th of theaters) {
      const existingScreens = (await client.query('SELECT id, name FROM screens WHERE theater_id = $1', [th.id])).rows;
      const existingNames = new Set(existingScreens.map(s => s.name));

      for (const sName of SCREEN_NAMES) {
        if (!existingNames.has(sName)) {
          const insertScreen = await client.query(
            'INSERT INTO screens (theater_id, name, total_rows, total_columns) VALUES ($1, $2, 8, 10) RETURNING id',
            [th.id, sName]
          );
          const screenId = insertScreen.rows[0].id;

          const seatValues = [];
          const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
          for (let rIdx = 0; rIdx < rows.length; rIdx++) {
            const rowLabel = rows[rIdx];
            let seatType = 'regular';
            if (rIdx >= 5 && rIdx <= 6) seatType = 'premium';
            if (rIdx === 7) seatType = 'recliner';

            for (let num = 1; num <= 10; num++) {
              seatValues.push(`('${screenId}', '${rowLabel}', ${num}, '${seatType}')`);
            }
          }
          await client.query(`INSERT INTO seats (screen_id, row_label, seat_number, seat_type) VALUES ${seatValues.join(',')}`);
        }
      }
    }

    console.log('✓ Screens & seats verified.');

    // 4. Generate Shows across 3 days (Today, Tomorrow, Day 3)
    const dates = ['2026-08-27', '2026-08-28', '2026-08-29', '2026-08-30'];
    const TIME_SLOTS = [
      { start: '10:00:00', end: '12:45:00', basePrice: 220.00 },
      { start: '13:30:00', end: '16:15:00', basePrice: 280.00 },
      { start: '17:00:00', end: '19:45:00', basePrice: 320.00 },
      { start: '20:30:00', end: '23:15:00', basePrice: 350.00 },
    ];

    const allScreens = (await client.query('SELECT sc.id as screen_id, sc.theater_id, t.city FROM screens sc JOIN theaters t ON t.id = sc.theater_id')).rows;
    console.log(`Total Active Screens: ${allScreens.length}`);

    // Prepare batch shows insert
    const showRows = [];
    let movieIdx = 0;

    for (const d of dates) {
      for (const sc of allScreens) {
        for (const slot of TIME_SLOTS) {
          const movie = movies[movieIdx % movies.length];
          movieIdx++;

          const startTime = `${d} ${slot.start}+05:30`;
          const endTime = `${d} ${slot.end}+05:30`;

          showRows.push(`('${movie.id}', '${sc.screen_id}', '${startTime}', '${endTime}', ${slot.basePrice})`);
        }
      }
    }

    console.log(`Inserting ${showRows.length} shows...`);

    // Insert shows in chunks of 1,000
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < showRows.length; i += CHUNK_SIZE) {
      const chunk = showRows.slice(i, i + CHUNK_SIZE);
      await client.query(`
        INSERT INTO shows (movie_id, screen_id, start_time, end_time, base_price)
        VALUES ${chunk.join(',')}
      `);
    }

    console.log(`✓ Inserted ${showRows.length} shows!`);

    // 5. Bulk materialize all show_seats in 1 SQL query
    console.log('Materializing show_seats for all shows...');
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

    await client.query('COMMIT');
    console.log('✓ Successfully materialized show_seats for all shows!');

    // 6. Verify stats
    const stats = await pool.query(`
      SELECT 
        COUNT(DISTINCT t.city) AS total_cities,
        COUNT(DISTINCT sh.movie_id) AS total_movies_with_shows,
        COUNT(sh.id) AS total_shows,
        COUNT(ss.id) AS total_bookable_seats
      FROM shows sh
      JOIN screens sc ON sc.id = sh.screen_id
      JOIN theaters t ON t.id = sc.theater_id
      JOIN show_seats ss ON ss.show_id = sh.id;
    `);
    console.table(stats.rows);

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Fast seeding error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAllMoviesAllCitiesFast().catch(console.error);
