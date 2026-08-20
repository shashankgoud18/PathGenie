import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  getMe,
  googleCallback,
  githubCallback,
  updateProfile,
  changePassword,
} from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = Router();

// ── Email / Password ─────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);
router.get('/me', requireAuth, getMe);

// ── Profile management ───────────────────────────────────────────────────
router.put('/profile', requireAuth, updateProfile);
router.put('/change-password', requireAuth, changePassword);

// ── Google OAuth ─────────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth?error=google_failed', session: false }),
  googleCallback
);

// ── GitHub OAuth ─────────────────────────────────────────────────────────
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false })
);
router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth?error=github_failed', session: false }),
  githubCallback
);

export default router;
