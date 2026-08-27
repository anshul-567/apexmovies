const express = require('express');
const router = express.Router();
const { requireAuth, optionalAuth } = require('../middleware/auth');
const {
  purchaseGiftCard,
  checkGiftCardBalance,
  getMyGiftCards,
} = require('../controllers/giftCardController');

// Public routes (with optional auth)
router.post('/purchase', optionalAuth, purchaseGiftCard);
router.post('/check-balance', checkGiftCardBalance);

// Protected routes
router.get('/my-cards', requireAuth, getMyGiftCards);

module.exports = router;
