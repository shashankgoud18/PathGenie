import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Target, Lightbulb, Award, Heart, Rocket, Check } from 'lucide-react';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const About = () => {
  const navigate = useNavigate();

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  const teamMembers = [
    {
      name: "Pardhu",
      role: "Founder & CEO",
      image: "/team/pardhu.jpg",
      description: "Passionate about democratizing education through AI"
    }
  ];

  const values = [
    {
      icon: Target,
      title: "Purpose-Driven Learning",
      description: "Every roadmap is designed with clear, achievable goals that matter to your career."
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Innovation",
      description: "We leverage cutting-edge AI to create personalized learning experiences."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Learning is better together. We build tools that connect learners worldwide."
    },
    {
      icon: Heart,
      title: "Accessible Education",
      description: "Quality education should be available to everyone, regardless of background."
    }
  ];

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="About Us - PathGenie"
        description="Learn about PathGenie's mission to democratize education through AI-powered personalized learning roadmaps. Meet our team and discover our story."
        keywords="about us, company story, team, mission, vision, AI education, learning platform"
        url="/about"
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
              <div className="p-2.5 bg-cyan-500/5 rounded-lg border border-cyan-400/20">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-display">About PathGenie</h1>
            </div>
            
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed font-normal">
              We're on a mission to transform how people learn by making personalized, 
              AI-powered education accessible to everyone, everywhere.
            </p>
          </div>

          {/* Mission Section */}
          <div className="mb-20">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="text-left">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2.5 font-display">
                    <Rocket className="w-6 h-6 text-purple-400" />
                    Our Mission
                  </h2>
                  <p className="text-slate-400 leading-relaxed text-sm mb-4">
                    Traditional learning is broken. Scattered tutorials, overwhelming courses, 
                    and one-size-fits-all approaches leave learners frustrated and goals unmet.
                  </p>
                  <p className="text-slate-400 leading-relaxed text-sm mb-4">
                    PathGenie changes that. We use AI to create personalized learning roadmaps 
                    that adapt to your goals, schedule, and learning style, turning months of 
                    confusion into 4 weeks of focused progress.
                  </p>
                  <p className="text-slate-400 leading-relaxed text-sm">
                    We believe everyone deserves a clear path to mastery, and we're building 
                    the future where learning is personal, efficient, and successful.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-purple-500/5 border border-purple-500/10 rounded-lg p-5 text-left">
                    <h3 className="text-xl font-bold text-purple-400 mb-1 font-mono">50,000+</h3>
                    <p className="text-xs text-slate-400">Learners using PathGenie</p>
                  </div>
                  <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-lg p-5 text-left">
                    <h3 className="text-xl font-bold text-cyan-400 mb-1 font-mono">100+</h3>
                    <p className="text-xs text-slate-400">Skills and domains covered</p>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-5 text-left">
                    <h3 className="text-xl font-bold text-emerald-400 mb-1 font-mono">98%</h3>
                    <p className="text-xs text-slate-400">Success rate in goal achievement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-10 font-display">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-6 shadow-xl hover:bg-[#0B0B0F]/80 transition-all duration-200 text-left">
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-purple-500/5 rounded-lg border border-purple-500/20 flex-shrink-0">
                      <value.icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white mb-2 font-display">{value.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold text-white text-center mb-10 font-display">Meet Our Team</h2>
            <div className="flex justify-center">
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 shadow-xl max-w-md w-full">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">P</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">Pardhu</h3>
                  <p className="text-purple-400 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">Founder & CEO</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Passionate about democratizing education through AI. Building PathGenie 
                    to make personalized learning accessible to everyone worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 sm:p-12 shadow-2xl text-left">
              <h2 className="text-2xl font-bold text-white mb-8 text-center font-display">Our Story</h2>
              <div className="space-y-6 text-sm text-slate-400 leading-relaxed">
                <p>
                  PathGenie was born from a simple frustration: learning new skills online 
                  was chaotic and overwhelming. Scattered YouTube tutorials, expensive courses 
                  that went nowhere, and no clear path to actual competency.
                </p>
                <p>
                  Our founder Pardhu experienced this firsthand while trying to master various 
                  technical skills. Despite having access to thousands of resources, the lack 
                  of structure and personalization made progress slow and frustrating.
                </p>
                <p>
                  That's when the idea struck: What if AI could create personalized learning 
                  roadmaps that adapt to each person's goals, experience level, and learning 
                  preferences? What if we could turn months of confusion into weeks of focused progress?
                </p>
                <p>
                  Today, PathGenie serves thousands of learners worldwide, helping them achieve 
                  their learning goals faster and more efficiently than ever before. We're just 
                  getting started on our mission to democratize personalized education.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 blur-[80px] -z-10 rounded-full animate-aurora" />
              <h2 className="text-2xl font-bold text-white mb-4 font-display">Join Our Journey</h2>
              <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                Be part of the learning revolution. Start your personalized learning journey today.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-white hover:bg-slate-200 text-black px-6 py-3 text-xs font-bold rounded-lg hover:scale-[1.02]"
              >
                Start Learning Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
