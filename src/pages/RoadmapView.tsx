import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, Target, TrendingUp, Eye, EyeOff } from 'lucide-react';
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
              text="Loading your roadmap..." 
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
            <h3 className="text-sm font-bold text-white mb-2 font-display">Roadmap Not Found</h3>
            <p className="text-xs text-slate-500 mb-6">The roadmap you're looking for doesn't exist or you don't have permission to view it.</p>
            <Button 
              onClick={() => navigate('/roadmaps')} 
              className="bg-white hover:bg-slate-200 text-black px-5 py-2 text-xs font-semibold rounded-lg"
            >
              Back to Roadmaps
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
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Hero Section */}
      <div className="relative pt-28 pb-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10 text-left">
          {/* Back Button & Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Roadmaps
            </Button>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 items-center">
              {roadmap.is_public && (
                <span className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </span>
              )}
              {!roadmap.is_public && isOwner && (
                <span className="bg-slate-500/5 text-slate-400 border border-white/[0.08] text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded flex items-center">
                  <EyeOff className="w-3 h-3 mr-1" />
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

          {/* Title & Goal */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-white font-display">
              {roadmap.skill_name}
            </h1>
            {roadmap.end_goal && (
              <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                🎯 {roadmap.end_goal}
              </p>
            )}
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Target className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono">Level</span>
              </div>
              <Badge className={`${getLevelColor(roadmap.current_level)} text-xs font-mono uppercase tracking-wider`}>
                {roadmap.current_level}
              </Badge>
            </div>
            
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono">Per Week</span>
              </div>
              <span className="text-white text-lg font-bold font-mono">{roadmap.time_commitment}h</span>
            </div>
            
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono">Duration</span>
              </div>
              <span className="text-white text-lg font-bold font-mono">{roadmap.timeline || '4'} weeks</span>
            </div>
            
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-slate-500">
                <TrendingUp className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-mono">Style</span>
              </div>
              <span className="text-white text-sm font-semibold capitalize font-mono">
                {roadmap.learning_style?.split('_').join(' ') || 'Mixed'}
              </span>
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
