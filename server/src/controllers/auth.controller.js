import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required in environment variables');
}

const JWT_EXPIRES_IN = '7d';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

const setAuthCookie = (res, token) => {
  res.cookie('auth_token', token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
};

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.full_name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Email / Password
// ─────────────────────────────────────────────────────────────────────────────

export const register = async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const existingUser = await query(
      'SELECT id FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUserResult = await query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, avatar_url, created_at`,
      [email.toLowerCase(), passwordHash, fullName || '']
    );

    const user = newUserResult.rows[0];

    await query(
      `INSERT INTO profiles (id, full_name, avatar_url)
       VALUES ($1, $2, $3)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, fullName || '', '']
    );

    await query(
      `INSERT INTO subscribers (user_id, email, subscribed, subscription_tier)
       VALUES ($1, $2, false, 'free')
       ON CONFLICT (user_id) DO NOTHING`,
      [user.id, user.email]
    );

    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await query(
      `SELECT id, email, password_hash, full_name, avatar_url, created_at
       FROM users WHERE LOWER(email) = LOWER($1)`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = userResult.rows[0];

    // OAuth-only users have an empty password_hash — disallow password login
    if (!user.password_hash) {
      return res.status(401).json({
        error: 'This account uses social login. Please sign in with Google or GitHub.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    delete user.password_hash;
    const token = signToken(user);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const userResult = await query(
      `SELECT id, email, full_name, avatar_url, created_at FROM users WHERE id = $1`,
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ success: true, user: userResult.rows[0] });
  } catch (err) {
    next(err);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// OAuth Callbacks — Passport attaches req.user from the strategy verify fn
// ─────────────────────────────────────────────────────────────────────────────

export const googleCallback = (req, res) => {
  try {
    const token = signToken(req.user);
    setAuthCookie(res, token);
    return res.redirect(`${CLIENT_URL}/auth/callback`);
  } catch {
    return res.redirect(`${CLIENT_URL}/auth?error=token_failed`);
  }
};

export const githubCallback = (req, res) => {
  try {
    const token = signToken(req.user);
    setAuthCookie(res, token);
    return res.redirect(`${CLIENT_URL}/auth/callback`);
  } catch {
    return res.redirect(`${CLIENT_URL}/auth?error=token_failed`);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Profile & Password management
// ─────────────────────────────────────────────────────────────────────────────

export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, avatarUrl } = req.body;
    const userId = req.user.id;

    if (!fullName && !avatarUrl) {
      return res.status(400).json({ error: 'Provide at least one field to update' });
    }

    const result = await query(
      `UPDATE users
       SET full_name   = COALESCE($1, full_name),
           avatar_url  = COALESCE($2, avatar_url),
           updated_at  = NOW()
       WHERE id = $3
       RETURNING id, email, full_name, avatar_url, created_at`,
      [fullName || null, avatarUrl || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Keep profiles table in sync
    await query(
      `UPDATE profiles
       SET full_name  = COALESCE($1, full_name),
           avatar_url = COALESCE($2, avatar_url),
           updated_at = NOW()
       WHERE id = $3`,
      [fullName || null, avatarUrl || null, userId]
    );

    return res.status(200).json({ success: true, user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const userResult = await query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password_hash } = userResult.rows[0];

    // Block OAuth-only users from setting a password via this endpoint
    if (!password_hash) {
      return res.status(400).json({
        error: 'OAuth accounts do not have a password. Use your social provider to manage credentials.',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    await query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [newHash, userId]
    );

    return res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};
