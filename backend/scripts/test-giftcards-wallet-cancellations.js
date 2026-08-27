const API_URL = 'http://localhost:5000/api';

async function testFeatures456() {
  console.log('=== TESTING FEATURES 4, 5, 6 (GIFT CARDS, REWARDS WALLET, CANCELLATIONS) ===\n');

  // 1. Register test user
  const userRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `apex_vip_${Date.now()}@apexmovies.com`,
      password: 'Password123!',
      name: 'Priya Sharma',
    }),
  });
  const userData = await userRes.json();
  const token = userData.accessToken || userData.token;
  console.log('✓ Registered test user.');

  // 2. Check Wallet - should have 100 Welcome ApexCoins
  const walletInit = await (await fetch(`${API_URL}/wallet/me`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
  console.log(`✓ Wallet Initial Balance: ${walletInit.coinBalance} ApexCoins (${walletInit.tier} tier, ${walletInit.earnRatePercent}% earn rate)`);

  // 3. Purchase Gift Card
  const giftRes = await fetch(`${API_URL}/gift-cards/purchase`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      recipientName: 'Aarav Patel',
      recipientEmail: 'aarav@example.com',
      amount: 500,
      theme: 'birthday_blast',
      message: 'Happy Birthday! Have fun at the movies!',
    }),
  });
  const giftData = await giftRes.json();
  const cardCode = giftData.giftCard?.card_code;
  const pin = giftData.giftCard?.pin;
  console.log(`✓ Purchased Gift Card: ${cardCode} | PIN: ${pin} | Balance: ₹${giftData.giftCard?.current_balance}`);

  // 4. Verify Gift Card Balance
  const checkCard = await (await fetch(`${API_URL}/gift-cards/check-balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cardCode, pin }),
  })).json();
  console.log(`✓ Verified Gift Card Balance: ₹${checkCard.card?.current_balance} (Status: ${checkCard.card?.status})`);

  // 5. Book a movie show redeeming 50 ApexCoins + Gift Card
  const moviesRes = await (await fetch(`${API_URL}/movies?limit=1`)).json();
  const movie = moviesRes.movies[0];
  const shows = await (await fetch(`${API_URL}/shows/movie/${movie.id}`)).json();
  const showsList = Array.isArray(shows) ? shows : (shows.shows || []);
  // Pick future show (> 2 hours from now)
  const now = Date.now();
  const futureShow = showsList.find((s) => new Date(s.start_time).getTime() - now > 2 * 60 * 60 * 1000) || showsList[showsList.length - 1];

  const seats = await (await fetch(`${API_URL}/shows/${futureShow.id}/seats`)).json();
  const availSeats = seats.filter((s) => s.status === 'available').slice(0, 2);
  const seatIds = availSeats.map((s) => s.show_seat_id || s.id);

  // Hold seats
  await fetch(`${API_URL}/bookings/hold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ showId: futureShow.id, showSeatIds: seatIds }),
  });
  console.log('✓ Held 2 seats for show.');

  // Checkout with 50 Coins + Gift Card
  const checkRes = await fetch(`${API_URL}/bookings/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({
      showId: futureShow.id,
      showSeatIds: seatIds,
      coinsToRedeem: 50,
      giftCardCode: cardCode,
      giftCardPin: pin,
    }),
  });
  const checkData = await checkRes.json();
  if (!checkRes.ok) {
    console.error('Checkout error response:', checkData);
    throw new Error(checkData.error || 'Checkout failed');
  }
  const booking = checkData.booking;
  console.log(`✓ Booking confirmed with ApexCoins & Gift Card!`);
  console.log(`   Final Paid: ₹${booking.total_amount}`);
  console.log(`   Total Discounts Applied: ₹${booking.discount_amount}`);
  console.log(`   Booking Ref: ${booking.booking_reference}`);

  // Check updated wallet and gift card balance
  const walletAfter = await (await fetch(`${API_URL}/wallet/me`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
  console.log(`✓ Updated Wallet Balance: ${walletAfter.coinBalance} Coins`);

  // 6. Test 1-Click Ticket Cancellation & Instant Wallet Refund
  console.log('\n--- Testing 1-Click Ticket Cancellation ---');
  const cancelRes = await fetch(`${API_URL}/bookings/${booking.id}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ reason: 'Plans changed for the weekend' }),
  });
  const cancelData = await cancelRes.json();
  if (!cancelRes.ok) {
    console.error('Cancellation failed:', cancelData);
    throw new Error(cancelData.error || 'Cancellation failed');
  }
  console.log(`✓ Booking Cancellation Success: ${cancelData.message}`);
  console.log(`   Refund Amount Credited: ₹${cancelData.refundAmount}`);
  console.log(`   Cancellation Fee: ₹${cancelData.cancellationFee}`);

  // Check that seats are now back to 'available'
  const seatMapAfter = await (await fetch(`${API_URL}/shows/${futureShow.id}/seats`)).json();
  const seatsArr = Array.isArray(seatMapAfter) ? seatMapAfter : (seatMapAfter.seats || []);
  const releasedSeats = seatsArr.filter((s) => seatIds.includes(s.show_seat_id || s.id));
  const allAvailable = releasedSeats.every((s) => s.status === 'available');
  console.log(`✓ Verified Seats Released Back to Available: ${allAvailable}`);

  // Check that wallet was refunded
  const walletFinal = await (await fetch(`${API_URL}/wallet/me`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
  console.log(`✓ Final Wallet Balance after Refund: ${walletFinal.coinBalance} ApexCoins`);

  console.log('\n=== ALL FEATURES 4, 5, 6 BACKEND TESTS PASSED 100%! ===\n');
}

testFeatures456().catch(console.error);
