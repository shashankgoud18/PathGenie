import { Router } from 'express';
import { 
  createCheckoutOrder, 
  verifyCheckoutSignature, 
  handleRazorpayWebhook, 
  cancelSubscription 
} from '../controllers/payment.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { checkRateLimit } from '../middlewares/rateLimit.middleware.js';
import { validateCreateOrder, validateVerifySignature } from '../validators/payment.validator.js';

const router = Router();

// Order creation route with IP/User rate limits
router.post('/create-order', requireAuth, validateCreateOrder, checkRateLimit('general'), createCheckoutOrder);

// Verify signature returning from Razorpay widget checkout completion
router.post('/verify', requireAuth, validateVerifySignature, verifyCheckoutSignature);

// Cancel user subscription membership
router.post('/cancel', requireAuth, cancelSubscription);

// Webhook listener endpoint for Razorpay payment triggers
router.post('/webhook', handleRazorpayWebhook);

export default router;
