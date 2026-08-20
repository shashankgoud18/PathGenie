import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query } from './db.js';

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

/**
 * Finds an existing user by email or creates a new one from OAuth profile data.
 * OAuth users have a NULL password_hash since they authenticate through the provider.
 */
async function findOrCreateOAuthUser(email, fullName, avatarUrl, provider) {
  // 1. Look for existing user by email
  const existing = await query(
    `SELECT id, email, full_name, avatar_url, created_at FROM users WHERE LOWER(email) = LOWER($1)`,
    [email]
  );

  if (existing.rows.length > 0) {
    const user = existing.rows[0];
    // Update avatar if it changed
    if (avatarUrl && user.avatar_url !== avatarUrl) {
      await query(
        `UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2`,
        [avatarUrl, user.id]
      );
      user.avatar_url = avatarUrl;
    }
    return user;
  }

  // 2. Create new user (no password_hash for OAuth users)
  const newUser = await query(
    `INSERT INTO users (email, password_hash, full_name, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, email, full_name, avatar_url, created_at`,
    [email.toLowerCase(), '', fullName || '', avatarUrl || '']
  );

  const user = newUser.rows[0];

  // Create profile row
  await query(
    `INSERT INTO profiles (id, full_name, avatar_url)
     VALUES ($1, $2, $3)
     ON CONFLICT (id) DO NOTHING`,
    [user.id, fullName || '', avatarUrl || '']
  );

  // Create free subscriber record
  await query(
    `INSERT INTO subscribers (user_id, email, subscribed, subscription_tier)
     VALUES ($1, $2, false, 'free')
     ON CONFLICT (user_id) DO NOTHING`,
    [user.id, user.email]
  );

  return user;
}

export const configurePassport = () => {
  // ── Google Strategy ──────────────────────────────────────────────────────
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const email =
              profile.emails?.[0]?.value || `${profile.id}@google.oauth`;
            const fullName = profile.displayName || '';
            const avatarUrl = profile.photos?.[0]?.value || '';
            const user = await findOrCreateOAuthUser(
              email,
              fullName,
              avatarUrl,
              'google'
            );
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  }

  // ── GitHub Strategy ──────────────────────────────────────────────────────
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL: `${SERVER_URL}/api/auth/github/callback`,
          scope: ['user:email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // GitHub may have multiple emails; pick the primary verified one
            const primaryEmail =
              profile.emails?.find((e) => e.primary && e.verified)?.value ||
              profile.emails?.[0]?.value ||
              `${profile.id}@github.oauth`;
            const fullName = profile.displayName || profile.username || '';
            const avatarUrl = profile.photos?.[0]?.value || '';
            const user = await findOrCreateOAuthUser(
              primaryEmail,
              fullName,
              avatarUrl,
              'github'
            );
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
  }

  // Passport session serialization (we use JWT so these are minimal stubs)
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => done(null, { id }));

  return passport;
};
