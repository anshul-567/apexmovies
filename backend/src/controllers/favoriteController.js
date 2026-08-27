const { query } = require('../config/db');

const addFavorite = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  // Check if movie exists
  const movieCheck = await query('SELECT id FROM movies WHERE id = $1', [movieId]);
  if (!movieCheck.rows.length) {
    return res.status(404).json({ error: 'Movie not found' });
  }

  await query(
    `INSERT INTO movie_favorites (user_id, movie_id)
     VALUES ($1, $2)
     ON CONFLICT (user_id, movie_id) DO NOTHING`,
    [userId, movieId]
  );

  res.status(200).json({ message: 'Movie added to favorites', isFavorite: true });
};

const removeFavorite = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  await query(
    'DELETE FROM movie_favorites WHERE user_id = $1 AND movie_id = $2',
    [userId, movieId]
  );

  res.status(200).json({ message: 'Movie removed from favorites', isFavorite: false });
};

const checkFavorite = async (req, res) => {
  const { movieId } = req.params;
  const userId = req.user.id;

  const result = await query(
    'SELECT 1 FROM movie_favorites WHERE user_id = $1 AND movie_id = $2',
    [userId, movieId]
  );

  res.json({ isFavorite: result.rows.length > 0 });
};

const listFavorites = async (req, res) => {
  const userId = req.user.id;

  const result = await query(
    `SELECT m.*, mf.created_at AS favorited_at
     FROM movie_favorites mf
     JOIN movies m ON m.id = mf.movie_id
     WHERE mf.user_id = $1
     ORDER BY mf.created_at DESC`,
    [userId]
  );

  res.json(result.rows);
};

module.exports = {
  addFavorite,
  removeFavorite,
  checkFavorite,
  listFavorites,
};
