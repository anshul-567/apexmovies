/**
 * Concurrency test: fires N simultaneous "hold seat" requests at the exact
 * same show_seat and asserts exactly one succeeds and the rest get a 409.
 *
 * Usage:
 *   1. Run migrations + seed against a local Postgres instance.
 *   2. Start the API: npm run dev (in /backend)
 *   3. node scripts/concurrency-test.js
 */
require('dotenv').config();
const { query } = require('../src/config/db');

const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const RACERS = 10;

// A seat from the seeded "Nebula Drift" show (see 002_seed.sql) - swap this
// for any show_seat id from your own data if you re-seed.
const SHOW_ID = process.env.TEST_SHOW_ID || 'd1111111-1111-1111-1111-111111111111';
let SEAT_ID = process.env.TEST_SEAT_ID;

async function registerRacer(i) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: `Racer ${i}`,
      email: `concurrency-racer-${i}-${Date.now()}@test.com`,
      password: 'Password123!',
    }),
  });
  const data = await res.json();
  return data.accessToken;
}

async function attemptHold(token) {
  const res = await fetch(`${BASE_URL}/bookings/hold`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ showId: SHOW_ID, showSeatIds: [SEAT_ID] }),
  });
  return { status: res.status, body: await res.json() };
}

async function main() {
  if (!SEAT_ID) {
    const seatRes = await query(
      'SELECT id FROM show_seats WHERE show_id = $1 AND status = $2 LIMIT 1',
      [SHOW_ID, 'available']
    );
    if (!seatRes.rows.length) {
      console.error('No available seats found for test show.');
      process.exit(1);
    }
    SEAT_ID = seatRes.rows[0].id;
  }

  console.log(`Registering ${RACERS} concurrent users...`);
  const tokens = await Promise.all(Array.from({ length: RACERS }, (_, i) => registerRacer(i + 1)));

  console.log(`Firing ${RACERS} simultaneous hold requests at seat ${SEAT_ID}...`);
  const results = await Promise.all(tokens.map(attemptHold));

  const wins = results.filter((r) => r.status === 200);
  const losses = results.filter((r) => r.status === 409);

  console.log(`\nResults: ${wins.length} succeeded, ${losses.length} rejected (of ${RACERS})`);

  if (wins.length === 1 && losses.length === RACERS - 1) {
    console.log('PASS: exactly one racer won the seat, all others correctly rejected.');
    process.exit(0);
  } else {
    console.error('FAIL: expected exactly 1 winner - seat locking allowed a double-hold.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Test crashed:', err);
  process.exit(1);
});
