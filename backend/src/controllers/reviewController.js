const { query } = require('../config/db');

/**
 * Get all reviews for a movie with statistics (community score, rating distribution)
 */
const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const currentUserId = req.user?.id || null;

  try {
    // 1. Fetch reviews with user info & whether current user voted helpful
    const reviewsRes = await query(
      `SELECT 
        r.id,
        r.movie_id,
        r.user_id,
        u.name AS user_name,
        r.rating,
        r.review_title,
        r.review_text,
        r.is_spoiler,
        r.is_verified_buyer,
        r.helpful_count,
        r.created_at,
        r.updated_at,
        CASE 
          WHEN $2::uuid IS NOT NULL AND v.id IS NOT NULL THEN TRUE 
          ELSE FALSE 
        END AS user_voted_helpful
       FROM movie_reviews r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN review_helpful_votes v ON v.review_id = r.id AND v.user_id = $2::uuid
       WHERE r.movie_id = $1
       ORDER BY r.helpful_count DESC, r.created_at DESC`,
      [movieId, currentUserId]
    );

    // 2. Fetch rating stats
    const statsRes = await query(
      `SELECT 
        COUNT(*)::int AS total_reviews,
        ROUND(AVG(rating), 1)::float AS average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END)::int AS star_5,
        COUNT(CASE WHEN rating = 4 THEN 1 END)::int AS star_4,
        COUNT(CASE WHEN rating = 3 THEN 1 END)::int AS star_3,
        COUNT(CASE WHEN rating = 2 THEN 1 END)::int AS star_2,
        COUNT(CASE WHEN rating = 1 THEN 1 END)::int AS star_1,
        COUNT(CASE WHEN is_verified_buyer = true THEN 1 END)::int AS verified_buyer_reviews
       FROM movie_reviews
       WHERE movie_id = $1`,
      [movieId]
    );

    const stats = statsRes.rows[0] || {
      total_reviews: 0,
      average_rating: 0,
      star_5: 0, star_4: 0, star_3: 0, star_2: 0, star_1: 0,
      verified_buyer_reviews: 0,
    };

    // 3. Check if current user is a verified buyer of this movie
    let isVerifiedBuyer = false;
    let userReview = null;

    if (currentUserId) {
      const buyerCheck = await query(
        `SELECT b.id FROM bookings b 
         JOIN shows s ON s.id = b.show_id 
         WHERE b.user_id = $1 AND s.movie_id = $2 AND b.status = 'confirmed' 
         LIMIT 1`,
        [currentUserId, movieId]
      );
      isVerifiedBuyer = buyerCheck.rows.length > 0;

      userReview = reviewsRes.rows.find((r) => r.user_id === currentUserId) || null;
    }

    res.json({
      reviews: reviewsRes.rows,
      stats,
      isVerifiedBuyer,
      userReview,
    });
  } catch (err) {
    console.error('getMovieReviews error:', err);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
};

/**
 * Create or update a review
 */
const upsertMovieReview = async (req, res) => {
  const { movieId } = req.params;
  const { rating, reviewTitle, reviewText, isSpoiler } = req.body;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }
  if (!reviewText || !reviewText.trim()) {
    return res.status(400).json({ error: 'Review text cannot be empty' });
  }

  try {
    // Check if user has confirmed booking for this movie
    const buyerCheck = await query(
      `SELECT b.id FROM bookings b 
       JOIN shows s ON s.id = b.show_id 
       WHERE b.user_id = $1 AND s.movie_id = $2 AND b.status = 'confirmed' 
       LIMIT 1`,
      [userId, movieId]
    );
    const isVerifiedBuyer = buyerCheck.rows.length > 0;

    const result = await query(
      `INSERT INTO movie_reviews (movie_id, user_id, rating, review_title, review_text, is_spoiler, is_verified_buyer, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       ON CONFLICT (movie_id, user_id)
       DO UPDATE SET 
         rating = EXCLUDED.rating,
         review_title = EXCLUDED.review_title,
         review_text = EXCLUDED.review_text,
         is_spoiler = EXCLUDED.is_spoiler,
         is_verified_buyer = EXCLUDED.is_verified_buyer,
         updated_at = NOW()
       RETURNING *`,
      [movieId, userId, parseInt(rating, 10), reviewTitle || '', reviewText.trim(), Boolean(isSpoiler), isVerifiedBuyer]
    );

    res.json({
      message: 'Review saved successfully',
      review: result.rows[0],
    });
  } catch (err) {
    console.error('upsertMovieReview error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

/**
 * Delete a user's review
 */
const deleteReview = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deleted = await query(
      `DELETE FROM movie_reviews WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );

    if (!deleted.rows.length) {
      return res.status(404).json({ error: 'Review not found or unauthorized' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    console.error('deleteReview error:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
};

/**
 * Toggle Helpful vote on a review
 */
const toggleHelpfulVote = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    // Check if vote already exists
    const existing = await query(
      `SELECT id FROM review_helpful_votes WHERE review_id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (existing.rows.length) {
      // Remove vote
      await query(`DELETE FROM review_helpful_votes WHERE id = $1`, [existing.rows[0].id]);
      await query(`UPDATE movie_reviews SET helpful_count = GREATEST(0, helpful_count - 1) WHERE id = $1`, [id]);
      return res.json({ voted: false, message: 'Removed helpful vote' });
    } else {
      // Add vote
      await query(`INSERT INTO review_helpful_votes (review_id, user_id) VALUES ($1, $2)`, [id, userId]);
      await query(`UPDATE movie_reviews SET helpful_count = helpful_count + 1 WHERE id = $1`, [id]);
      return res.json({ voted: true, message: 'Marked as helpful' });
    }
  } catch (err) {
    console.error('toggleHelpfulVote error:', err);
    res.status(500).json({ error: 'Failed to vote' });
  }
};

module.exports = {
  getMovieReviews,
  upsertMovieReview,
  deleteReview,
  toggleHelpfulVote,
};
