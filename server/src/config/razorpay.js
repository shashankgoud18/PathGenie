import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_SECRET = process.env.RAZORPAY_SECRET;

export let razorpay = null;

if (RAZORPAY_KEY_ID && RAZORPAY_SECRET) {
  try {
    razorpay = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_SECRET
    });
  } catch (err) {
    // Silently ignore configuration failure
  }
}
