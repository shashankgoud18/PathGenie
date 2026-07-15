import crypto from 'crypto';
import { razorpay } from '../config/razorpay.js';
import { supabase } from '../config/supabase.js';

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
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      throw new Error('Failed to prepare subscription records');
    }

    let dbError = null;
    const today = new Date().toISOString();

    if (existingSubscriber) {
      const { error } = await supabase
        .from('subscribers')
        .update({
          email,
          subscribed: false,
          subscription_tier: 'free',
          razorpay_order_id: order.id,
          updated_at: today
        })
        .eq('id', existingSubscriber.id);
      dbError = error;
    } else {
      const { error } = await supabase
        .from('subscribers')
        .insert({
          user_id: userId,
          email,
          subscribed: false,
          subscription_tier: 'free',
          razorpay_order_id: order.id,
          created_at: today,
          updated_at: today
        });
      dbError = error;
    }

    if (dbError) {
      throw new Error('Failed to save payment state to database');
    }

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

    const { data: subscriber, error } = await supabase
      .from('subscribers')
      .update({
        subscribed: true,
        subscription_tier: 'pro',
        subscription_end: subscriptionEnd.toISOString(),
        razorpay_payment_id,
        order_paid: true,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error || !subscriber) {
      throw new Error('Database activation failed');
    }

    return subscriber;
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
      
      const updateData = {
        subscribed: isPaidEvent,
        subscription_tier: isPaidEvent ? 'pro' : 'free',
        order_paid: isPaidEvent,
        razorpay_payment_id: payment.id,
        updated_at: new Date().toISOString()
      };

      if (isPaidEvent) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1);
        updateData.subscription_end = expiry.toISOString();
      }

      let query = supabase.from('subscribers').update(updateData);
      
      if (orderId) {
        query = query.eq('razorpay_order_id', orderId);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else {
        return { success: false, reason: 'No order_id or user_id mapping reference found' };
      }

      const { error } = await query;
      if (error) {
        throw error;
      }

      return { success: true };
    }

    return { success: false, reason: 'Unsupported currency or plan rate size' };
  }

  /**
   * Cancels a premium subscription
   */
  static async cancelSubscription(userId) {
    const { error } = await supabase
      .from('subscribers')
      .update({
        subscribed: false,
        subscription_tier: 'free',
        subscription_end: null,
        order_paid: false,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Cancellation database update failed: ${error.message}`);
    }

    return { success: true };
  }
}
