const router = require('express').Router();
const ctrl = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// List all favorites for current user
router.get('/', requireAuth, asyncHandler(ctrl.listFavorites));

module.exports = router;
