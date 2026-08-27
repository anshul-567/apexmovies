const { query } = require('../config/db');

/**
 * Gets or creates user wallet, returning current balance & transaction history
 */
const getMyWallet = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. Get or create wallet
    let walletRes = await query(`SELECT * FROM user_wallets WHERE user_id = $1`, [userId]);
    if (!walletRes.rows.length) {
      walletRes = await query(
        `INSERT INTO user_wallets (user_id, coin_balance) VALUES ($1, 100.00) RETURNING *`,
        [userId]
      );
      // Add welcome bonus transaction
      await query(
        `INSERT INTO wallet_transactions (user_id, amount, type, description)
         VALUES ($1, 100.00, 'welcome_bonus', 'Welcome to ApexMovies! 100 ApexCoins Gifted')`,
        [userId]
      );
    }

    // 2. Fetch membership tier for multiplier rate
    const memRes = await query(
      `SELECT tier FROM user_memberships WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    const tier = memRes.rows[0]?.tier || 'free';
    const earnRatePercent = tier === 'gold' ? 15 : tier === 'standard' ? 10 : 5;

    // 3. Fetch transaction history
    const txRes = await query(
      `SELECT * FROM wallet_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );

    res.json({
      coinBalance: Number(walletRes.rows[0].coin_balance),
      tier,
      earnRatePercent,
      transactions: txRes.rows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to load wallet' });
  }
};

/**
 * Helper: Award ApexCoins on booking confirmation
 */
async function awardBookingCoins(client, userId, amountSpent, bookingRef) {
  if (!amountSpent || amountSpent <= 0) return 0;

  // Check membership tier
  const memRes = await client.query(
    `SELECT tier FROM user_memberships WHERE user_id = $1 AND status = 'active'`,
    [userId]
  );
  const tier = memRes.rows[0]?.tier || 'free';
  const rate = tier === 'gold' ? 0.15 : tier === 'standard' ? 0.10 : 0.05;
  const coinsEarned = Math.round(amountSpent * rate * 100) / 100;

  if (coinsEarned > 0) {
    // Ensure wallet exists
    await client.query(
      `INSERT INTO user_wallets (user_id, coin_balance) VALUES ($1, 100.00)
       ON CONFLICT (user_id) DO UPDATE SET coin_balance = user_wallets.coin_balance + $2, updated_at = NOW()`,
      [userId, coinsEarned]
    );

    // Record transaction
    await client.query(
      `INSERT INTO wallet_transactions (user_id, amount, type, description, reference_id)
       VALUES ($1, $2, 'earned', $3, $4)`,
      [userId, coinsEarned, `Earned ${Math.round(rate * 100)}% ApexCoins on booking`, bookingRef]
    );
  }

  return coinsEarned;
}

module.exports = { getMyWallet, awardBookingCoins };
