const { withTransaction } = require('../config/db');

const LOCK_MINUTES = parseInt(process.env.SEAT_LOCK_MINUTES || '5', 10);

const generateBookingReference = () =>
  'APX-' + Math.random().toString(36).slice(2, 8).toUpperCase();

/**
 * Attempts to lock a set of seats for a given user.
 * Uses SELECT ... FOR UPDATE to serialize concurrent requests for the same
 * rows, so two users racing for the same seat can never both succeed.
 */
const lockSeats = async (showId, showSeatIds, userId) => {
  return withTransaction(async (client) => {
    // Row-level lock: any other transaction trying to touch these same
    // show_seats rows blocks here until this transaction commits/rolls back.
    const selectResult = await client.query(
      `SELECT id, status, locked_by, locked_until
       FROM show_seats
       WHERE id = ANY($1::uuid[]) AND show_id = $2
       FOR UPDATE`,
      [showSeatIds, showId]
    );

    if (selectResult.rows.length !== showSeatIds.length) {
      const err = new Error('One or more selected seats do not exist for this show');
      err.statusCode = 400;
      throw err;
    }

    const now = new Date();
    const unavailable = selectResult.rows.filter((seat) => {
      if (seat.status === 'booked') return true;
      if (seat.status === 'locked' && seat.locked_by !== userId && new Date(seat.locked_until) > now) {
        return true;
      }
      return false;
    });

    if (unavailable.length) {
      const err = new Error('One or more selected seats are no longer available');
      err.statusCode = 409;
      err.unavailableSeatIds = unavailable.map((s) => s.id);
      throw err;
    }

    const lockedUntil = new Date(now.getTime() + LOCK_MINUTES * 60000);
    await client.query(
      `UPDATE show_seats
       SET status = 'locked', locked_by = $1, locked_until = $2, version = version + 1
       WHERE id = ANY($3::uuid[])`,
      [userId, lockedUntil, showSeatIds]
    );

    return { lockedUntil, seatIds: showSeatIds };
  });
};

/**
 * Releases seats locked by a user (explicit cancel, or a client giving up
 * on checkout). Only releases seats this user actually holds the lock on.
 */
const releaseSeats = async (showSeatIds, userId) => {
  return withTransaction(async (client) => {
    const result = await client.query(
      `UPDATE show_seats
       SET status = 'available', locked_by = NULL, locked_until = NULL
       WHERE id = ANY($1::uuid[]) AND locked_by = $2 AND status = 'locked'
       RETURNING id`,
      [showSeatIds, userId]
    );
    return result.rows.map((r) => r.id);
  });
};

const { calculatePromoDiscount } = require('../utils/promoCalculator');

/**
 * Confirms a booking: re-validates the caller still holds a live lock on
 * every seat, then atomically flips seats to 'booked' and inserts the
 * booking + booking_seats rows. Everything happens in one transaction so
 * a failure at any step leaves seats untouched (no partial bookings).
 */
const confirmBooking = async (
  showId,
  showSeatIds,
  userId,
  promoCode = '',
  useMembershipTicket = false,
  coinsToRedeem = 0,
  giftCardCode = '',
  giftCardPin = ''
) => {
  return withTransaction(async (client) => {
    const selectResult = await client.query(
      `SELECT id, status, price, locked_by, locked_until
       FROM show_seats
       WHERE id = ANY($1::uuid[]) AND show_id = $2
       FOR UPDATE`,
      [showSeatIds, showId]
    );

    if (selectResult.rows.length !== showSeatIds.length) {
      const err = new Error('One or more seats do not exist for this show');
      err.statusCode = 404;
      throw err;
    }

    const unconfirmedSeatIds = selectResult.rows
      .filter((s) => s.status !== 'locked' || s.locked_by !== userId)
      .map((s) => s.id);

    if (unconfirmedSeatIds.length > 0) {
      const err = new Error('You no longer hold the lock for all selected seats. Please re-select.');
      err.statusCode = 409;
      err.invalidSeatIds = unconfirmedSeatIds;
      throw err;
    }

    // 1. Flip seats to booked
    await client.query(
      `UPDATE show_seats
       SET status = 'booked', locked_by = NULL, locked_until = NULL, version = version + 1
       WHERE id = ANY($1::uuid[])`,
      [showSeatIds]
    );

    // 2. Calculate base pricing & member/promo discounts
    const subtotal = selectResult.rows.reduce((sum, seat) => sum + Number(seat.price), 0);
    let memberDiscount = 0;
    let promoDiscount = 0;
    let appliedPromoCode = promoCode || null;

    let remainingSeatsForPromo = [...selectResult.rows];

    if (useMembershipTicket) {
      const memRes = await client.query(
        `SELECT id, tier, free_tickets_remaining FROM user_memberships 
         WHERE user_id = $1 AND status = 'active' AND free_tickets_remaining > 0 FOR UPDATE`,
        [userId]
      );

      if (!memRes.rows.length) {
        const err = new Error('No active membership or free tickets remaining');
        err.statusCode = 400;
        throw err;
      }

      const sortedSeats = [...selectResult.rows].sort((a, b) => Number(a.price) - Number(b.price));
      const freeSeat = sortedSeats[0];
      memberDiscount = Number(freeSeat.price);

      await client.query(
        `UPDATE user_memberships 
         SET free_tickets_remaining = free_tickets_remaining - 1, updated_at = NOW() 
         WHERE id = $1`,
        [memRes.rows[0].id]
      );

      const freeIndex = remainingSeatsForPromo.findIndex((s) => s.id === freeSeat.id);
      if (freeIndex !== -1) {
        remainingSeatsForPromo.splice(freeIndex, 1);
      }
    }

    if (promoCode) {
      if (remainingSeatsForPromo.length > 0) {
        const promoResult = calculatePromoDiscount(promoCode, remainingSeatsForPromo);
        if (!promoResult.valid) {
          const err = new Error(promoResult.message || 'Invalid promo code');
          err.statusCode = 400;
          throw err;
        }
        promoDiscount = promoResult.discountAmount || 0;
        appliedPromoCode = useMembershipTicket ? `FREE_TICKET+${promoResult.code}` : promoResult.code;
      } else {
        appliedPromoCode = 'MEMBERSHIP_FREE_TICKET';
      }
    } else if (useMembershipTicket) {
      appliedPromoCode = 'MEMBERSHIP_FREE_TICKET';
    }

    let currentPayable = Math.max(0, subtotal - (memberDiscount + promoDiscount));
    let coinsDiscount = 0;
    let giftCardDiscount = 0;

    // 3. Redeem ApexCoins if requested
    const coinsNum = parseFloat(coinsToRedeem) || 0;
    if (coinsNum > 0 && currentPayable > 0) {
      const walletRes = await client.query(
        `SELECT coin_balance FROM user_wallets WHERE user_id = $1 FOR UPDATE`,
        [userId]
      );
      const availableCoins = walletRes.rows.length ? Number(walletRes.rows[0].coin_balance) : 0;
      coinsDiscount = Math.min(availableCoins, coinsNum, currentPayable);

      if (coinsDiscount > 0) {
        await client.query(
          `UPDATE user_wallets SET coin_balance = coin_balance - $1, updated_at = NOW() WHERE user_id = $2`,
          [coinsDiscount, userId]
        );
        currentPayable = Math.max(0, currentPayable - coinsDiscount);
      }
    }

    // 4. Redeem Gift Card if provided
    if (giftCardCode && giftCardPin && currentPayable > 0) {
      const cardRes = await client.query(
        `SELECT id, current_balance, expires_at FROM gift_cards 
         WHERE card_code = $1 AND pin = $2 AND status = 'active' FOR UPDATE`,
        [giftCardCode.trim().toUpperCase(), giftCardPin.trim()]
      );

      if (!cardRes.rows.length) {
        const err = new Error('Invalid Gift Card Code or PIN');
        err.statusCode = 400;
        throw err;
      }

      const card = cardRes.rows[0];
      if (new Date(card.expires_at) < new Date()) {
        const err = new Error('Gift card has expired');
        err.statusCode = 400;
        throw err;
      }

      const cardBal = Number(card.current_balance);
      giftCardDiscount = Math.min(cardBal, currentPayable);

      if (giftCardDiscount > 0) {
        const newCardBal = Math.max(0, cardBal - giftCardDiscount);
        await client.query(
          `UPDATE gift_cards 
           SET current_balance = $1::numeric, status = (CASE WHEN $1::numeric <= 0 THEN 'redeemed' ELSE 'active' END), updated_at = NOW()
           WHERE id = $2`,
          [newCardBal, card.id]
        );
        currentPayable = Math.max(0, currentPayable - giftCardDiscount);
      }
    }

    const totalDiscountAmount = Math.min(subtotal, Math.round((memberDiscount + promoDiscount + coinsDiscount + giftCardDiscount) * 100) / 100);
    const finalAmount = Math.max(0, Math.round(currentPayable * 100) / 100);
    const bookingReference = generateBookingReference();

    const bookingResult = await client.query(
      `INSERT INTO bookings (user_id, show_id, total_amount, discount_amount, promo_code, status, booking_reference, confirmed_at)
       VALUES ($1,$2,$3,$4,$5,'confirmed',$6, now()) RETURNING *`,
      [userId, showId, finalAmount, totalDiscountAmount, appliedPromoCode, bookingReference]
    );
    const booking = bookingResult.rows[0];

    const seatValues = selectResult.rows
      .map((seat) => `('${booking.id}', '${seat.id}', ${seat.price})`)
      .join(',');
    await client.query(
      `INSERT INTO booking_seats (booking_id, show_seat_id, price) VALUES ${seatValues}`
    );

    await client.query(
      `UPDATE show_seats SET status = 'booked', locked_by = NULL, locked_until = NULL, version = version + 1
       WHERE id = ANY($1::uuid[])`,
      [showSeatIds]
    );

    return booking;
  });
};

/**
 * Backstop cleanup for expired locks. Called on-demand from seat-map reads
 * (getShowSeatMap) and can also be wired to a periodic cron/setInterval job
 * so seats free up even if nobody happens to view that show in the meantime.
 */
const releaseExpiredLocks = async (client) => {
  const runner = client || require('../config/db').pool;
  await runner.query(
    `UPDATE show_seats SET status = 'available', locked_by = NULL, locked_until = NULL
     WHERE status = 'locked' AND locked_until < now()`
  );
};

module.exports = { lockSeats, releaseSeats, confirmBooking, releaseExpiredLocks };
