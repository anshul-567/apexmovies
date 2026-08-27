# ApexMovies — Next-Gen Cinema Experience & Multiplex Booking Engine

A modern, high-performance cinema discovery and ticket booking platform built with **React (Vite/CRA)**, **Node.js/Express**, and **PostgreSQL**. Features strict atomic seat locking (`SELECT ... FOR UPDATE`), 47-city nationwide multiplex coverage, stackable discount engine, Premiere Club VIP memberships, digital cinema gift cards, ApexCoins rewards wallet, audience reviews, and 1-click self-service cancellations.

---

## 🚀 Key Features

### 🎬 1. Nationwide Cinema Discovery & 47-City Network
- **47 Indian Cities Covered**: Browse movies and showtimes in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Indore, Jaipur, and 38+ more cities.
- **211 Multiplexes & 1,226 Auditorium Screens**: Authentic theaters (*PVR, INOX, Cinepolis, AMB Cinemas, Miraj, etc.*) featuring formats:
  - 🎬 **Audi 1 4K Laser** (80 Seats)
  - ⚡ **IMAX 3D Grand Hall** (120 Seats)
  - 🔊 **Audi 3 Dolby Atmos** (80 Seats)
  - 🛋️ **VIP Director Class Recliners** (48 Seats)
- **Accurate CBFC Age Certifications**: Badges displayed across all titles (`U`, `UA 13+`, `UA 16+`, `A`).
- **High-Resolution Thematic Posters**: Handcrafted movie poster art matching genre, language, and title synopses.

---

### 🎟️ 2. Natural Auditorium Seating & Concurrency Lock
- **True Physical Hall Order**: Natural sequential row order ($A \rightarrow H / J$) from front screen to luxury back recliners.
- **Dynamic Tier Boundaries**: Demarcated section headers for:
  - 🎟️ **Classic Standard** (Front Rows)
  - 👑 **Executive Premium** (Middle Rows)
  - 🛋️ **VIP Recliner Luxury** (Back Rows)
- **Pessimistic Concurrency Engine**: Uses PostgreSQL `SELECT ... FOR UPDATE` row locks with 5-minute countdown timers and automatic 60-second backstop background sweepers. Zero double-booking under race conditions.

---

### 👑 3. Premiere Club VIP Memberships
- **Tier Options**:
  - **Standard Pass (₹499/mo)**: 2 Free Monthly Tickets, 10% F&B Discount, Priority Booking, 10% Coins Cashback.
  - **Gold VIP Pass (₹899/mo)**: 4 Free Monthly Tickets, Free Gourmet Popcorn, VIP Lounge Access, 15% Coins Cashback, **100% Free Cancellation Guarantee**.
- **Dedicated Membership Checkout**: Streamlined subscription onboarding at `/membership-checkout/:tier`.

---

### 🎁 4. Apex Cinema Gift Cards & E-Vouchers Hub ([`/gift-cards`](http://localhost:3000/gift-cards))
- **Interactive 3D Gift Card Customizer**: 4 themed digital designs (*Cinema VIP Gold*, *Birthday Blockbuster*, *Cyber IMAX*, *Couple Movie Date*).
- **Voucher Code & PIN Engine**: 16-digit voucher card numbers (`APEX-XXXX-XXXX-XXXX`) with 4-digit security PINs.
- **Balance Checker & Vault**: Real-time balance and expiry verification for digital gift cards.

---

### 🪙 5. Apex Loyalty Coins & Rewards Wallet ([`/rewards`](http://localhost:3000/rewards))
- **100 Welcome ApexCoins**: Automatically credited to every new customer upon registration (`1 Coin = ₹1.00`).
- **Tier-Based Cashback Engine**: Automatically earn 5% (Free), 10% (Standard), or 15% (Gold VIP) cashback on every movie booking.
- **Full Transaction Ledger**: Audit history tracking cashback earned, checkout redemptions, welcome bonuses, and ticket refund deposits.

---

### 🛡️ 6. 1-Click Ticket Cancellation & Instant Refund ([`/bookings`](http://localhost:3000/bookings))
- **Self-Service 1-Click Cancellation**: Available on all confirmed bookings $> 1\text{ hour}$ before showtime.
- **Smart Fee Waiver**:
  - **Gold VIP Members**: 100% Full Refund (₹0 cancellation fee).
  - **Standard / Non-Members**: 75% Refund (25% cancellation fee).
- **Atomic Release & Wallet Credit**: Releases auditorium seats back to available, restores free tickets, and credits refund amount directly to the user's ApexCoins Wallet.

---

### 🏷️ 7. Stackable Discounts & Promo Codes Engine
- **Simultaneous Discount Stacking**: Apply 1 Free Member Ticket + Promo Codes (`WELCOME100`, `SUPERIMAX`, `WEEKEND50`, `STUDENT50`, etc.) + ApexCoins + Gift Cards in a single transaction.
- **Detailed Interactive Bill Breakdown**: Dynamic calculations with CGST/SGST taxes, promo deductions, and coin redemptions.

---

### ⭐ 8. Verified Audience Reviews & Community Ratings
- **Verified Buyer Badges**: Only users with confirmed booking tickets receive the green `✓ Verified Ticket Buyer` badge.
- **Spoiler Shield**: Auto-masks user review text flagged with spoilers.

---

## 🏗️ Architecture & Project Structure

```
apexmovies/
├── backend/
│   ├── src/
│   │   ├── config/db.js                  PostgreSQL pool with SSL & transaction helper
│   │   ├── migrations/
│   │   │   ├── 001_init.sql              Initial schema & core tables
│   │   │   ├── 002_seed.sql              Default seed accounts & initial data
│   │   │   ├── 003_features.sql          Wishlists & favorites
│   │   │   ├── 004_indian_cities...sql   Initial Indian theaters
│   │   │   ├── 005_expanded_films...sql  80+ films & 47 Indian cities
│   │   │   ├── 006_discount_offers.sql   Promotional coupon codes
│   │   │   ├── 007_reviews_members...sql Reviews & Premiere Club schema
│   │   │   ├── 008_movie_age_ratings.sql CBFC age certifications
│   │   │   └── 009_giftcards_wallet...sql Gift cards, ApexCoins wallet & cancellations
│   │   ├── controllers/                  Auth, movies, theaters, shows, bookings, wallet, gift cards, reviews
│   │   ├── services/seatLockService.js   Seat locking, checkout & stacked discount calculations
│   │   └── routes/                       Express API routers
│   └── scripts/
│       ├── migrate-all.js                1-Click migration runner for any PostgreSQL database
│       ├── populate-4-theaters-per-city.js Provisions 4+ theaters per city across all 47 cities
│       ├── populate-all-movies-all-cities.js Schedules shows and materializes bookable seats
│       ├── test-giftcards-wallet-cancellations.js Automated features 4, 5, 6 test suite
│       └── e2e-features-test.js          Full end-to-end platform verification test
├── frontend/
│   ├── src/
│   │   ├── context/                      Auth, City, and Booking Context providers
│   │   ├── components/                   Navbar, Footer, MovieCard, SeatMap, TicketCard
│   │   ├── pages/
│   │   │   ├── Home.jsx                  Dynamic hero carousel, city filtering, genre tags
│   │   │   ├── MovieDetails.jsx          Showtime selectors, age rating, verified reviews
│   │   │   ├── Theaters.jsx              Interactive theater list with live show dropdowns
│   │   │   ├── SeatSelection.jsx         Interactive tiered physical auditorium seat map
│   │   │   ├── Checkout.jsx              Stackable discount engine, coins & gift card inputs
│   │   │   ├── GiftCards.jsx             3D Gift card customizer & balance checker
│   │   │   ├── RewardsWallet.jsx         ApexCoins balance hub & transaction ledger
│   │   │   ├── PremiereClub.jsx          Membership tiers & benefits breakdown
│   │   │   ├── MembershipCheckout.jsx    VIP pass subscription checkout
│   │   │   ├── MyBookings.jsx            E-tickets with QR codes & 1-click cancellation modal
│   │   │   ├── Offers.jsx                Copyable promo coupons & promotional banners
│   │   │   └── admin/                    ManageMovies, ManageTheaters, ManageShows
│   │   └── styles/theme.css              Modern dark glassmorphic design system tokens
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (Local or any Free Cloud DB like [Neon.tech](https://neon.tech), [Supabase](https://supabase.com), or [Render](https://render.com))

---

### 2. Database Setup & Migrations

1. Configure your `.env` in `backend/`:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://postgres:password@localhost:5432/apexmovies
   JWT_ACCESS_SECRET=your_super_secret_access_key
   JWT_REFRESH_SECRET=your_super_secret_refresh_key
   ```
2. Run the 1-Click Migration and Population Scripts:
   ```bash
   cd backend
   npm install
   npm run migrate:all       # Runs all SQL migrations 001 through 009
   npm run seed:theaters     # Generates at least 4 authentic theaters in all 47 cities
   npm run seed:shows        # Schedules shows & materializes seat maps
   ```

---

### 3. Run the Backend API Server

```bash
cd backend
npm run dev               # Starts API on http://localhost:5000
```

---

### 4. Run the Frontend Client

```bash
cd frontend
npm install
npm start                 # Starts React client on http://localhost:3000
```

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@apexmovies.com` | `Password123!` | Full Admin Portal (`/admin`), Movie & Screen Builder |
| **👤 Customer** | `jane@example.com` | `Password123!` | Ticket Booking, Loyalty Wallet, Wishlist, Cancellations |

*(You can also create a new customer account anytime via the **[Sign up](http://localhost:3000/register)** page).*

---

## 🧪 Automated Testing & Verification

Run the verification suites in `backend/`:

- **End-to-End Core Verification**:
  ```bash
  node scripts/e2e-features-test.js
  ```
- **Gift Cards, ApexCoins & Cancellations Verification**:
  ```bash
  node scripts/test-giftcards-wallet-cancellations.js
  ```
- **Stacked Discounts Engine Verification**:
  ```bash
  node scripts/test-stacked-discounts.js
  ```
- **Concurrent Seat-Locking Stress Test**:
  ```bash
  node scripts/concurrency-test.js
  ```

---

## ☁️ Free Cloud Database Deployment (Neon / Supabase / Render)

ApexMovies is pre-configured with automatic SSL handling (`rejectUnauthorized: false`). To deploy to a free database:

1. Create a free PostgreSQL instance on **[Neon.tech](https://neon.tech)** or **[Supabase](https://supabase.com)**.
2. Update `DATABASE_URL` in `backend/.env` with your cloud URI.
3. Run:
   ```bash
   npm run migrate:all
   npm run seed:theaters
   npm run seed:shows
   ```
4. Deploy your backend and frontend to Render, Vercel, or Railway!

---

## 📄 License
MIT © 2026 ApexMovies India Pvt. Ltd.
