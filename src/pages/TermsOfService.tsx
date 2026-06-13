import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Scale, FileText, AlertTriangle } from 'lucide-react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const TermsOfService = () => {
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
        title="Terms of Service - PathGenie"
        description="Read PathGenie's terms of service and user agreement. Understand your rights and responsibilities when using our AI-powered learning platform."
        keywords="terms of service, user agreement, terms and conditions, legal terms, platform rules"
        url="/terms-of-service"
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
              <div className="p-2.5 bg-blue-500/5 rounded-lg border border-blue-500/20">
                <Scale className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">Terms of Service</h1>
            </div>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              These terms govern your use of PathGenie's AI-powered learning platform and services.
            </p>
            <p className="text-[10px] text-slate-500 mt-4 font-mono">Last updated: June 16, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 sm:p-8 lg:p-12 shadow-2xl text-left">
            <div className="space-y-8 text-sm text-slate-400 leading-relaxed">
              
              <section>
                <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-display">
                  <FileText className="w-4.5 h-4.5 text-blue-400" />
                  Acceptance of Terms
                </h2>
                <div className="space-y-3">
                  <p>By accessing and using PathGenie ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
                  <p>These Terms of Service ("Terms") apply to all users of the Service, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Service Description</h2>
                <div className="space-y-3">
                  <p>PathGenie provides AI-powered personalized learning roadmaps and educational content. Our services include:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>AI-generated learning roadmaps tailored to your goals</li>
                    <li>Curated educational resources and materials</li>
                    <li>Progress tracking and learning analytics</li>
                    <li>Community features and content sharing</li>
                    <li>Premium subscription services</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">User Accounts</h2>
                <div className="space-y-3">
                  <p>To access certain features, you must register for an account. You agree to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Provide accurate, current, and complete information</li>
                    <li>Maintain the security of your password</li>
                    <li>Accept responsibility for all activities under your account</li>
                    <li>Notify us immediately of any unauthorized use</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Acceptable Use</h2>
                <div className="space-y-3">
                  <p>You may use our Service only for lawful purposes. You agree not to:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on others' intellectual property rights</li>
                    <li>Upload malicious content or code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use the Service for commercial purposes without permission</li>
                    <li>Share your account credentials with others</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Payment Terms</h2>
                <div className="space-y-3">
                  <p>For premium services:</p>
                  <ul className="list-disc pl-5 space-y-1 text-slate-500">
                    <li>Payments are processed securely through third-party providers</li>
                    <li>Subscriptions automatically renew unless cancelled</li>
                    <li>Refunds are subject to our refund policy</li>
                    <li>We reserve the right to change pricing with notice</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Intellectual Property</h2>
                <div className="space-y-3">
                  <p>The Service and its original content, features, and functionality are owned by PathGenie and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
                  <p>You retain rights to content you create, but grant us a license to use, modify, and display it in connection with the Service.</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2 font-display">
                  <AlertTriangle className="w-4.5 h-4.5 text-yellow-400" />
                  Limitation of Liability
                </h2>
                <div className="space-y-3">
                  <p>PathGenie provides the Service "as is" without any warranty. We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.</p>
                  <p>Our total liability shall not exceed the amount you paid for the Service in the twelve months preceding the claim.</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Changes to Terms</h2>
                <div className="space-y-3">
                  <p>We reserve the right to update these Terms at any time. We will notify users of any changes by posting the new Terms on this page and updating the "Last updated" date.</p>
                  <p>Your continued use of the Service after such changes constitutes acceptance of the new Terms.</p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-bold text-white mb-3 font-display">Contact Information</h2>
                <div>
                  <p>For questions about these Terms, please contact us at:</p>
                  <div className="mt-4 p-4 bg-blue-500/5 border border-blue-400/20 rounded-lg max-w-sm">
                    <p className="text-xs text-slate-300"><strong>Email:</strong> legal@pathgenie.com</p>
                    <p className="text-xs text-slate-300 mt-1"><strong>Address:</strong> PathGenie Legal Team</p>
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

export default TermsOfService;
