require('dotenv').config();
const app = require('./app');
const { releaseExpiredLocks } = require('./services/seatLockService');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`ApexMovies API listening on port ${PORT}`);
});

// Backstop: sweep expired seat locks every 60s so seats free up even if no
// one happens to hit the seat-map endpoint for that show in the meantime.
setInterval(() => {
  releaseExpiredLocks().catch((err) => console.error('Lock cleanup failed', err));
}, 60000);
