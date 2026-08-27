const { query } = require('../config/db');

const TIERS = {
  free: { name: 'Silver Member', price: 0, freeTickets: 0, perks: ['5% ApexCoins on all bookings', 'Standard ticket access'] },
  standard: { name: 'Standard Premiere Pass', price: 499.00, freeTickets: 2, perks: ['2 Free Movie Tickets every month', '₹0 Convenience fees on all bookings', '10% off F&B Concessions', 'Priority Seat Selection'] },
  gold: { name: 'Gold VIP Pass', price: 899.00, freeTickets: 4, perks: ['4 Free Movie Tickets every month', '₹0 Convenience fees on all bookings', 'Free Popcorn Combo with every booking', 'Exclusive VIP Lounge Admission', 'Free Cancellations up to 1 hr before show'] },
};

/**
 * Get current user's membership status
 */
const getMyMembership = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await query(
      `SELECT * FROM user_memberships WHERE user_id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      // Default to free tier
      return res.json({
        tier: 'free',
        tierInfo: TIERS.free,
        freeTicketsRemaining: 0,
        freeTicketsTotal: 0,
        status: 'active',
        expiresAt: null,
      });
    }

    const membership = result.rows[0];
    res.json({
      ...membership,
      tierInfo: TIERS[membership.tier] || TIERS.free,
      freeTicketsRemaining: membership.free_tickets_remaining,
      freeTicketsTotal: membership.free_tickets_total,
      expiresAt: membership.expires_at,
    });
  } catch (err) {
    console.error('getMyMembership error:', err);
    res.status(500).json({ error: 'Failed to fetch membership details' });
  }
};

/**
 * Subscribe or upgrade membership tier
 */
const subscribeMembership = async (req, res) => {
  const userId = req.user.id;
  const { tier } = req.body;

  if (!tier || !['standard', 'gold'].includes(tier)) {
    return res.status(400).json({ error: 'Invalid tier. Choose "standard" or "gold"' });
  }

  const selectedTier = TIERS[tier];

  try {
    const result = await query(
      `INSERT INTO user_memberships (user_id, tier, price, billing_cycle, free_tickets_remaining, free_tickets_total, status, started_at, expires_at, updated_at)
       VALUES ($1, $2, $3, 'monthly', $4, $4, 'active', NOW(), NOW() + INTERVAL '30 days', NOW())
       ON CONFLICT (user_id)
       DO UPDATE SET 
         tier = EXCLUDED.tier,
         price = EXCLUDED.price,
         free_tickets_remaining = EXCLUDED.free_tickets_remaining,
         free_tickets_total = EXCLUDED.free_tickets_total,
         status = 'active',
         started_at = NOW(),
         expires_at = NOW() + INTERVAL '30 days',
         updated_at = NOW()
       RETURNING *`,
      [userId, tier, selectedTier.price, selectedTier.freeTickets]
    );

    res.json({
      message: `Successfully subscribed to ${selectedTier.name}! Enjoy your benefits and free tickets.`,
      membership: {
        ...result.rows[0],
        tierInfo: selectedTier,
      },
    });
  } catch (err) {
    console.error('subscribeMembership error:', err);
    res.status(500).json({ error: 'Failed to process membership subscription' });
  }
};

/**
 * Cancel membership subscription
 */
const cancelMembership = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await query(
      `UPDATE user_memberships 
       SET status = 'cancelled', updated_at = NOW() 
       WHERE user_id = $1 
       RETURNING *`,
      [userId]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'No active membership found' });
    }

    res.json({
      message: 'Membership auto-renewal cancelled. You can continue using benefits until the end of the billing cycle.',
      membership: result.rows[0],
    });
  } catch (err) {
    console.error('cancelMembership error:', err);
    res.status(500).json({ error: 'Failed to cancel membership' });
  }
};

module.exports = {
  getMyMembership,
  subscribeMembership,
  cancelMembership,
  TIERS,
};
