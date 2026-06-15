import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, Eye, EyeOff, Sparkles, ChevronRight, Compass } from 'lucide-react';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import RoadmapDisplay from '@/components/RoadmapDisplay';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ShareRoadmapButton from '@/components/ShareRoadmapButton';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const RoadmapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to landing page if user is not authenticated
    if (!user) {
      navigate('/');
      return;
    }
    
    if (id) {
      fetchRoadmap();
    }
  }, [id, user, navigate]);

  const fetchRoadmap = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      setRoadmap(data);
    } catch (error) {
      console.error('Error fetching roadmap:', error);
      toast.error('Failed to load roadmap');
      navigate('/roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  const handleRoadmapUpdate = (isPublic: boolean) => {
    if (roadmap) {
      setRoadmap({ ...roadmap, is_public: isPublic });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="pt-28 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <LoadingSpinner 
              size="lg" 
              text="Compiling learning path..." 
              className="min-h-[60vh]"
            />
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="pt-28 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-[#0B0B0F]/60 border border-white/[0.04] p-8 rounded-xl backdrop-blur-xl">
            <h3 className="text-sm font-bold text-white mb-2 font-display">Trajectory Not Found</h3>
            <p className="text-xs text-slate-500 mb-6 font-mono">The learning path requested does not exist or access credentials are invalid.</p>
            <Button 
              onClick={() => navigate('/roadmaps')} 
              className="bg-white hover:bg-slate-200 text-black px-5 py-2 text-xs font-semibold rounded-lg"
            >
              Return to Workspace
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && user.id === roadmap.user_id;

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
      case 'intermediate': return 'bg-amber-500/5 text-amber-400 border-amber-500/10';
      case 'advanced': return 'bg-rose-500/5 text-rose-400 border-rose-500/10';
      default: return 'bg-purple-500/5 text-purple-400 border-purple-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title={`${roadmap.skill_name} Journey - PathGenie`}
        description={`Master ${roadmap.skill_name} with your personalized learning journey, curated references, and progress logs.`}
        url={`/roadmap/${roadmap.id}`}
        noIndex={true}
      />
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Workspace Header */}
      <div className="relative pt-28 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto relative z-10 text-left">
          
          {/* Breadcrumb Navigation & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-white/[0.04]">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 select-none">
              <span onClick={() => navigate('/roadmaps')} className="hover:text-white cursor-pointer transition-colors">Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-slate-300 font-bold truncate max-w-[180px] sm:max-w-none">{roadmap.skill_name}</span>
            </div>
            
            {/* Actions Panel */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate('/roadmaps')}
                variant="ghost"
                className="border border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200 mr-auto sm:mr-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Workspace
              </Button>
              
              <div className="flex items-center gap-2">
                {roadmap.is_public && (
                  <span className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/25 text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Public
                  </span>
                )}
                {!roadmap.is_public && isOwner && (
                  <span className="bg-slate-500/5 text-slate-400 border border-white/[0.08] text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded flex items-center">
                    <EyeOff className="w-3.5 h-3.5 mr-1" />
                    Private
                  </span>
                )}
                {isOwner && (
                  <ShareRoadmapButton
                    roadmapId={roadmap.id}
                    isPublic={roadmap.is_public || false}
                    onUpdate={handleRoadmapUpdate}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Title and Outcome Target */}
          <div className="space-y-4 mb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono bg-purple-500/5 text-purple-400 border border-purple-500/10 px-2 py-0.5 rounded">
                <Sparkles className="w-3 h-3" />
                ACTIVE LEARNING PATH
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display leading-tight">
                {roadmap.skill_name}
              </h1>
            </div>

            {roadmap.end_goal && (
              <div className="flex items-start gap-2.5 bg-[#0B0B0F]/30 border border-white/[0.04] p-3 rounded-lg max-w-3xl">
                <Target className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-300 font-medium font-sans">
                  <span className="text-slate-500 font-mono text-[10px] block uppercase tracking-wider mb-0.5">Target Objective</span>
                  {roadmap.end_goal}
                </p>
              </div>
            )}
          </div>

          {/* Minimalist Horizontal Metrics Row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono select-none text-slate-400 pb-2">
            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-3 py-1">
              <Compass className="w-3.5 h-3.5 text-purple-400" />
              <span>Level:</span>
              <span className="text-white capitalize">{roadmap.current_level}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-3 py-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Intensity:</span>
              <span className="text-white">{roadmap.time_commitment}h/week</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-3 py-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Duration:</span>
              <span className="text-white">{roadmap.timeline || '4'} Weeks</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.06] rounded-full px-3 py-1">
              <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
              <span>Style:</span>
              <span className="text-white capitalize">{roadmap.learning_style?.split('_').join(' ') || 'Mixed'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-5xl mx-auto">
          <RoadmapDisplay 
            roadmapData={roadmap.generated_data} 
            roadmapId={roadmap.id}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RoadmapView;
