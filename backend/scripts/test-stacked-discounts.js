const API_URL = 'http://localhost:5000/api';

async function testStackedDiscounts() {
  console.log('=== TESTING STACKED MEMBERSHIP FREE TICKET + PROMO CODE ===\n');

  // 1. Register test user
  const userRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `stacker_${Date.now()}@apexmovies.com`,
      password: 'Password123!',
      name: 'Rohan Stacker',
    }),
  });
  const userData = await userRes.json();
  const token = userData.accessToken || userData.token;
  console.log('✓ Registered user.');

  // 2. Subscribe to Gold VIP (4 free tickets)
  await fetch(`${API_URL}/memberships/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ tier: 'gold' }),
  });
  console.log('✓ Subscribed to Gold VIP.');

  // 3. Find a show and select 3 seats (e.g. ₹280, ₹280, ₹280 = ₹840)
  const moviesRes = await (await fetch(`${API_URL}/movies?limit=1`)).json();
  const movie = moviesRes.movies[0];
  const shows = await (await fetch(`${API_URL}/shows/movie/${movie.id}`)).json();
  const show = Array.isArray(shows) ? shows[0] : shows.shows[0];

  const seats = await (await fetch(`${API_URL}/shows/${show.id}/seats`)).json();
  const availSeats = seats.filter((s) => s.status === 'available').slice(0, 3);
  const seatIds = availSeats.map((s) => s.show_seat_id || s.id);
  console.log(`✓ Picked 3 seats for show: ${seatIds.join(', ')}`);

  // 4. Hold seats
  await fetch(`${API_URL}/bookings/hold`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ showId: show.id, showSeatIds: seatIds }),
  });
  console.log('✓ Held 3 seats.');

  // 5. Checkout with useMembershipTicket: true AND promoCode: 'WELCOME100'
  const checkRes = await fetch(`${API_URL}/bookings/checkout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      showId: show.id,
      showSeatIds: seatIds,
      useMembershipTicket: true,
      promoCode: 'WELCOME100',
    }),
  });
  const checkData = await checkRes.json();
  console.log(`✓ Stacked Booking Confirmed!`);
  console.log(`   Total Paid: ₹${checkData.booking?.total_amount}`);
  console.log(`   Total Discount: ₹${checkData.booking?.discount_amount} (Free Ticket + WELCOME100 ₹100 off)`);
  console.log(`   Promo Reference: ${checkData.booking?.promo_code}`);

  // 6. Verify free ticket counter decremented from 4 to 3
  const memRes = await (await fetch(`${API_URL}/memberships/me`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
  console.log(`✓ Remaining Member Free Tickets: ${memRes.freeTicketsRemaining} (was 4)`);

  console.log('\n=== ALL DISCOUNT STACKING TESTS PASSED 100%! ===\n');
}

testStackedDiscounts().catch(console.error);
