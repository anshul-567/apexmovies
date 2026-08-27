const router = require('express').Router();
const ctrl = require('../controllers/showController');
const { requireAuth, requireRole } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.createShow));
router.get('/movie/:movieId', asyncHandler(ctrl.listShowsForMovie));
router.get('/:showId/seats', asyncHandler(ctrl.getShowSeatMap));

module.exports = router;
