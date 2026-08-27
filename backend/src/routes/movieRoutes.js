const router = require('express').Router();
const ctrl = require('../controllers/movieController');
const favCtrl = require('../controllers/favoriteController');
const { requireAuth, requireRole } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(ctrl.listMovies));
router.get('/:id', asyncHandler(ctrl.getMovie));
router.post('/', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.createMovie));
router.put('/:id', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.updateMovie));
router.delete('/:id', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.deleteMovie));

// Favorite / Wishlist routes per movie
router.post('/:movieId/favorite', requireAuth, asyncHandler(favCtrl.addFavorite));
router.delete('/:movieId/favorite', requireAuth, asyncHandler(favCtrl.removeFavorite));
router.get('/:movieId/favorite', requireAuth, asyncHandler(favCtrl.checkFavorite));

module.exports = router;

