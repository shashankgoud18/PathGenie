import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import passport from 'passport';

import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { initDB, pool } from './config/db.js';
import { configurePassport } from './config/passport.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const validateEnvironment = () => {
  const required = ['JWT_SECRET'];

  if (process.env.NODE_ENV === 'production') {
    required.push('CLIENT_URL', 'DATABASE_URL');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is required in environment variables');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in environment variables');
  }

  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
};

validateEnvironment();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// ── Database ──────────────────────────────────────────────────────────────
initDB().catch(err => console.error('Database sync warning:', err.message));

// ── Passport OAuth ────────────────────────────────────────────────────────
configurePassport();
app.use(passport.initialize());

// ── Security headers (helmet) ─────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // allow Razorpay SDK iframes
    contentSecurityPolicy: false,     // managed at CDN/Nginx layer
  })
);

// ── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS policy: origin not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ── Global rate limiter (DDoS / brute-force guard) ────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,                  // 300 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) => req.path === '/health' || req.path === '/api/health',
});
app.use(globalLimiter);

// Stricter limiter on auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many authentication attempts. Please wait 15 minutes.' },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// ── Body parsing — capture raw body for Razorpay webhook HMAC ────────────
app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// ── Base routes ───────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the PathGenie SaaS Backend API',
    status: 'online',
    version: '1.0.0',
  });
});

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message,
    });
  }
});

// ── API routes ────────────────────────────────────────────────────────────
app.use('/api', apiRouter);

// ── 404 fallback ──────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// ── Centralised error handler ─────────────────────────────────────────────
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 PathGenie server running on port ${PORT}`);
});
