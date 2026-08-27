const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  getMyMembership,
  subscribeMembership,
  cancelMembership,
} = require('../controllers/membershipController');

router.use(requireAuth);

router.get('/me', getMyMembership);
router.post('/subscribe', subscribeMembership);
router.post('/cancel', cancelMembership);

module.exports = router;
