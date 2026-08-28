const { query, withTransaction } = require('../config/db');

const createShow = async (req, res) => {
  const { movieId, screenId, startTime, basePrice } = req.body;
  if (!movieId || !screenId || !startTime || basePrice == null) {
    return res.status(400).json({ error: 'movieId, screenId, startTime and basePrice are required' });
  }

  try {
    const show = await withTransaction(async (client) => {
      const movieResult = await client.query('SELECT duration_mins FROM movies WHERE id = $1', [movieId]);
      if (!movieResult.rows.length) {
        const err = new Error('Movie not found');
        err.statusCode = 404;
        throw err;
      }
      const durationMins = movieResult.rows[0].duration_mins;
      // 15 min buffer for cleaning/turnover between shows on the same screen
      const endTime = new Date(new Date(startTime).getTime() + (durationMins + 15) * 60000);

      const showResult = await client.query(
        `INSERT INTO shows (movie_id, screen_id, start_time, end_time, base_price)
         VALUES ($1,$2,$3,$4,$5) RETURNING *`,
        [movieId, screenId, startTime, endTime, basePrice]
      );
      const newShow = showResult.rows[0];

      // Materialize show_seats from the screen's physical seat layout,
      // applying a price multiplier per seat_type.
      const seatsResult = await client.query('SELECT id, seat_type FROM seats WHERE screen_id = $1', [screenId]);
      if (!seatsResult.rows.length) {
        const err = new Error('Screen has no seats configured');
        err.statusCode = 400;
        throw err;
      }

      const multiplier = { regular: 1, premium: 1.5, recliner: 2 };
      const values = seatsResult.rows
        .map((seat) => {
          const price = (basePrice * (multiplier[seat.seat_type] || 1)).toFixed(2);
          return `('${newShow.id}', '${seat.id}', 'available', ${price})`;
        })
        .join(',');
      await client.query(
        `INSERT INTO show_seats (show_id, seat_id, status, price) VALUES ${values}`
      );

      return newShow;
    });

    res.status(201).json(show);
  } catch (err) {
    // Postgres exclusion constraint violation = overlapping show on same screen
    if (err.code === '23P01') {
      return res.status(409).json({ error: 'This screen already has a show scheduled in that time window' });
    }
    res.status(err.statusCode || 500).json({ error: err.message || 'Failed to create show' });
  }
};

const listShowsForMovie = async (req, res) => {
  const { movieId } = req.params;
  const { city, date } = req.query;
  const params = [movieId];
  const conditions = [
    'sh.movie_id = $1',
    "sh.start_time >= (now() - interval '30 minutes')"
  ];

  if (city && city.toLowerCase() !== 'all') {
    params.push(city);
    conditions.push(`th.city ILIKE $${params.length}`);
  }
  if (date) {
    params.push(date);
    conditions.push(`sh.start_time::date = $${params.length}::date`);
  }

  const result = await query(
    `SELECT sh.*, sc.name AS screen_name, th.name AS theater_name, th.city, th.address AS theater_address
     FROM shows sh
     JOIN screens sc ON sc.id = sh.screen_id
     JOIN theaters th ON th.id = sc.theater_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY sh.start_time`,
    params
  );
  res.json(result.rows);
};

const getShowSeatMap = async (req, res) => {
  const { showId } = req.params;
  // Lazily release any expired locks before returning the current map, so
  // clients never see stale "locked" seats that actually timed out.
  await query(
    `UPDATE show_seats SET status = 'available', locked_by = NULL, locked_until = NULL
     WHERE show_id = $1 AND status = 'locked' AND locked_until < now()`,
    [showId]
  );

  const result = await query(
    `SELECT ss.id AS show_seat_id, ss.status, ss.price, s.row_label, s.seat_number, s.seat_type
     FROM show_seats ss
     JOIN seats s ON s.id = ss.seat_id
     WHERE ss.show_id = $1
     ORDER BY s.row_label, s.seat_number`,
    [showId]
  );
  res.json(result.rows);
};

module.exports = { createShow, listShowsForMovie, getShowSeatMap };
