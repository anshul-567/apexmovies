const { query } = require('../config/db');

const listMovies = async (req, res) => {
  const {
    search,
    genre,
    language,
    city,
    date,
    status,
    minRating,
    maxPrice,
    sort = 'relevance',
    page = 1,
    limit = 12,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const params = [];

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    params.push(term);
    conditions.push(`(m.title ILIKE $${params.length} OR m.genre ILIKE $${params.length} OR m.language ILIKE $${params.length})`);
  }

  if (status && status.toLowerCase() !== 'all') {
    params.push(status);
    conditions.push(`m.status = $${params.length}`);
  }

  if (genre && genre.toLowerCase() !== 'all') {
    params.push(genre);
    conditions.push(`m.genre ILIKE $${params.length}`);
  }

  if (language && language.toLowerCase() !== 'all') {
    params.push(language);
    conditions.push(`m.language ILIKE $${params.length}`);
  }

  if (minRating && !isNaN(parseFloat(minRating))) {
    params.push(parseFloat(minRating));
    conditions.push(`m.rating >= $${params.length}`);
  }

  // city, date, and maxPrice filter against scheduled shows
  if (city && city.toLowerCase() !== 'all') {
    params.push(city);
    conditions.push(`th.city ILIKE $${params.length}`);
  }

  if (date) {
    params.push(date);
    conditions.push(`sh.start_time::date = $${params.length}::date`);
  }

  if (maxPrice && !isNaN(parseFloat(maxPrice))) {
    params.push(parseFloat(maxPrice));
    conditions.push(`sh.base_price <= $${params.length}`);
  }

  const joinClause = `
    LEFT JOIN shows sh ON sh.movie_id = m.id
    LEFT JOIN screens sc ON sc.id = sh.screen_id
    LEFT JOIN theaters th ON th.id = sc.theater_id
  `;

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  // Total count query for pagination
  const countSql = `SELECT COUNT(DISTINCT m.id)::int AS total FROM movies m ${joinClause} ${whereClause}`;
  const countResult = await query(countSql, params);
  const total = countResult.rows[0]?.total || 0;
  const totalPages = Math.ceil(total / limitNum) || (total === 0 ? 0 : 1);

  // Sorting
  let orderBy = 'm.release_date DESC NULLS LAST, m.created_at DESC';
  if (sort === 'rating_desc') {
    orderBy = 'm.rating DESC NULLS LAST, m.release_date DESC NULLS LAST';
  } else if (sort === 'release_desc') {
    orderBy = 'm.release_date DESC NULLS LAST, m.created_at DESC';
  } else if (sort === 'title_asc') {
    orderBy = 'm.title ASC';
  } else if (sort === 'price_asc') {
    orderBy = 'MIN(sh.base_price) ASC NULLS LAST, m.title ASC';
  } else if (sort === 'relevance' && search && search.trim()) {
    const exactTerm = search.trim();
    params.push(exactTerm);
    const exactParam = `$${params.length}`;
    params.push(`${exactTerm}%`);
    const prefixParam = `$${params.length}`;
    orderBy = `CASE WHEN m.title ILIKE ${exactParam} THEN 1 WHEN m.title ILIKE ${prefixParam} THEN 2 ELSE 3 END, m.rating DESC NULLS LAST, m.release_date DESC NULLS LAST`;
  }

  params.push(limitNum);
  const limitParam = `$${params.length}`;
  params.push(offset);
  const offsetParam = `$${params.length}`;

  const dataSql = `
    SELECT m.*, MIN(sh.base_price) AS min_price
    FROM movies m
    ${joinClause}
    ${whereClause}
    GROUP BY m.id
    ORDER BY ${orderBy}
    LIMIT ${limitParam} OFFSET ${offsetParam}
  `;

  const result = await query(dataSql, params);

  res.json({
    movies: result.rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages,
    },
  });
};

const getMovie = async (req, res) => {
  const result = await query('SELECT * FROM movies WHERE id = $1', [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Movie not found' });
  res.json(result.rows[0]);
};

const createMovie = async (req, res) => {
  const { title, description, posterUrl, durationMins, genre, language, releaseDate, status } = req.body;
  if (!title || !durationMins) {
    return res.status(400).json({ error: 'Title and duration are required' });
  }
  const result = await query(
    `INSERT INTO movies (title, description, poster_url, duration_mins, genre, language, release_date, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8,'upcoming')) RETURNING *`,
    [title, description, posterUrl, durationMins, genre, language, releaseDate, status]
  );
  res.status(201).json(result.rows[0]);
};

const updateMovie = async (req, res) => {
  const { title, description, posterUrl, durationMins, genre, language, releaseDate, status } = req.body;
  const result = await query(
    `UPDATE movies SET
       title = COALESCE($1, title),
       description = COALESCE($2, description),
       poster_url = COALESCE($3, poster_url),
       duration_mins = COALESCE($4, duration_mins),
       genre = COALESCE($5, genre),
       language = COALESCE($6, language),
       release_date = COALESCE($7, release_date),
       status = COALESCE($8, status),
       updated_at = now()
     WHERE id = $9 RETURNING *`,
    [title, description, posterUrl, durationMins, genre, language, releaseDate, status, req.params.id]
  );
  if (!result.rows.length) return res.status(404).json({ error: 'Movie not found' });
  res.json(result.rows[0]);
};

const deleteMovie = async (req, res) => {
  const result = await query('DELETE FROM movies WHERE id = $1 RETURNING id', [req.params.id]);
  if (!result.rows.length) return res.status(404).json({ error: 'Movie not found' });
  res.json({ message: 'Movie deleted' });
};

module.exports = { listMovies, getMovie, createMovie, updateMovie, deleteMovie };
