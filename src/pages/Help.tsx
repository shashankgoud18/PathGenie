import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  Zap, 
  CreditCard,
  Settings,
  Users,
  ExternalLink,
  Check
} from 'lucide-react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const Help = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  const faqCategories = [
    {
      title: "Getting Started",
      icon: Zap,
      color: "text-emerald-400 bg-emerald-500/5 border-emerald-500/10",
      questions: [
        {
          q: "How do I create my first roadmap?",
          a: "Simply click 'Generate Your Roadmap' on the homepage, enter your learning goal, current experience level, and time commitment. Our AI will create a personalized 4-week learning path for you."
        },
        {
          q: "What makes PathGenie different from other learning platforms?",
          a: "PathGenie uses AI to create truly personalized roadmaps that adapt to your specific goals, experience level, and schedule. Instead of one-size-fits-all courses, you get a custom learning journey."
        },
        {
          q: "Do I need any prior experience to use PathGenie?",
          a: "Not at all! Our AI creates roadmaps for all experience levels, from complete beginners to advanced learners. Just specify your current level when creating a roadmap."
        }
      ]
    },
    {
      title: "Subscription & Billing",
      icon: CreditCard,
      color: "text-purple-400 bg-purple-500/5 border-purple-500/10",
      questions: [
        {
          q: "What's included in the Pro plan?",
          a: "Pro includes unlimited roadmaps, advanced AI features, priority support, exclusive content, progress analytics, and early access to new features."
        },
        {
          q: "Can I cancel my subscription anytime?",
          a: "Yes! You can cancel your subscription at any time from your account settings. You'll retain Pro features until the end of your billing period."
        },
        {
          q: "Do you offer refunds?",
          a: "We offer a 14-day money-back guarantee for new subscribers. If you're not satisfied, contact our support team for a full refund."
        }
      ]
    },
    {
      title: "Using the Platform",
      icon: Settings,
      color: "text-blue-400 bg-blue-500/5 border-blue-500/10",
      questions: [
        {
          q: "How accurate are the AI-generated roadmaps?",
          a: "Our AI is trained on curated educational content and industry best practices. Roadmaps are continuously improved based on user feedback and success rates."
        },
        {
          q: "Can I customize my roadmap?",
          a: "Yes! You can modify tasks, adjust timelines, add your own resources, and mark items as complete. The roadmap adapts to your progress."
        },
        {
          q: "How do I track my progress?",
          a: "Each task and week has completion tracking. You can mark items as done, view your overall progress, and see analytics in your dashboard."
        }
      ]
    },
    {
      title: "Community & Support",
      icon: Users,
      color: "text-cyan-400 bg-cyan-500/5 border-cyan-500/10",
      questions: [
        {
          q: "How do I get help if I'm stuck?",
          a: "You can contact our support team, join our Discord community, or browse the help center. Pro users get priority support response."
        },
        {
          q: "Can I share my roadmaps with others?",
          a: "Yes! You can make your roadmaps public and share them with the community. Others can use your roadmaps as inspiration for their learning journey."
        },
        {
          q: "Is there a mobile app?",
          a: "PathGenie is fully responsive and works perfectly on mobile browsers. A dedicated mobile app is coming soon!"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="Help Center - PathGenie"
        description="Find answers to common questions about PathGenie. Get help with creating roadmaps, managing subscriptions, and using our AI-powered learning platform."
        keywords="help center, FAQ, support, tutorial, how to use, troubleshooting"
        url="/help"
      />
      <CursorGlow />
      <AnimatedBackground />
      
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="mb-6 border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Home
            </Button>
            
            <div className="flex items-center justify-center gap-2.5 mb-6">
              <div className="p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/20">
                <HelpCircle className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">Help Center</h1>
            </div>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about using PathGenie to accelerate your learning journey.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 text-center hover:bg-[#0B0B0F]/80 transition-all duration-200 flex flex-col justify-between items-center">
              <div>
                <BookOpen className="w-6 h-6 text-purple-400 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-white mb-2 font-display">Getting Started Guide</h3>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed">Learn the basics and create your first roadmap</p>
              </div>
              <Button variant="ghost" className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2">
                Read Guide
              </Button>
            </div>
            
            <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 text-center hover:bg-[#0B0B0F]/80 transition-all duration-200 flex flex-col justify-between items-center">
              <div>
                <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-white mb-2 font-display">Contact Support</h3>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed">Get personal help from our team</p>
              </div>
              <Button 
                onClick={() => navigate('/contact')}
                variant="ghost"
                className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2"
              >
                Get Help
              </Button>
            </div>
            
            <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 text-center hover:bg-[#0B0B0F]/80 transition-all duration-200 flex flex-col justify-between items-center">
              <div>
                <Users className="w-6 h-6 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-sm font-bold text-white mb-2 font-display">Join Community</h3>
                <p className="text-slate-500 text-xs mb-6 leading-relaxed">Connect with other learners on Discord</p>
              </div>
              <Button variant="ghost" className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 flex items-center justify-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                Join Discord
              </Button>
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8 text-left">
            {faqCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-2 rounded-lg border ${category.color}`}>
                    <category.icon className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-white font-display">{category.title}</h2>
                </div>
                
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <div key={faqIndex} className="border-l border-purple-500/20 pl-4">
                      <h3 className="text-sm font-bold text-white mb-2">{faq.q}</h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-16 text-center">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 blur-[80px] -z-10 rounded-full animate-aurora" />
              <h2 className="text-2xl font-bold text-white mb-4 font-display">Still Need Help?</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Can't find what you're looking for? Our support team is here to help you succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <Button
                  onClick={() => navigate('/contact')}
                  className="w-full bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all"
                >
                  Contact Support
                </Button>
                <Button
                  variant="ghost"
                  className="w-full border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-6 py-2.5"
                >
                  Join Discord Community
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Help;
