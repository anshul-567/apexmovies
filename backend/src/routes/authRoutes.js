const router = require('express').Router();
const ctrl = require('../controllers/authController');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

router.post('/register', asyncHandler(ctrl.register));
router.post('/login', asyncHandler(ctrl.login));
router.post('/refresh', asyncHandler(ctrl.refresh));
router.post('/logout', asyncHandler(ctrl.logout));

module.exports = router;
