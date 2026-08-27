const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { getMyWallet } = require('../controllers/walletController');

router.get('/me', requireAuth, getMyWallet);

module.exports = router;
