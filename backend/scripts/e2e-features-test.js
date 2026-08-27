/**
 * Comprehensive End-to-End Test for All 4 Features & Security
 */
require('dotenv').config();
const { pool, query } = require('../src/config/db');

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

async function runE2ETests() {
  console.log('=== STARTING APEXMOVIES END-TO-END FEATURE VERIFICATION ===\n');

  // 1. User Registration & Auth
  const emailA = `test-customer-a-${Date.now()}@apexmovies.com`;
  const emailB = `test-customer-b-${Date.now()}@apexmovies.com`;

  console.log('1. Registering test user A and test user B...');
  const userARes = await request(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Customer', email: emailA, password: 'Password123!' }),
  });
  if (userARes.status !== 201) throw new Error(`User A registration failed: ${JSON.stringify(userARes.data)}`);
  const tokenA = userARes.data.accessToken;

  const userBRes = await request(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob Customer', email: emailB, password: 'Password123!' }),
  });
  if (userBRes.status !== 201) throw new Error(`User B registration failed: ${JSON.stringify(userBRes.data)}`);
  const tokenB = userBRes.data.accessToken;

  console.log('✓ Users registered successfully.');

  // 2. Feature 2: Advanced Movie Search and Filtering
  console.log('\n2. Testing Advanced Movie Search & Filtering...');
  // 2a. Title search
  const searchRes = await request(`${BASE_URL}/movies?search=nebula`);
  if (searchRes.status !== 200 || !searchRes.data.movies.length) throw new Error('Search by title "nebula" failed');
  console.log(`✓ Search "nebula": found ${searchRes.data.movies.length} movies (Total: ${searchRes.data.pagination.total})`);

  // 2b. Genre & Language search
  const genreRes = await request(`${BASE_URL}/movies?genre=Sci-Fi&language=English`);
  if (genreRes.status !== 200 || !genreRes.data.movies.length) throw new Error('Genre & Language filter failed');
  console.log(`✓ Genre "Sci-Fi" + Language "English": found ${genreRes.data.movies.length} movies`);

  // 2c. Min rating filter
  const ratingRes = await request(`${BASE_URL}/movies?minRating=8.0`);
  if (ratingRes.status !== 200) throw new Error('Min rating filter failed');
  const allAbove8 = ratingRes.data.movies.every((m) => Number(m.rating) >= 8.0);
  if (!allAbove8) throw new Error('Rating filter returned movies below rating 8.0');
  console.log(`✓ Min Rating 8.0+: found ${ratingRes.data.movies.length} movies, all rating >= 8.0`);

  // 2d. City filter
  const cityRes = await request(`${BASE_URL}/movies?city=Indore`);
  if (cityRes.status !== 200 || !cityRes.data.movies.length) throw new Error('City filter failed');
  console.log(`✓ City "Indore": found ${cityRes.data.movies.length} movies with shows in Indore`);

  // 2e. Pagination & Sorting
  const sortRes = await request(`${BASE_URL}/movies?sort=rating_desc&page=1&limit=2`);
  if (sortRes.status !== 200 || sortRes.data.movies.length > 2) throw new Error('Pagination limit failed');
  if (sortRes.data.pagination.page !== 1 || sortRes.data.pagination.limit !== 2) throw new Error('Pagination metadata mismatch');
  console.log(`✓ Pagination & Sorting (page 1, limit 2): totalPages = ${sortRes.data.pagination.totalPages}`);

  // 3. Feature 4: Wishlist / Favorites
  console.log('\n3. Testing Wishlist / Favorites System...');
  const targetMovieId = searchRes.data.movies[0].id;

  // Add to favorites
  const addFavRes = await request(`${BASE_URL}/movies/${targetMovieId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (addFavRes.status !== 200 || !addFavRes.data.isFavorite) throw new Error('Add favorite failed');
  console.log('✓ Added movie to User A wishlist');

  // Idempotency: adding again should not fail
  const addFavAgain = await request(`${BASE_URL}/movies/${targetMovieId}/favorite`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (addFavAgain.status !== 200) throw new Error('Duplicate favorite creation failed');
  console.log('✓ Verified duplicate favorite creation is idempotent');

  // Check favorite status
  const checkFav = await request(`${BASE_URL}/movies/${targetMovieId}/favorite`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (!checkFav.data.isFavorite) throw new Error('Check favorite returned false');

  // List favorites
  const listFav = await request(`${BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (listFav.status !== 200 || listFav.data.length !== 1) throw new Error('List favorites returned incorrect count');
  console.log(`✓ User A wishlist has ${listFav.data.length} movie(s)`);

  // Verify User B does not see User A's favorite
  const listFavB = await request(`${BASE_URL}/favorites`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (listFavB.status !== 200 || listFavB.data.length !== 0) throw new Error('User isolation broken for favorites');
  console.log('✓ Verified User B has isolated empty wishlist');

  // Remove favorite
  const removeFav = await request(`${BASE_URL}/movies/${targetMovieId}/favorite`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (removeFav.status !== 200) throw new Error('Remove favorite failed');
  console.log('✓ Removed movie from User A wishlist');

  // 4. Feature 3: Improved Show / Date / Theater Selection
  console.log('\n4. Testing Improved Show / Date / Theater Selection...');
  const showsRes = await request(`${BASE_URL}/shows/movie/${targetMovieId}?city=Indore`);
  if (showsRes.status !== 200 || !showsRes.data.length) throw new Error('Get shows for movie failed');
  const show = showsRes.data[0];
  if (!show.theater_name || !show.theater_address || !show.screen_name) {
    throw new Error('Show details missing theater_name, theater_address, or screen_name');
  }
  console.log(`✓ Show found for "${show.theater_name}" at "${show.theater_address}" (${show.screen_name})`);

  // 5. Feature 1: Complete Booking Flow & Downloadable Ticket
  console.log('\n5. Testing Booking Flow & Ticket Generation...');
  // Get seat map
  const seatsRes = await request(`${BASE_URL}/shows/${show.id}/seats`);
  if (seatsRes.status !== 200 || !seatsRes.data.length) throw new Error('Get seat map failed');
  const availableSeat = seatsRes.data.find((s) => s.status === 'available');
  if (!availableSeat) throw new Error('No available seats for test show');

  // Hold seat
  const holdRes = await request(`${BASE_URL}/bookings/hold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [availableSeat.show_seat_id] }),
  });
  if (holdRes.status !== 200) throw new Error(`Hold seats failed: ${JSON.stringify(holdRes.data)}`);
  console.log(`✓ Held seat ${availableSeat.row_label}${availableSeat.seat_number}`);

  // Checkout
  const checkoutRes = await request(`${BASE_URL}/bookings/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ showId: show.id, showSeatIds: [availableSeat.show_seat_id] }),
  });
  if (checkoutRes.status !== 201 || !checkoutRes.data.booking) throw new Error(`Checkout failed: ${JSON.stringify(checkoutRes.data)}`);
  const booking = checkoutRes.data.booking;
  console.log(`✓ Confirmed booking ref: ${booking.booking_reference}`);

  // Fetch ticket details (User A)
  const ticketRes = await request(`${BASE_URL}/bookings/${booking.id}`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (ticketRes.status !== 200 || !ticketRes.data) throw new Error(`Fetch ticket failed: ${JSON.stringify(ticketRes.data)}`);
  const ticket = ticketRes.data;

  // Verify all required ticket attributes
  const requiredTicketFields = [
    'booking_reference', 'customer_name', 'customer_email', 'movie_title', 'poster_url',
    'theater_name', 'theater_address', 'screen_name', 'start_time', 'seats', 'total_amount', 'status'
  ];
  for (const field of requiredTicketFields) {
    if (ticket[field] === undefined || ticket[field] === null) {
      throw new Error(`Ticket missing required field: ${field}`);
    }
  }
  console.log(`✓ Verified full ticket details (Movie: ${ticket.movie_title}, Theater: ${ticket.theater_name}, Seats: ${ticket.seats.map(s => s.row + s.seat_number).join(', ')})`);

  // Security Verification: User B attempts to access User A's ticket
  const unauthorizedTicketRes = await request(`${BASE_URL}/bookings/${booking.id}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (unauthorizedTicketRes.status !== 404 && unauthorizedTicketRes.status !== 403) {
    throw new Error(`SECURITY VULNERABILITY: User B was able to access User A's ticket! Status: ${unauthorizedTicketRes.status}`);
  }
  console.log(`✓ Security Authorization verified: User B cannot access User A's ticket (Status ${unauthorizedTicketRes.status})`);

  console.log('\n=== ALL END-TO-END VERIFICATION TESTS PASSED SUCCESSFULLY! ===\n');
  process.exit(0);
}

runE2ETests().catch((err) => {
  console.error('\n❌ E2E TEST FAILED:', err);
  process.exit(1);
});
