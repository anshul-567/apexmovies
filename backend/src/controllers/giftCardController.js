const { query } = require('../config/db');

// Helper to generate 16-digit card code APEX-XXXX-XXXX-XXXX
function generateCardCode() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `APEX-${seg()}-${seg()}-${seg()}`;
}

// Helper to generate 4-digit PIN
function generatePin() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

const purchaseGiftCard = async (req, res) => {
  const { recipientName, recipientEmail, amount, message, theme } = req.body;
  const numAmount = parseFloat(amount);

  if (!recipientName || !recipientEmail || !numAmount || numAmount < 100) {
    return res.status(400).json({ error: 'Recipient name, email, and minimum amount of ₹100 are required' });
  }

  const cardCode = generateCardCode();
  const pin = generatePin();
  const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 Year validity

  try {
    const result = await query(
      `INSERT INTO gift_cards (card_code, pin, initial_balance, current_balance, purchaser_user_id, recipient_email, recipient_name, message, theme, expires_at)
       VALUES ($1, $2, $3, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        cardCode,
        pin,
        numAmount,
        req.user ? req.user.id : null,
        recipientEmail.trim().toLowerCase(),
        recipientName.trim(),
        message || 'Enjoy the ultimate cinema experience with ApexMovies!',
        theme || 'cinema_gold',
        expiresAt,
      ]
    );

    res.status(201).json({
      message: 'Gift Card created successfully!',
      giftCard: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to purchase gift card' });
  }
};

const checkGiftCardBalance = async (req, res) => {
  const { cardCode, pin } = req.body;

  if (!cardCode || !pin) {
    return res.status(400).json({ error: 'Card code and PIN are required' });
  }

  try {
    const result = await query(
      `SELECT card_code, initial_balance, current_balance, recipient_name, message, theme, status, expires_at, created_at
       FROM gift_cards
       WHERE card_code = $1 AND pin = $2`,
      [cardCode.trim().toUpperCase(), pin.trim()]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Invalid Gift Card Code or PIN' });
    }

    const card = result.rows[0];
    if (new Date(card.expires_at) < new Date()) {
      return res.status(400).json({ error: 'This gift card has expired', card });
    }
    if (Number(card.current_balance) <= 0) {
      return res.status(400).json({ error: 'This gift card balance has been fully redeemed (₹0.00)', card });
    }

    res.json({ message: 'Gift Card verified', card });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to verify gift card' });
  }
};

const getMyGiftCards = async (req, res) => {
  try {
    const userEmail = req.user.email ? req.user.email.toLowerCase() : '';
    const result = await query(
      `SELECT * FROM gift_cards
       WHERE purchaser_user_id = $1 OR recipient_email = $2
       ORDER BY created_at DESC`,
      [req.user.id, userEmail]
    );
    res.json({ giftCards: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load gift cards' });
  }
};

module.exports = { purchaseGiftCard, checkGiftCardBalance, getMyGiftCards };
