const router = require('express').Router();
const ctrl = require('../controllers/theaterController');
const { requireAuth, requireRole } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.get('/', asyncHandler(ctrl.listTheaters));
router.post('/', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.createTheater));
router.put('/:id', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.updateTheater));
router.delete('/:id', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.deleteTheater));

router.get('/:theaterId/screens', asyncHandler(ctrl.listScreens));
router.get('/:theaterId/shows', asyncHandler(ctrl.listTheaterShows));
router.post('/:theaterId/screens', requireAuth, requireRole('theater_admin'), asyncHandler(ctrl.createScreen));
router.get('/screens/:screenId/seats', asyncHandler(ctrl.getScreenSeats));

module.exports = router;
