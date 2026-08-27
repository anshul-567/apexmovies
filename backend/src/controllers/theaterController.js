const { query, withTransaction } = require('../config/db');

const listTheaters = async (req, res) => {
  const { city } = req.query;
  const sql = city
    ? 'SELECT * FROM theaters WHERE city = $1 ORDER BY name'
    : 'SELECT * FROM theaters ORDER BY name';
  const result = await query(sql, city ? [city] : []);
  res.json(result.rows);
};

const createTheater = async (req, res) => {
  const { name, city, address } = req.body;
  if (!name || !city) return res.status(400).json({ error: 'Name and city are required' });
  const result = await query(
    `INSERT INTO theaters (admin_id, name, city, address) VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.user.id, name, city, address]
  );
  res.status(201).json(result.rows[0]);
};

const updateTheater = async (req, res) => {
  const { name, city, address } = req.body;
  const result = await query(
    `UPDATE theaters SET name = COALESCE($1,name), city = COALESCE($2,city), address = COALESCE($3,address)
     WHERE id = $4 AND admin_id = $5 RETURNING *`,
    [name, city, address, req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Theater not found' });
  res.json(result.rows[0]);
};

const deleteTheater = async (req, res) => {
  const result = await query(
    'DELETE FROM theaters WHERE id = $1 AND admin_id = $2 RETURNING id',
    [req.params.id, req.user.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Theater not found' });
  res.json({ message: 'Theater deleted' });
};

// Screens ---------------------------------------------------------------

const createScreen = async (req, res) => {
  const { theaterId } = req.params;
  const { name, totalRows, totalColumns, seatType, tierConfig } = req.body;
  if (!name || !totalRows || !totalColumns) {
    return res.status(400).json({ error: 'Name, totalRows and totalColumns are required' });
  }

  // Creating a screen also generates its seat grid atomically, so a screen
  // is never left without a matching seat layout.
  const screen = await withTransaction(async (client) => {
    const theaterCheck = await client.query(
      'SELECT id FROM theaters WHERE id = $1',
      [theaterId]
    );
    if (!theaterCheck.rows.length) {
      const err = new Error('Theater not found');
      err.statusCode = 404;
      throw err;
    }

    const screenResult = await client.query(
      `INSERT INTO screens (theater_id, name, total_rows, total_columns) VALUES ($1,$2,$3,$4) RETURNING *`,
      [theaterId, name, totalRows, totalColumns]
    );
    const newScreen = screenResult.rows[0];

    const numRows = Math.min(26, Math.max(1, parseInt(totalRows, 10)));
    const numCols = Math.min(30, Math.max(1, parseInt(totalColumns, 10)));
    const rowLetters = Array.from({ length: numRows }, (_, i) => String.fromCharCode(65 + i));
    const seatRows = [];

    for (let rIdx = 0; rIdx < rowLetters.length; rIdx++) {
      const row = rowLetters[rIdx];
      let rowTier = seatType || 'regular';

      // Default realistic cinema tier distribution if not specified
      if (!seatType) {
        if (rIdx >= numRows - 2 && numRows >= 6) {
          rowTier = 'recliner'; // Last 2 rows are VIP Recliners
        } else if (rIdx >= numRows - 4 && numRows >= 6) {
          rowTier = 'premium'; // Middle 2 rows are Prime Executive
        } else {
          rowTier = 'regular'; // Front rows Classic Standard
        }
      }

      for (let seatNumber = 1; seatNumber <= numCols; seatNumber++) {
        seatRows.push(`('${newScreen.id}', '${row}', ${seatNumber}, '${rowTier}')`);
      }
    }

    await client.query(
      `INSERT INTO seats (screen_id, row_label, seat_number, seat_type) VALUES ${seatRows.join(',')}`
    );

    return newScreen;
  });

  res.status(201).json(screen);
};

const listScreens = async (req, res) => {
  const result = await query('SELECT * FROM screens WHERE theater_id = $1', [req.params.theaterId]);
  res.json(result.rows);
};

const listTheaterShows = async (req, res) => {
  const { theaterId } = req.params;
  const sql = `
    SELECT 
      sh.id,
      sh.movie_id,
      sh.screen_id,
      sh.start_time,
      sh.end_time,
      sh.base_price,
      m.title AS movie_title,
      m.poster_url,
      m.genre,
      m.language,
      m.duration_mins,
      sc.name AS screen_name
    FROM shows sh
    JOIN movies m ON m.id = sh.movie_id
    JOIN screens sc ON sc.id = sh.screen_id
    WHERE sc.theater_id = $1
      AND sh.start_time >= now() - interval '30 minutes'
    ORDER BY sh.start_time ASC
    LIMIT 50
  `;
  const result = await query(sql, [theaterId]);
  res.json(result.rows);
};

const getScreenSeats = async (req, res) => {
  const result = await query(
    'SELECT * FROM seats WHERE screen_id = $1 ORDER BY row_label, seat_number',
    [req.params.screenId]
  );
  res.json(result.rows);
};

module.exports = {
  listTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  createScreen,
  listScreens,
  listTheaterShows,
  getScreenSeats,
};
