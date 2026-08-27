const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const signAccessToken = (user) =>
  jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );

const signRefreshToken = (user) =>
  jwt.sign(
    { sub: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d' }
  );

const verifyAccessToken = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

// We never store raw refresh tokens - only a hash, so a DB leak can't be
// replayed directly as a valid token.
const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
