import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, Mail, Clock, Send, Check } from 'lucide-react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const Contact = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="Contact Us - PathGenie"
        description="Get in touch with the PathGenie team. We're here to help with questions, support, feedback, and partnership opportunities."
        keywords="contact, support, help, customer service, feedback, partnership"
        url="/contact"
      />
      <CursorGlow />
      <AnimatedBackground />
      
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <div className="p-2.5 bg-green-500/5 rounded-lg border border-green-500/20">
                <MessageCircle className="w-6 h-6 text-green-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">Contact Us</h1>
            </div>
            
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Have a question, suggestion, or need help? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Contact Form */}
            <div className="lg:col-span-7 bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-left">
              <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2 font-display">
                <Send className="w-4 h-4 text-purple-400" />
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-400 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.01] border border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-semibold text-slate-400 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2.5 rounded-lg bg-white/[0.01] border border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.01] border border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 mb-2">
                    Subject
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-lg bg-[#0B0B0F] border border-white/[0.06] text-slate-300 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm transition-all">
                    <option value="" className="bg-[#0B0B0F]">Select a topic</option>
                    <option value="support" className="bg-[#0B0B0F]">Technical Support</option>
                    <option value="billing" className="bg-[#0B0B0F]">Billing & Payments</option>
                    <option value="feature" className="bg-[#0B0B0F]">Feature Request</option>
                    <option value="partnership" className="bg-[#0B0B0F]">Partnership</option>
                    <option value="feedback" className="bg-[#0B0B0F]">General Feedback</option>
                    <option value="other" className="bg-[#0B0B0F]">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-mono font-semibold text-slate-400 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg bg-white/[0.01] border border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-sm transition-all resize-none"
                    placeholder="Tell us how we can help you..."
                  ></textarea>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-white hover:bg-slate-200 text-black py-2.5 rounded-lg text-sm font-semibold transition-all hover:scale-[1.01]"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6 text-left">
              {/* Quick Contact */}
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-base font-bold text-white mb-6 font-display">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-blue-500/5 rounded-lg border border-blue-500/20 flex-shrink-0">
                      <Mail className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white mb-1">Email</h3>
                      <p className="text-sm text-slate-300">hello@pathgenie.com</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">We'll respond within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-green-500/5 rounded-lg border border-green-500/20 flex-shrink-0">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white mb-1">Live Chat</h3>
                      <p className="text-sm text-slate-300">Available 24/7 for premium users</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">Mon-Fri 9AM-6PM for free users</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/20 flex-shrink-0">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-white mb-1">Response Time</h3>
                      <p className="text-sm text-slate-300">Support: 2-4 hours</p>
                      <p className="text-sm text-slate-300">Sales: 1 hour</p>
                      <p className="text-sm text-slate-300">Partnerships: 1-2 business days</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
                <h2 className="text-base font-bold text-white mb-6 font-display">Quick Help</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-mono font-bold text-white mb-2 uppercase tracking-wide">Common Questions</h3>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li>• How do I create my first roadmap?</li>
                      <li>• What's included in the Pro plan?</li>
                      <li>• Can I cancel my subscription anytime?</li>
                      <li>• How accurate are the AI recommendations?</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4 border-t border-white/[0.04]">
                    <Button
                      onClick={() => navigate('/help')}
                      variant="ghost"
                      className="w-full border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2"
                    >
                      Visit Help Center
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
