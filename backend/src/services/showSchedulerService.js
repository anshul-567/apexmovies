const { query, withTransaction } = require('../config/db');

/**
 * Ensures that shows are always scheduled for Today, Tomorrow, and upcoming 3 days.
 * Automatically handles date rolling, clears past shows older than 2 hours,
 * and provisions valid showtimes & seat matrices so users always see live dates.
 */
async function ensureRollingShowSchedule() {
  try {
    const todayResult = await query(`SELECT CURRENT_DATE as today`);
    const today = new Date(todayResult.rows[0].today);
    const todayStr = today.toISOString().split('T')[0];

    // Delete shows older than 2 hours ago (and their orphan show_seats)
    await query(`
      DELETE FROM booking_seats 
      WHERE booking_id IN (
        SELECT b.id FROM bookings b 
        JOIN shows sh ON sh.id = b.show_id 
        WHERE sh.start_time < (now() - interval '2 hours')
      )
    `);
    await query(`DELETE FROM bookings WHERE show_id IN (SELECT id FROM shows WHERE start_time < (now() - interval '2 hours'))`);
    await query(`DELETE FROM show_seats WHERE show_id IN (SELECT id FROM shows WHERE start_time < (now() - interval '2 hours'))`);
    await query(`DELETE FROM shows WHERE start_time < (now() - interval '2 hours')`);

    // Target 4 rolling days starting from TODAY
    const targetDates = [];
    for (let i = 0; i <= 3; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      targetDates.push(d.toISOString().split('T')[0]);
    }

    // Check which target dates already have sufficient shows
    const existingDatesResult = await query(
      `SELECT start_time::date as date, COUNT(*) as count 
       FROM shows 
       WHERE start_time::date = ANY($1::date[]) 
       GROUP BY start_time::date`,
      [targetDates]
    );

    const countsMap = new Map();
    existingDatesResult.rows.forEach(r => {
      const dStr = new Date(r.date).toISOString().split('T')[0];
      countsMap.set(dStr, parseInt(r.count, 10));
    });

    const datesToSchedule = targetDates.filter(d => (countsMap.get(d) || 0) < 500);

    if (!datesToSchedule.length) {
      return;
    }

    console.log(`[AutoScheduler] Generating shows for dates: ${datesToSchedule.join(', ')}...`);

    await withTransaction(async (client) => {
      const movies = (await client.query('SELECT id FROM movies')).rows;
      const screens = (await client.query('SELECT id FROM screens')).rows;

      if (!movies.length || !screens.length) return;

      // Safely delete bookings and seats for partial future dates if refreshing
      await client.query(`
        DELETE FROM booking_seats 
        WHERE booking_id IN (
          SELECT b.id FROM bookings b 
          JOIN shows sh ON sh.id = b.show_id 
          WHERE sh.start_time::date = ANY($1::date[])
        )
      `, [datesToSchedule]);

      await client.query(`
        DELETE FROM bookings 
        WHERE show_id IN (SELECT id FROM shows WHERE start_time::date = ANY($1::date[]))
      `, [datesToSchedule]);

      await client.query(`
        DELETE FROM show_seats WHERE show_id IN (
          SELECT id FROM shows WHERE start_time::date = ANY($1::date[])
        )
      `, [datesToSchedule]);

      await client.query(`
        DELETE FROM shows WHERE start_time::date = ANY($1::date[])
      `, [datesToSchedule]);

      const SLOTS = [
        { start: '10:30:00', end: '13:00:00', price: 250 },
        { start: '14:00:00', end: '16:30:00', price: 300 },
        { start: '18:00:00', end: '20:30:00', price: 380 },
        { start: '21:30:00', end: '23:59:00', price: 420 },
      ];

      const showValues = [];
      let mIdx = 0;

      for (const d of datesToSchedule) {
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

      const CHUNK_SIZE = 2000;
      for (let i = 0; i < showValues.length; i += CHUNK_SIZE) {
        const chunk = showValues.slice(i, i + CHUNK_SIZE);
        await client.query(`
          INSERT INTO shows (movie_id, screen_id, start_time, end_time, base_price)
          VALUES ${chunk.join(',')}
        `);
      }

      // Materialize available seats
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
        JOIN seats s ON s.screen_id = sc.id
        WHERE sh.start_time::date = ANY($1::date[]);
      `, [datesToSchedule]);

      console.log(`[AutoScheduler] ✓ Successfully scheduled rolling showtimes for: ${datesToSchedule.join(', ')}`);
    });

  } catch (err) {
    console.error('[AutoScheduler] Error ensuring rolling show schedule:', err);
  }
}

module.exports = { ensureRollingShowSchedule };
