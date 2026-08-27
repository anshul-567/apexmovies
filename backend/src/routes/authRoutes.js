const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', asyncHandler(ctrl.register));
router.post('/login', asyncHandler(ctrl.login));
router.post('/refresh', asyncHandler(ctrl.refresh));
router.post('/logout', asyncHandler(ctrl.logout));
router.get('/me', requireAuth, asyncHandler(ctrl.getMe));

module.exports = router;
