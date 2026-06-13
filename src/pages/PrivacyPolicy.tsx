import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="Privacy Policy - PathGenie"
        description="Learn how PathGenie collects, uses, and protects your personal information. Our commitment to user privacy and data security."
        keywords="privacy policy, data protection, user privacy, GDPR compliance, data security"
        url="/privacy-policy"
      />
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <div className="pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
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
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">Privacy Policy</h1>
            </div>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <p className="text-[10px] text-slate-500 mt-4 font-mono">Last updated: June 16, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 sm:p-8 lg:p-12 shadow-2xl text-left">
            <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
              
              <section>
                <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-display">
                  <FileText className="w-4.5 h-4.5 text-purple-400" />
                  Information We Collect
                </h2>
                <div className="space-y-3">
                  <p>We collect information you provide directly to us, such as when you:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Create an account or update your profile</li>
                    <li>Generate learning roadmaps</li>
                    <li>Subscribe to our services</li>
                    <li>Contact us for support</li>
                    <li>Participate in surveys or feedback</li>
                  </ul>
                  <p>This may include your name, email address, learning preferences, and usage patterns.</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">How We Use Your Information</h2>
                <div className="space-y-3">
                  <p>We use the information we collect to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Generate personalized learning roadmaps</li>
                    <li>Process payments and manage subscriptions</li>
                    <li>Send you updates, newsletters, and important notices</li>
                    <li>Respond to your comments and questions</li>
                    <li>Analyze usage patterns to enhance user experience</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Information Sharing</h2>
                <div className="space-y-3">
                  <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>With your explicit consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and prevent fraud</li>
                    <li>With trusted service providers who assist in our operations</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Data Security</h2>
                <div className="space-y-3">
                  <p>We implement appropriate security measures to protect your personal information, including:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and monitoring</li>
                    <li>Access controls and authentication requirements</li>
                    <li>Secure payment processing through trusted providers</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Your Rights</h2>
                <div className="space-y-3">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Access and update your personal information</li>
                    <li>Delete your account and associated data</li>
                    <li>Opt out of marketing communications</li>
                    <li>Request a copy of your data</li>
                    <li>Lodge a complaint with supervisory authorities</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Contact Us</h2>
                <div>
                  <p>If you have questions about this Privacy Policy, please contact us at:</p>
                  <div className="mt-4 p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg max-w-sm">
                    <p className="text-xs text-slate-300"><strong>Email:</strong> privacy@pathgenie.com</p>
                    <p className="text-xs text-slate-300 mt-1"><strong>Address:</strong> PathGenie Privacy Team</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
