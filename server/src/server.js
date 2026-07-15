import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/error.middleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend clients
app.use(cors({
  origin: '*', // Allow all origins for local/staging testing, customize as needed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Capture raw body for Razorpay webhook verification before parsing
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use(express.urlencoded({ extended: true }));

// Base welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the PathGenie SaaS Backend API',
    status: 'online',
    version: '1.0.0',
    documentation: '/api/health'
  });
});

// Mount all API endpoints
app.use('/api', apiRouter);

// Stale route fallback
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: `Route ${req.method} ${req.path} not found` });
});

// Centralized error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 PathGenie SaaS Express server running on port ${PORT}`);
});
