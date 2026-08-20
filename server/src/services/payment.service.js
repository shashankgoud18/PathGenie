import crypto from 'crypto';
import { razorpay } from '../config/razorpay.js';
import { query } from '../config/db.js';

export class PaymentService {
  /**
   * Creates a Razorpay checkout order
   */
  static async createOrder(userId, email, amount = 7900) {
    if (!razorpay) {
      throw new Error('Razorpay SDK is not initialized on the server');
    }

    const timestamp = Date.now().toString().slice(-8);
    const userIdShort = userId.slice(0, 8);
    const receipt = `rcpt_${userIdShort}_${timestamp}`;

    const options = {
      amount, // In paise (7900 = ₹79)
      currency: 'INR',
      receipt,
      notes: {
        user_id: userId,
        user_email: email,
        subscription_type: 'pro',
        plan: 'monthly'
      }
    };

    const order = await razorpay.orders.create(options);

    // Save order details to subscribers table
    const today = new Date().toISOString();

    await query(
      `INSERT INTO subscribers (user_id, email, subscribed, subscription_tier, razorpay_order_id, created_at, updated_at)
       VALUES ($1, $2, false, 'free', $3, $4, $4)
       ON CONFLICT (user_id) DO UPDATE SET
         email = EXCLUDED.email,
         subscribed = false,
         subscription_tier = 'free',
         razorpay_order_id = EXCLUDED.razorpay_order_id,
         updated_at = EXCLUDED.updated_at`,
      [userId, email, order.id, today]
    );

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      razorpayKeyId: process.env.RAZORPAY_KEY_ID
    };
  }

  /**
   * Verifies payment signatures returned by the frontend checkout widget
   */
  static async verifyPaymentSignature(userId, paymentDetails) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentDetails;
    const secret = process.env.RAZORPAY_SECRET;

    if (!secret) {
      throw new Error('Razorpay secret key not found in environment');
    }

    // Verify signature hash
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    const isValid = generatedSignature === razorpay_signature;
    if (!isValid) {
      throw new Error('Invalid signature hash received');
    }

    // Activate the subscription in subscribers database table
    const subscriptionEnd = new Date();
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1);
    const today = new Date().toISOString();

    const res = await query(
      `UPDATE subscribers SET
         subscribed = true,
         subscription_tier = 'pro',
         subscription_end = $1,
         razorpay_payment_id = $2,
         order_paid = true,
         updated_at = $3
       WHERE user_id = $4
       RETURNING *`,
      [subscriptionEnd.toISOString(), razorpay_payment_id, today, userId]
    );

    if (res.rows.length === 0) {
      throw new Error('Database activation failed');
    }

    return res.rows[0];
  }

  /**
   * Handles payment verification via Webhooks (standard captured events)
   */
  static async handleWebhook(signature, rawBody) {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('Webhook secret is not configured on the server');
    }

    // Verify Webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      throw new Error('Invalid webhook signature hash');
    }

    const event = JSON.parse(rawBody);

    const payment = event.payload?.payment?.entity;
    if (!payment) return { success: false, reason: 'Invalid event payload' };

    const orderId = payment.order_id;
    const userId = payment.notes?.user_id;

    if (payment.amount === 7900 && payment.currency === 'INR') {
      const isPaidEvent = event.event === 'payment.captured' || event.event === 'payment.authorized';
      const today = new Date().toISOString();
      const expiry = new Date();
      expiry.setMonth(expiry.getMonth() + 1);

      if (orderId) {
        await query(
          `UPDATE subscribers SET
             subscribed = $1,
             subscription_tier = $2,
             order_paid = $1,
             razorpay_payment_id = $3,
             subscription_end = $4,
             updated_at = $5
           WHERE razorpay_order_id = $6`,
          [isPaidEvent, isPaidEvent ? 'pro' : 'free', payment.id, isPaidEvent ? expiry.toISOString() : null, today, orderId]
        );
      } else if (userId) {
        await query(
          `UPDATE subscribers SET
             subscribed = $1,
             subscription_tier = $2,
             order_paid = $1,
             razorpay_payment_id = $3,
             subscription_end = $4,
             updated_at = $5
           WHERE user_id = $6`,
          [isPaidEvent, isPaidEvent ? 'pro' : 'free', payment.id, isPaidEvent ? expiry.toISOString() : null, today, userId]
        );
      } else {
        return { success: false, reason: 'No order_id or user_id mapping reference found' };
      }

      return { success: true };
    }

    return { success: false, reason: 'Unsupported currency or plan rate size' };
  }

  /**
   * Cancels a premium subscription
   */
  static async cancelSubscription(userId) {
    const today = new Date().toISOString();
    const res = await query(
      `UPDATE subscribers SET
         subscribed = false,
         subscription_tier = 'free',
         subscription_end = null,
         order_paid = false,
         updated_at = $1
       WHERE user_id = $2
       RETURNING *`,
      [today, userId]
    );

    if (res.rows.length === 0) {
      throw new Error('Cancellation database update failed');
    }

    return { success: true };
  }
}
