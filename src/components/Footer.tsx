import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sparkles,
  Twitter,
  Linkedin,
  Github,
  MessageCircle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  const navigateToPage = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      href: 'https://twitter.com/pathgenie_ai',
      color: 'hover:text-blue-400',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      href: 'https://linkedin.com/company/pathgenie',
      color: 'hover:text-blue-500',
    },
    {
      name: 'GitHub',
      icon: Github,
      href: 'https://github.com/pathgenie',
      color: 'hover:text-gray-300',
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      href: 'https://discord.gg/pathgenie',
      color: 'hover:text-purple-400',
    },
  ];

  return (
    <footer className="bg-[#050507] border-t border-white/[0.04] text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        {/* CTA */}
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight font-display">
            Ready to Master Your Next Skill?
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
            Join thousands of learners already using AI-powered roadmaps to accelerate their growth.
          </p>
          <Button
            onClick={scrollToTop}
            size="lg"
            className="bg-white hover:bg-slate-200 text-black px-6 py-3 rounded-lg shadow-lg shadow-white/5 transition-all duration-200 font-semibold inline-flex items-center gap-2 hover:scale-[1.02]"
          >
            Generate Your Roadmap Now
            <ArrowRight className="ml-1 w-4 h-4 shrink-0" />
          </Button>
        </div>

        <div className="h-[1px] bg-white/[0.04] mb-16" />

        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5 mb-6">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/[0.08] shadow-md flex items-center justify-center shrink-0 bg-white/[0.02]">
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight font-display">
                PathGenie
              </h3>
            </div>
            <p className="text-slate-400 mb-6 text-sm leading-relaxed max-w-xs">
              AI-powered personalized learning roadmaps that turn scattered tutorials into 4-week mastery journeys.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2 bg-white/[0.02] rounded-lg border border-white/[0.06] text-slate-500 hover:text-white transition-all duration-200 hover:bg-white/[0.04] focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <social.icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-xs text-white tracking-wider uppercase mb-5 font-mono">Product</h4>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li><button onClick={() => navigateToPage('/roadmaps')} className="hover:text-white transition-colors duration-150 focus:outline-none">Features</button></li>
              <li><button onClick={() => navigateToPage('/pricing')} className="hover:text-white transition-colors duration-150 focus:outline-none">Pricing</button></li>
              <li><button onClick={() => navigateToPage('/community')} className="hover:text-white transition-colors duration-150 focus:outline-none">Community</button></li>
              <li><a href="#features" className="hover:text-white transition-colors duration-150 focus:outline-none">How it Works</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors duration-150 focus:outline-none">Success Stories</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-xs text-white tracking-wider uppercase mb-5 font-mono">Company</h4>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li><button onClick={() => navigateToPage('/about')} className="hover:text-white transition-colors duration-150 focus:outline-none">About Us</button></li>
              <li><button onClick={() => navigateToPage('/contact')} className="hover:text-white transition-colors duration-150 focus:outline-none">Contact</button></li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-semibold text-xs text-white tracking-wider uppercase mb-5 font-mono">Legal & Support</h4>
            <ul className="space-y-3.5 text-sm text-slate-500">
              <li><button onClick={() => navigateToPage('/privacy-policy')} className="hover:text-white transition-colors duration-150 focus:outline-none">Privacy Policy</button></li>
              <li><button onClick={() => navigateToPage('/terms-of-service')} className="hover:text-white transition-colors duration-150 focus:outline-none">Terms of Service</button></li>
              <li><button onClick={() => navigateToPage('/help')} className="hover:text-white transition-colors duration-150 focus:outline-none">Help Center</button></li>
              <li><button onClick={() => navigateToPage('/contact')} className="hover:text-white transition-colors duration-150 focus:outline-none">Support</button></li>
            </ul>
          </div>
        </div>



        {/* Bottom */}
        <div className="h-[1px] bg-white/[0.04] mb-8" />
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 text-slate-500 text-xs">
          <span>© 2026 PathGenie. All rights reserved. Built for learners worldwide.</span>
          <div className="flex gap-6">
            <button onClick={() => navigateToPage('/privacy-policy')} className="hover:text-slate-300 focus:outline-none transition-colors duration-150">Privacy</button>
            <button onClick={() => navigateToPage('/terms-of-service')} className="hover:text-slate-300 focus:outline-none transition-colors duration-150">Terms</button>
            <button onClick={() => navigateToPage('/contact')} className="hover:text-slate-300 focus:outline-none transition-colors duration-150">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
