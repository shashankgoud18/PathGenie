import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Users } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { RazorpayService } from '@/services/razorpay';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SubscriptionCard = () => {
  const { subscription, isProUser, refreshSubscription } = useSubscription();
  const { user } = useAuth();

  const handleUpgradeClick = async () => {
    if (!user?.email) {
      toast.error('Please sign in to upgrade to Pro');
      return;
    }

    await RazorpayService.initializePayment(
      user.email,
      user.user_metadata?.full_name || user.email.split('@')[0]
    );
  };

  const handleManageSubscription = async () => {
    try {
      await RazorpayService.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      refreshSubscription();
    } catch (error: any) {
      toast.error(error.message || 'Failed to manage subscription');
    }
  };

  const freeFeatures = [
    '1 AI roadmap per month',
    'Curated resources integration',
    'Progress tracking checkboxes',
    'Community support'
  ];

  const proFeatures = [
    'Unlimited AI roadmaps',
    'Share roadmaps publicly',
    'Advanced progress analytics',
    'Early access to new features',
    'Custom learning style filters',
    'Priority support & live chat'
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto px-4 text-left">
      {/* Free Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`relative transition-all duration-300 border bg-[#0B0B0F]/60 backdrop-blur-xl ${
          !isProUser 
            ? 'border-purple-500/20 shadow-xl' 
            : 'border-white/[0.04]'
        } rounded-xl`}>
          <CardHeader className="pb-6 pt-8 px-6 text-left">
            {!isProUser && (
              <div className="absolute top-[-10px] right-[20px]">
                <span className="bg-purple-500/5 text-purple-400 border border-purple-500/20 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded">
                  Current Plan
                </span>
              </div>
            )}
            <div className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center mb-4 shrink-0">
              <Star className="w-4.5 h-4.5 text-slate-400" />
            </div>
            <CardTitle className="text-base font-bold text-white mb-1 font-display">Free Tier</CardTitle>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold text-white font-mono">₹0</span>
              <span className="text-slate-500 ml-1.5 text-xs font-mono">/ month</span>
            </div>
            <CardDescription className="text-slate-500 text-xs leading-relaxed">
              Perfect for getting started with AI learning paths.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <ul className="space-y-3 pt-2">
              {freeFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-slate-300 text-xs">
                  <Check className="w-4 h-4 mr-2.5 text-purple-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {!isProUser && (
              <Button 
                disabled 
                variant="ghost" 
                className="w-full border border-white/[0.08] text-slate-500 cursor-default rounded-lg mt-6 py-2 text-xs font-semibold"
              >
                Current Plan
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Pro Plan */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className={`relative transition-all duration-300 border bg-[#0B0B0F]/70 backdrop-blur-xl ${
          isProUser 
            ? 'border-purple-500/20 shadow-xl' 
            : 'border-white/[0.04] shadow-lg hover:border-purple-500/10'
        } rounded-xl`}>
          <CardHeader className="pb-6 pt-8 px-6 text-left">
            <div className="absolute top-[-10px] right-[20px]">
              <span className={`text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded border ${
                isProUser 
                  ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                  : 'bg-purple-500/5 text-purple-400 border-purple-500/20'
              }`}>
                {isProUser ? 'Active' : 'Recommended'}
              </span>
            </div>
            
            <div className="w-9 h-9 rounded-lg bg-purple-500/5 border border-purple-500/20 flex items-center justify-center mb-4 shrink-0">
              <Crown className="w-4.5 h-4.5 text-amber-400" />
            </div>
            <CardTitle className="text-base font-bold text-white mb-1 font-display">Pro Plan</CardTitle>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-bold text-white font-mono">₹79</span>
              <span className="text-slate-500 ml-1.5 text-xs font-mono">/ month</span>
            </div>
            <CardDescription className="text-slate-500 text-xs leading-relaxed">
              Unlimited access to all premium features.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-6">
            <ul className="space-y-3 pt-2">
              {proFeatures.map((feature, index) => (
                <li key={index} className="flex items-center text-slate-300 text-xs">
                  <Check className="w-4 h-4 mr-2.5 text-purple-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            
            {/* Pro Benefits Highlights */}
            <div className="bg-[#050505]/40 rounded-lg p-3.5 border border-white/[0.04] mt-6">
              <div className="flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Pro Advantages</span>
              </div>
              <ul className="text-[10px] text-slate-500 space-y-1 ml-4 list-disc text-left">
                <li>Access all shared community roadmaps</li>
                <li>Toggle advanced learning styles</li>
                <li>Export curricula to external targets</li>
              </ul>
            </div>          
            
            {isProUser ? (
              <div className="space-y-4 pt-2">
                {subscription.subscription_end && (
                  <div className="text-center mt-3">
                    <p className="text-[10px] text-slate-500 font-mono">
                      Next billing: {new Date(subscription.subscription_end).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={handleManageSubscription}
                  className="w-full bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold py-2 rounded-lg transition-all"
                >
                  Cancel Subscription
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleUpgradeClick}
                className="w-full bg-white hover:bg-slate-200 text-black text-xs font-bold py-2.5 rounded-lg mt-6 transition-all hover:scale-[1.01]"
              >
                Upgrade to Pro - ₹79/month
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SubscriptionCard;
