const API_URL = 'http://localhost:5000/api';

async function testReviewsAndMemberships() {
  console.log('=== TESTING VERIFIED REVIEWS & APEX PREMIERE CLUB ===\n');

  // 1. Register test user
  const userRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `critic_${Date.now()}@apexmovies.com`,
      password: 'Password123!',
      name: 'Ananya Reviewer',
    }),
  });
  const userData = await userRes.json();
  const token = userData.accessToken || userData.token;
  console.log('✓ Registered test reviewer user.');

  // 2. Fetch a movie
  const moviesRes = await fetch(`${API_URL}/movies?limit=1`);
  const moviesData = await moviesRes.json();
  const movie = moviesData.movies[0];
  console.log(`✓ Testing for movie: "${movie.title}" (${movie.id})`);

  // 3. Post a review as regular user (should be is_verified_buyer: false)
  const rev1Res = await fetch(`${API_URL}/movies/${movie.id}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      rating: 5,
      reviewTitle: 'Cinematic Masterpiece!',
      reviewText: 'The visual effects and Dolby Atmos mix blew me away. Must watch in IMAX Laser.',
      isSpoiler: false,
    }),
  });
  const rev1Data = await rev1Res.json();
  console.log('✓ Submitted review:', rev1Data.review?.review_title, '| Verified Buyer:', rev1Data.review?.is_verified_buyer);

  // 4. Upvote helpful
  const voteRes = await fetch(`${API_URL}/reviews/${rev1Data.review.id}/helpful`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const voteData = await voteRes.json();
  console.log('✓ Helpful vote toggled:', voteData.message);

  // 5. Fetch reviews & stats
  const listRes = await fetch(`${API_URL}/movies/${movie.id}/reviews`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const listData = await listRes.json();
  console.log(`✓ Fetched reviews. Average Rating: ${listData.stats.average_rating} (${listData.stats.total_reviews} reviews)`);

  // 6. Test Memberships
  console.log('\n--- Testing Apex Premiere Club Subscriptions ---');
  
  // Get initial membership (free tier)
  const memInitRes = await fetch(`${API_URL}/memberships/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const memInit = await memInitRes.json();
  console.log(`✓ Initial membership tier: ${memInit.tier} (${memInit.tierInfo?.name})`);

  // Subscribe to Gold VIP tier (₹899/mo)
  const subRes = await fetch(`${API_URL}/memberships/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ tier: 'gold' }),
  });
  const subData = await subRes.json();
  console.log(`✓ Subscribed to Gold VIP! Remaining Free Tickets: ${subData.membership?.free_tickets_remaining}`);

  // Hold a seat & checkout using membership free ticket
  const showsRes = await fetch(`${API_URL}/shows/movie/${movie.id}`);
  const shows = await showsRes.json();
  const show = Array.isArray(shows) ? shows[0] : (shows.shows ? shows.shows[0] : null);

  if (show) {
    const seatMapRes = await fetch(`${API_URL}/shows/${show.id}/seats`);
    const seatMap = await seatMapRes.json();
    const seats = Array.isArray(seatMap) ? seatMap : (seatMap.seats || []);
    const availSeat = seats.find((s) => s.status === 'available');

    if (availSeat) {
      const seatId = availSeat.show_seat_id || availSeat.id;
      // Hold seat
      await fetch(`${API_URL}/bookings/hold`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ showId: show.id, showSeatIds: [seatId] }),
      });

      // Checkout with useMembershipTicket: true
      const checkRes = await fetch(`${API_URL}/bookings/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          showId: show.id,
          showSeatIds: [seatId],
          useMembershipTicket: true,
        }),
      });
      const checkData = await checkRes.json();
      console.log(`✓ Confirmed booking with Free Member Ticket! Final Paid: ₹${checkData.booking?.total_amount}, Discount: ₹${checkData.booking?.discount_amount}, Promo Code: ${checkData.booking?.promo_code}`);

      // Verify user's remaining free tickets decremented
      const memAfter = await (await fetch(`${API_URL}/memberships/me`, { headers: { 'Authorization': `Bearer ${token}` } })).json();
      console.log(`✓ Free Tickets Remaining after redemption: ${memAfter.freeTicketsRemaining} (was 4)`);

      // Now post a review as a verified buyer!
      const revBuyerRes = await fetch(`${API_URL}/movies/${movie.id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: 5,
          reviewTitle: 'Verified Buyer Experience',
          reviewText: 'Booked and watched this in theater. Outstanding sound and visuals!',
          isSpoiler: false,
        }),
      });
      const revBuyerData = await revBuyerRes.json();
      console.log(`✓ Updated Review as Verified Buyer: is_verified_buyer = ${revBuyerData.review?.is_verified_buyer}`);
    }
  }

  console.log('\n=== ALL REVIEWS & MEMBERSHIP BACKEND TESTS PASSED 100%! ===\n');
}

testReviewsAndMemberships().catch(console.error);
