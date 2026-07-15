import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

export class RazorpayService {
  private static async createOrder(userEmail: string, userName?: string) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Please sign in to continue');
      }

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          userEmail,
          userName,
          amount: 7900, // ₹79 in paise
          currency: 'INR'
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create order');
      }

      return await res.json();
    } catch (error: any) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  private static async verifyPayment(paymentData: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/payment/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to verify payment signature');
      }

      return await res.json();
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  }

  public static async initializePayment(userEmail: string, userName?: string) {
    try {
      // Check if Razorpay SDK is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Create order
      const orderData = await this.createOrder(userEmail, userName);
      
      const options: RazorpayOptions = {
        key: orderData.razorpayKeyId,
        amount: 7900, // ₹79 in paise
        currency: 'INR',
        name: 'PathGenie',
        description: 'Pro Subscription - Unlimited AI Roadmaps',
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            await this.verifyPayment(response);
            
            // Show success message
            toast.success('🎉 Payment successful! Activating your Pro subscription...');
            
            // Redirect to success page
            setTimeout(() => {
              window.location.href = '/pricing?payment=completed';
            }, 2000);
            
          } catch (error: any) {
            console.error('Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: userName || '',
          email: userEmail,
        },
        theme: {
          color: '#8B5CF6' // Purple theme matching the app
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled. You can try again anytime.');
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();

    } catch (error: any) {
      console.error('Payment initialization error:', error);
      toast.error(error.message || 'Failed to initialize payment. Please try again.');
    }
  }

  public static async cancelSubscription() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('Authentication required');
      }

      const res = await fetch(`${EXPRESS_SERVER_URL}/api/payment/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to cancel subscription');
      }

      return await res.json();
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }
}
