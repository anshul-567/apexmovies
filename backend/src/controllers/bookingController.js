const { query } = require('../config/db');
const { lockSeats, releaseSeats, confirmBooking } = require('../services/seatLockService');
const { calculatePromoDiscount } = require('../utils/promoCalculator');

const MAX_SEATS_PER_BOOKING = 10;

const holdSeats = async (req, res) => {
  const { showId, showSeatIds } = req.body;
  if (!showId || !Array.isArray(showSeatIds) || !showSeatIds.length) {
    return res.status(400).json({ error: 'showId and a non-empty showSeatIds array are required' });
  }
  if (showSeatIds.length > MAX_SEATS_PER_BOOKING) {
    return res.status(400).json({ error: `You can select a maximum of ${MAX_SEATS_PER_BOOKING} seats per booking` });
  }

  try {
    const result = await lockSeats(showId, showSeatIds, req.user.id);
    res.json({
      message: 'Seats held. Complete checkout before the hold expires.',
      lockedUntil: result.lockedUntil,
      seatIds: result.seatIds,
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message || 'Failed to hold seats',
      unavailableSeatIds: err.unavailableSeatIds,
    });
  }
};

const releaseHold = async (req, res) => {
  const { showSeatIds } = req.body;
  if (!Array.isArray(showSeatIds) || !showSeatIds.length) {
    return res.status(400).json({ error: 'showSeatIds array is required' });
  }
  const released = await releaseSeats(showSeatIds, req.user.id);
  res.json({ released });
};

const validatePromo = async (req, res) => {
  const { showId, showSeatIds, seats, promoCode } = req.body;

  try {
    let seatList = [];

    if (Array.isArray(seats) && seats.length) {
      seatList = seats;
    } else if (showId && Array.isArray(showSeatIds) && showSeatIds.length) {
      const seatPrices = await query(
        `SELECT id, price FROM show_seats WHERE id = ANY($1::uuid[]) AND show_id = $2`,
        [showSeatIds, showId]
      );
      if (!seatPrices.rows.length) {
        return res.status(400).json({ error: 'No matching seats found for this show' });
      }
      seatList = seatPrices.rows;
    } else {
      return res.status(400).json({ error: 'showId & showSeatIds or seats array are required to validate promo' });
    }

    const promoResult = calculatePromoDiscount(promoCode, seatList);
    if (!promoResult.valid) {
      return res.status(400).json({ error: promoResult.message, promoResult });
    }

    res.json(promoResult);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to validate promo code' });
  }
};

const checkout = async (req, res) => {
  const {
    showId,
    showSeatIds,
    promoCode,
    useMembershipTicket,
    coinsToRedeem,
    giftCardCode,
    giftCardPin,
  } = req.body;

  if (!showId || !Array.isArray(showSeatIds) || !showSeatIds.length) {
    return res.status(400).json({ error: 'showId and a non-empty showSeatIds array are required' });
  }
  if (showSeatIds.length > MAX_SEATS_PER_BOOKING) {
    return res.status(400).json({ error: `You can select a maximum of ${MAX_SEATS_PER_BOOKING} seats per booking` });
  }

  try {
    const booking = await confirmBooking(
      showId,
      showSeatIds,
      req.user.id,
      promoCode,
      Boolean(useMembershipTicket),
      parseFloat(coinsToRedeem) || 0,
      giftCardCode || '',
      giftCardPin || ''
    );
    res.status(201).json({ message: 'Booking confirmed', booking });
  } catch (err) {
    res.status(err.statusCode || 500).json({
      error: err.message || 'Checkout failed',
      invalidSeatIds: err.invalidSeatIds,
    });
  }
};

const cancelBooking = async (req, res) => {
  const { id: bookingId } = req.params;
  const { reason } = req.body;
  const userId = req.user.id;

  try {
    // 1. Fetch booking with show details and user membership
    const bookingRes = await query(
      `SELECT b.*, sh.start_time, m.title AS movie_title
       FROM bookings b
       JOIN shows sh ON sh.id = b.show_id
       JOIN movies m ON m.id = sh.movie_id
       WHERE b.id = $1 AND b.user_id = $2`,
      [bookingId, userId]
    );

    if (!bookingRes.rows.length) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingRes.rows[0];

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'This booking is already cancelled' });
    }

    // 2. Validate showtime window (> 1 hour before start)
    const showTime = new Date(booking.start_time).getTime();
    const now = Date.now();
    const diffHours = (showTime - now) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return res.status(400).json({
        error: 'Cancellations are only permitted up to 1 hour before showtime as per policy.',
      });
    }

    // 3. Check user membership tier for fee calculation
    const memRes = await query(
      `SELECT tier FROM user_memberships WHERE user_id = $1 AND status = 'active'`,
      [userId]
    );
    const tier = memRes.rows[0]?.tier || 'free';

    // Gold members enjoy 100% Free Cancellation! Others pay standard 25% fee
    const paidAmount = Number(booking.total_amount);
    let cancellationFee = 0;
    let refundAmount = paidAmount;

    if (tier !== 'gold' && paidAmount > 0) {
      cancellationFee = Math.round(paidAmount * 0.25 * 100) / 100;
      refundAmount = Math.max(0, paidAmount - cancellationFee);
    }

    // 4. Atomic cancellation transaction: update booking, release seats, credit wallet, log cancellation
    await query('BEGIN');

    // Update booking status
    await query(
      `UPDATE bookings SET status = 'cancelled' WHERE id = $1`,
      [bookingId]
    );

    // Release show seats back to 'available'
    const seatIdsRes = await query(
      `SELECT show_seat_id FROM booking_seats WHERE booking_id = $1`,
      [bookingId]
    );
    const showSeatIds = seatIdsRes.rows.map((r) => r.show_seat_id);

    if (showSeatIds.length > 0) {
      await query(
        `UPDATE show_seats 
         SET status = 'available', locked_by = NULL, locked_until = NULL, version = version + 1
         WHERE id = ANY($1::uuid[])`,
        [showSeatIds]
      );
      // Remove unique mapping from booking_seats so seats can be rebooked
      await query(`DELETE FROM booking_seats WHERE booking_id = $1`, [bookingId]);
    }

    // Refund membership free ticket if used
    if (booking.promo_code && booking.promo_code.includes('FREE_TICKET')) {
      await query(
        `UPDATE user_memberships 
         SET free_tickets_remaining = free_tickets_remaining + 1, updated_at = NOW()
         WHERE user_id = $1 AND status = 'active'`,
        [userId]
      );
    }

    // Credit refund amount to ApexCoins Wallet
    if (refundAmount > 0) {
      await query(
        `INSERT INTO user_wallets (user_id, coin_balance) VALUES ($1, $2)
         ON CONFLICT (user_id) DO UPDATE SET coin_balance = user_wallets.coin_balance + $2, updated_at = NOW()`,
        [userId, refundAmount]
      );

      await query(
        `INSERT INTO wallet_transactions (user_id, amount, type, description, reference_id)
         VALUES ($1, $2, 'refund', $3, $4)`,
        [
          userId,
          refundAmount,
          `Instant Refund for cancelled booking ${booking.booking_reference} (${booking.movie_title})`,
          booking.booking_reference,
        ]
      );
    }

    // Record cancellation record
    await query(
      `INSERT INTO booking_cancellations (booking_id, user_id, refund_amount, cancellation_fee, reason, refund_method, status)
       VALUES ($1, $2, $3, $4, $5, 'apex_wallet', 'completed')`,
      [bookingId, userId, refundAmount, cancellationFee, reason || 'User requested self-cancellation']
    );

    await query('COMMIT');

    res.json({
      message: 'Booking cancelled successfully. Refund credited to your ApexCoins Wallet!',
      refundAmount,
      cancellationFee,
      refundMethod: 'ApexCoins Wallet',
      bookingReference: booking.booking_reference,
    });
  } catch (err) {
    await query('ROLLBACK');
    res.status(500).json({ error: err.message || 'Failed to cancel booking' });
  }
};

const myBookings = async (req, res) => {
  const result = await query(
    `SELECT b.*, m.title AS movie_title, m.poster_url, sh.start_time, th.name AS theater_name, sc.name AS screen_name,
            json_agg(json_build_object('row', s.row_label, 'seat_number', s.seat_number)) AS seats
     FROM bookings b
     JOIN shows sh ON sh.id = b.show_id
     JOIN movies m ON m.id = sh.movie_id
     JOIN screens sc ON sc.id = sh.screen_id
     JOIN theaters th ON th.id = sc.theater_id
     JOIN booking_seats bs ON bs.booking_id = b.id
     JOIN show_seats ss ON ss.id = bs.show_seat_id
     JOIN seats s ON s.id = ss.seat_id
     WHERE b.user_id = $1
     GROUP BY b.id, m.title, m.poster_url, sh.start_time, th.name, sc.name
     ORDER BY b.created_at DESC`,
    [req.user.id]
  );
  res.json(result.rows);
};

const getBookingById = async (req, res) => {
  const { bookingId } = req.params;

  // Basic UUID format check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(bookingId)) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const result = await query(
    `SELECT b.id, b.user_id, b.total_amount, b.discount_amount, b.promo_code, b.status, b.booking_reference, b.created_at, b.confirmed_at,
            u.name AS customer_name, u.email AS customer_email,
            m.id AS movie_id, m.title AS movie_title, m.poster_url, m.duration_mins, m.genre, m.language, m.rating,
            sh.id AS show_id, sh.start_time, sh.end_time, sh.base_price,
            sc.id AS screen_id, sc.name AS screen_name,
            th.id AS theater_id, th.name AS theater_name, th.city, th.address AS theater_address,
            json_agg(
              json_build_object(
                'row', s.row_label,
                'seat_number', s.seat_number,
                'seat_type', s.seat_type,
                'price', bs.price
              ) ORDER BY s.row_label, s.seat_number
            ) AS seats
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     JOIN shows sh ON sh.id = b.show_id
     JOIN movies m ON m.id = sh.movie_id
     JOIN screens sc ON sc.id = sh.screen_id
     JOIN theaters th ON th.id = sc.theater_id
     JOIN booking_seats bs ON bs.booking_id = b.id
     JOIN show_seats ss ON ss.id = bs.show_seat_id
     JOIN seats s ON s.id = ss.seat_id
     WHERE b.id = $1 AND b.user_id = $2
     GROUP BY b.id, u.id, m.id, sh.id, sc.id, th.id`,
    [bookingId, req.user.id]
  );

  if (!result.rows.length) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  res.json(result.rows[0]);
};

module.exports = {
  holdSeats,
  releaseHold,
  validatePromo,
  checkout,
  cancelBooking,
  myBookings,
  getBookingById,
};


