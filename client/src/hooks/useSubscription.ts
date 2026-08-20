import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const EXPRESS_SERVER_URL = import.meta.env.VITE_EXPRESS_SERVER_URL || 'http://localhost:5000';

interface SubscriptionData {
  tier: string;
  subscribed: boolean;
  subscription_end?: string;
}

interface UsageData {
  gemini: number;
  youtube: number;
}

export const useSubscription = () => {
  const [subscription, setSubscription] = useState<SubscriptionData>(() => {
    const cached = localStorage.getItem('subscription_status');
    return cached ? JSON.parse(cached) : { tier: 'free', subscribed: false };
  });
  const [usage, setUsage] = useState<UsageData>({ gemini: 0, youtube: 0 });
  const [loading, setLoading] = useState(() => {
    const cached = localStorage.getItem('subscription_status');
    return !cached;
  });
  const [lastFetch, setLastFetch] = useState<number>(0);
  const { user, token } = useAuth();

  const fetchSubscriptionAndUsage = async () => {
    if (!user || !token) {
      setLoading(false);
      return;
    }

    const now = Date.now();
    if (now - lastFetch < 60000 && lastFetch > 0) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${EXPRESS_SERVER_URL}/api/subscription/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setSubscription(data.subscription);
          setUsage(data.usage || { gemini: 0, youtube: 0 });
          localStorage.setItem('subscription_status', JSON.stringify(data.subscription));
        }
      }
      setLastFetch(now);
    } catch (error) {
      console.error('Error fetching subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token) {
      fetchSubscriptionAndUsage();
    } else {
      setLoading(false);
      setSubscription({ tier: 'free', subscribed: false });
      localStorage.removeItem('subscription_status');
    }
  }, [user, token]);

  const refreshSubscription = () => {
    if (user && token) {
      setLastFetch(0);
      fetchSubscriptionAndUsage();
    }
  };

  return {
    subscription,
    usage,
    loading,
    refreshSubscription,
    isProUser: subscription.subscribed && subscription.tier === 'pro'
  };
};
