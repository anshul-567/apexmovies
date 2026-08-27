const http = require('http');

function request(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const req = http.request({
      hostname: parsed.hostname,
      port: parsed.port,
      path: parsed.pathname + parsed.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testPromoDiscounts() {
  console.log('=== TESTING PROMO OFFERS & DISCOUNT APPLICATION ===\n');

  // 1. Register user
  const email = `promo_${Date.now()}@example.com`;
  const regRes = await request('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!', name: 'Promo Tester' }),
  });
  const token = regRes.data.accessToken;

  // 2. Get show with seats
  const moviesRes = await request('http://localhost:5000/api/movies?status=now_showing');
  const movieId = moviesRes.data.movies[0].id;
  const showsRes = await request(`http://localhost:5000/api/shows/movie/${movieId}`);
  const show = showsRes.data[0];

  const seatsRes = await request(`http://localhost:5000/api/shows/${show.id}/seats`);
  const available = seatsRes.data.filter((s) => s.status === 'available');
  if (available.length < 3) throw new Error('Not enough available seats in test show');

  const seat1 = available[0];
  const seat2 = available[1];
  const seat3 = available[2];

  // Test 1: Validate WELCOME100 on 1 seat (price ~280)
  const val1 = await request('http://localhost:5000/api/bookings/validate-promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id], promoCode: 'WELCOME100' }),
  });
  if (val1.status !== 200 || val1.data.discountAmount !== 100) {
    throw new Error(`WELCOME100 validation failed: ${JSON.stringify(val1.data)}`);
  }
  console.log(`✓ WELCOME100 validated: Subtotal ₹${val1.data.subtotal} - Discount ₹${val1.data.discountAmount} = Final ₹${val1.data.finalAmount}`);

  // Test 2: Validate APEX15 (15% off on 2 seats)
  const val2 = await request('http://localhost:5000/api/bookings/validate-promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id, seat2.show_seat_id], promoCode: 'APEX15' }),
  });
  const expected15 = Math.round((Number(seat1.price) + Number(seat2.price)) * 0.15 * 100) / 100;
  if (val2.status !== 200 || val2.data.discountAmount !== expected15) {
    throw new Error(`APEX15 validation failed: ${JSON.stringify(val2.data)}`);
  }
  console.log(`✓ APEX15 validated: Subtotal ₹${val2.data.subtotal} - Discount ₹${val2.data.discountAmount} = Final ₹${val2.data.finalAmount}`);

  // Test 3: Validate WEEKEND3 on 3 seats (lowest seat free)
  const val3 = await request('http://localhost:5000/api/bookings/validate-promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id, seat2.show_seat_id, seat3.show_seat_id], promoCode: 'WEEKEND3' }),
  });
  if (val3.status !== 200 || val3.data.discountAmount <= 0) {
    throw new Error(`WEEKEND3 validation failed: ${JSON.stringify(val3.data)}`);
  }
  console.log(`✓ WEEKEND3 validated: Subtotal ₹${val3.data.subtotal} - Free Seat Discount ₹${val3.data.discountAmount} = Final ₹${val3.data.finalAmount}`);

  // Test 4: Invalid promo code rejection
  const valInvalid = await request('http://localhost:5000/api/bookings/validate-promo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id], promoCode: 'FAKEDISCOUNT99' }),
  });
  if (valInvalid.status !== 400) {
    throw new Error(`Invalid promo code was not rejected: ${JSON.stringify(valInvalid.data)}`);
  }
  console.log(`✓ Invalid promo code correctly rejected: "${valInvalid.data.error}"`);

  // Test 5: Complete Booking with WELCOME100
  await request('http://localhost:5000/api/bookings/hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id, seat2.show_seat_id] }),
  });

  const checkoutRes = await request('http://localhost:5000/api/bookings/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [seat1.show_seat_id, seat2.show_seat_id], promoCode: 'WELCOME100' }),
  });
  if (checkoutRes.status !== 201) throw new Error(`Checkout with promo failed: ${JSON.stringify(checkoutRes.data)}`);
  const booking = checkoutRes.data.booking;
  if (Number(booking.discount_amount) !== 100 || booking.promo_code !== 'WELCOME100') {
    throw new Error(`Booking record missing promo fields: ${JSON.stringify(booking)}`);
  }
  console.log(`✓ Booking confirmed with promo! Reference: ${booking.booking_reference}, Total Paid: ₹${booking.total_amount}, Discount Saved: ₹${booking.discount_amount}`);

  // Test 6: Verify full ticket endpoint returns discount & promo info
  const ticketRes = await request(`http://localhost:5000/api/bookings/${booking.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (ticketRes.status !== 200 || ticketRes.data.promo_code !== 'WELCOME100' || Number(ticketRes.data.discount_amount) !== 100) {
    throw new Error(`Ticket endpoint missing promo fields: ${JSON.stringify(ticketRes.data)}`);
  }
  console.log(`✓ Ticket details verified with promo: Code "${ticketRes.data.promo_code}", Discount ₹${ticketRes.data.discount_amount}`);

  console.log('\n=== ALL PROMO OFFER TESTS PASSED SUCCESSFULLY! ===');
}

testPromoDiscounts().catch(console.error);
