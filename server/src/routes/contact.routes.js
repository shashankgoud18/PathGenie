import { Router } from 'express';
import { submitContact } from '../controllers/contact.controller.js';
import { rateLimit } from 'express-rate-limit';

const router = Router();

// Prevent contact form spam: max 5 submissions per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many contact submissions. Please try again in 15 minutes.' },
});

router.post('/', contactLimiter, submitContact);

export default router;
