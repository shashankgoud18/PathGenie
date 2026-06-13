import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SkillGenerator from '@/components/SkillGenerator';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';
import SEO from '@/components/SEO';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Generate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect them to home/auth
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="Generate Roadmap - PathGenie"
        description="Configure and compile a new personalized AI roadmap tailored to your target goals, level, and time availability."
        keywords="generate roadmap, AI learning path, skill compiler, personalized learning, study schedule"
        url="/generate"
        noIndex={true}
      />
      <CursorGlow />
      <AnimatedBackground />
      
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />

      <div className="pt-28 pb-20 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="flex justify-start mb-6">
            <Button
              onClick={() => navigate('/roadmaps')}
              variant="ghost"
              size="sm"
              className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Skill Generator container */}
          <SkillGenerator />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Generate;
