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

async function test10SeatsBooking() {
  console.log('Testing multi-seat booking (10 seats)...');

  // 1. Register test user
  const email = `multi10_${Date.now()}@example.com`;
  const regRes = await request('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password123!', name: 'Group Booker' }),
  });
  const token = regRes.data.accessToken;

  // 2. Find a show with available seats
  const moviesRes = await request('http://localhost:5000/api/movies?status=now_showing');
  const movieId = moviesRes.data.movies[0].id;
  const showsRes = await request(`http://localhost:5000/api/shows/movie/${movieId}`);
  const show = showsRes.data[0];

  // 3. Get seats
  const seatsRes = await request(`http://localhost:5000/api/shows/${show.id}/seats`);
  const available = seatsRes.data.filter((s) => s.status === 'available');
  if (available.length < 10) throw new Error('Not enough available seats in test show');

  const selected10 = available.slice(0, 10);
  const showSeatIds = selected10.map((s) => s.show_seat_id);

  console.log(`Holding 10 seats: ${selected10.map(s => s.row_label + s.seat_number).join(', ')}...`);
  const holdRes = await request('http://localhost:5000/api/bookings/hold', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds }),
  });
  if (holdRes.status !== 200) throw new Error(`Hold failed: ${JSON.stringify(holdRes.data)}`);
  console.log('✓ Successfully held 10 seats!');

  // 4. Confirm checkout
  console.log('Checking out 10 seats...');
  const checkoutRes = await request('http://localhost:5000/api/bookings/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: show.id, showSeatIds }),
  });
  if (checkoutRes.status !== 201) throw new Error(`Checkout failed: ${JSON.stringify(checkoutRes.data)}`);
  console.log(`✓ Booking confirmed for 10 seats! Reference: ${checkoutRes.data.booking.booking_reference}, Total: ₹${checkoutRes.data.booking.total_amount}`);

  // 5. Get full ticket
  const ticketRes = await request(`http://localhost:5000/api/bookings/${checkoutRes.data.booking.id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (ticketRes.status !== 200 || ticketRes.data.seats.length !== 10) {
    throw new Error('Ticket does not have 10 seats');
  }
  console.log(`✓ Ticket verified with all 10 seats: ${ticketRes.data.seats.map(s => s.row + s.seat_number + ' (' + s.seat_type + ')').join(', ')}`);

  console.log('\n=== 10-SEAT BOOKING VERIFICATION SUCCESSFUL! ===');
}

test10SeatsBooking().catch(console.error);
