require('dotenv').config();
const app = require('./app');
const { releaseExpiredLocks } = require('./services/seatLockService');
const { ensureRollingShowSchedule } = require('./services/showSchedulerService');

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`ApexMovies API listening on port ${PORT}`);
  // Automatically ensure rolling shows for Today & upcoming days on boot
  await ensureRollingShowSchedule().catch(console.error);
});

// Sweeper 1: sweep expired seat locks every 60s
setInterval(() => {
  releaseExpiredLocks().catch((err) => console.error('Lock cleanup failed', err));
}, 60000);

// Sweeper 2: check and roll showtimes every 1 hour
setInterval(() => {
  ensureRollingShowSchedule().catch((err) => console.error('Rolling schedule failed', err));
}, 3600000);
