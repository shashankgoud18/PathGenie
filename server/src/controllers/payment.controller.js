import { PaymentService } from '../services/payment.service.js';

export const createCheckoutOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { userEmail, userName, amount } = req.validatedBody;
    const result = await PaymentService.createOrder(userId, userEmail, amount);
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const verifyCheckoutSignature = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await PaymentService.verifyPaymentSignature(userId, req.validatedBody);
    
    res.status(200).json({
      success: true,
      message: 'Payment verified and Pro subscription activated',
      subscriber: result
    });
  } catch (err) {
    next(err);
  }
};

export const handleRazorpayWebhook = async (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    }

    // Razorpay webhook payload needs to be raw buffer for signature verification
    const rawBody = req.rawBody; 
    const result = await PaymentService.handleWebhook(signature, rawBody);
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await PaymentService.cancelSubscription(userId);
    
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
