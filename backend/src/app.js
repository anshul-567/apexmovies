const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const giftCardRoutes = require('./routes/giftCardRoutes');
const walletRoutes = require('./routes/walletRoutes');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'ApexMovies API' }));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/movies', reviewRoutes);
app.use('/api', reviewRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/gift-cards', giftCardRoutes);
app.use('/api/wallet', walletRoutes);

// Centralized error handler - catches anything asyncHandler forwards
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
