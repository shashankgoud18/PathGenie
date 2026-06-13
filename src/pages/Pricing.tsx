import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SubscriptionCard from '@/components/SubscriptionCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Sparkles, ArrowLeft, Check, Shield, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Pricing = () => {
  const { user } = useAuth();
  const { refreshSubscription } = useSubscription();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Handle successful checkout
    if (searchParams.get('success') === 'true') {
      toast.success('🎉 Welcome to Pro! Your subscription is now active.');
      setTimeout(() => {
        refreshSubscription();
      }, 2000);
    }
    
    // Handle canceled checkout
    if (searchParams.get('canceled') === 'true') {
      toast.info('Checkout was canceled. You can try again anytime.');
    }

    // Handle payment completion
    if (searchParams.get('payment') === 'completed') {
      toast.success('Payment completed successfully! Activating your Pro subscription...');
      setTimeout(() => {
        refreshSubscription();
      }, 1500);
    }
  }, [searchParams, refreshSubscription]);

  const handleAuthClick = () => {
    if (user) {
      navigate('/roadmaps');
    } else {
      navigate('/auth');
    }
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <CursorGlow />
      <AnimatedBackground />

      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <div className="pt-28 pb-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-start mb-10"
          >
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Home
            </Button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 max-w-2xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] mb-6">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-slate-300 font-mono">Choose Your Plan</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4 font-display">
              Simple Pricing
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto leading-relaxed mb-8">
              Start free and upgrade when you're ready. Pro plan at just ₹79/month - less than ₹3 per day!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span>Cancel Anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-purple-500" />
                <span>No Hidden Fees</span>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-20"
          >
            <SubscriptionCard />
          </motion.div>

          {/* Value Proposition */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 max-w-4xl mx-auto"
          >
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 sm:p-10 backdrop-blur-xl transition-all duration-300 text-left">
              <h2 className="text-xl font-bold text-white mb-4 font-display text-center">Why Just ₹79/month?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-6">
                <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-lg">
                  <h3 className="text-xs font-bold font-mono text-white mb-2 uppercase tracking-wide">Affordable Learning</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Less than a coffee per day for unlimited AI-powered roadmaps.</p>
                </div>
                <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-lg">
                  <h3 className="text-xs font-bold font-mono text-white mb-2 uppercase tracking-wide">For Everyone</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Quality, personalized education should be accessible to all students.</p>
                </div>
                <div className="p-5 bg-white/[0.01] border border-white/[0.06] rounded-lg">
                  <h3 className="text-xs font-bold font-mono text-white mb-2 uppercase tracking-wide">Premium Value</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Enterprise-grade generating capabilities at student-friendly pricing.</p>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm max-w-2xl mx-auto text-center">
                We believe everyone deserves access to personalized learning. 
                That's why we've priced our Pro plan to be incredibly accessible while still providing 
                cutting-edge technology and unlimited roadmap generation capabilities.
              </p>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-xl font-bold text-white mb-8 font-display">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 hover:bg-[#0B0B0F]/60 transition-all duration-150">
                <h3 className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wide">Can I cancel anytime?</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Yes, you can cancel your subscription at any time. You'll continue to have Pro access until the end of your billing cycle.</p>
              </div>
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 hover:bg-[#0B0B0F]/60 transition-all duration-150">
                <h3 className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wide">What payment methods do you accept?</h3>
                <p className="text-slate-500 text-xs leading-relaxed">We accept all major credit cards, debit cards, net banking, UPI, and digital wallets through Razorpay's secure SDK.</p>
              </div>
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 hover:bg-[#0B0B0F]/60 transition-all duration-150">
                <h3 className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wide">Why ₹79 per month?</h3>
                <p className="text-slate-500 text-xs leading-relaxed">We believe quality education should be affordable. At ₹79/month, the plan costs less than a single soft drink, making it extremely student-friendly.</p>
              </div>
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 hover:bg-[#0B0B0F]/60 transition-all duration-150">
                <h3 className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wide">How do I access support?</h3>
                <p className="text-slate-500 text-xs leading-relaxed">Pro users get priority email and live chat support with guaranteed response times under 24 hours. We are here to help you upskill.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
