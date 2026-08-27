const router = require('express').Router();
const ctrl = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/hold', requireAuth, asyncHandler(ctrl.holdSeats));
router.post('/release', requireAuth, asyncHandler(ctrl.releaseHold));
router.post('/validate-promo', requireAuth, asyncHandler(ctrl.validatePromo));
router.post('/checkout', requireAuth, asyncHandler(ctrl.checkout));
router.post('/:id/cancel', requireAuth, asyncHandler(ctrl.cancelBooking));
router.get('/mine', requireAuth, asyncHandler(ctrl.myBookings));
router.get('/:bookingId', requireAuth, asyncHandler(ctrl.getBookingById));

module.exports = router;
