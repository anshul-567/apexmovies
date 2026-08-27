const bcrypt = require('bcrypt');
const { query } = require('../config/db');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('../utils/jwt');

const REFRESH_COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const issueTokens = async (res, user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
    [user.id, hashToken(refreshToken), expiresAt]
  );

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTS);
  return accessToken;
};

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (role && !['customer', 'theater_admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    return res.status(409).json({ error: 'An account with this email already exists' });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await query(
    `INSERT INTO users (name, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, role`,
    [name, email, passwordHash, role || 'customer']
  );

  const user = result.rows[0];
  const accessToken = await issueTokens(res, user);
  res.status(201).json({ user, accessToken });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const result = await query(
    'SELECT id, name, email, password_hash, role FROM users WHERE email = $1',
    [email]
  );
  const userRow = result.rows[0];

  if (!userRow || !(await bcrypt.compare(password, userRow.password_hash))) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const user = { id: userRow.id, name: userRow.name, email: userRow.email, role: userRow.role };
  const accessToken = await issueTokens(res, user);
  res.json({ user, accessToken });
};

const refresh = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ error: 'Missing refresh token' });

  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ error: 'Invalid or expired refresh token' });
  }

  const tokenHash = hashToken(token);
  const stored = await query(
    `SELECT id FROM refresh_tokens WHERE user_id = $1 AND token_hash = $2 AND revoked = false AND expires_at > now()`,
    [payload.sub, tokenHash]
  );
  if (!stored.rows.length) {
    return res.status(401).json({ error: 'Refresh token not recognized, please log in again' });
  }

  const userResult = await query('SELECT id, name, email, role FROM users WHERE id = $1', [payload.sub]);
  const user = userResult.rows[0];
  if (!user) return res.status(401).json({ error: 'User no longer exists' });

  // Rotate: revoke the old token, issue a new pair
  await query('UPDATE refresh_tokens SET revoked = true WHERE id = $1', [stored.rows[0].id]);
  const accessToken = await issueTokens(res, user);
  res.json({ user, accessToken });
};

const logout = async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await query(
      `UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1`,
      [hashToken(token)]
    );
  }
  res.clearCookie('refreshToken', REFRESH_COOKIE_OPTS);
  res.json({ message: 'Logged out' });
};

module.exports = { register, login, refresh, logout };
