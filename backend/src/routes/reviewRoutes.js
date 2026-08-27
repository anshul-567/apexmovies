const express = require('express');
const router = express.Router({ mergeParams: true });
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  getMovieReviews,
  upsertMovieReview,
  deleteReview,
  toggleHelpfulVote,
} = require('../controllers/reviewController');

// Public route with optional auth to get reviews and stats
router.get('/:movieId/reviews', optionalAuth, getMovieReviews);

// Protected routes
router.post('/:movieId/reviews', requireAuth, upsertMovieReview);
router.delete('/reviews/:id', requireAuth, deleteReview);
router.post('/reviews/:id/helpful', requireAuth, toggleHelpfulVote);

module.exports = router;
