import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap, Target, Clock, TrendingUp, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import SEO from '@/components/SEO';
import RoadmapCard from '@/components/RoadmapCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoadmapCardSkeleton from '@/components/ui/RoadmapCardSkeleton';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const Roadmaps = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    fetchRoadmaps();
  }, [user]);

  const fetchRoadmaps = async () => {
    try {
      setError(null);
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      setError('Failed to load roadmaps. Please try again.');
      toast.error('Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapClick = (roadmapId: string) => {
    navigate(`/roadmap/${roadmapId}`);
  };

  const handleCreateNew = () => {
    navigate('/generate');
  };

  const handleAuthClick = () => {
    navigate('/auth');
  };

  const handleScrollToSection = (sectionId: string) => {
    navigate(`/#${sectionId}`);
  };

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.skill_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.end_goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.current_level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="pt-28 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white font-display">
                My Learning Roadmaps
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <RoadmapCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="pt-28 pb-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-8 text-center backdrop-blur-xl">
              <h3 className="text-sm font-bold text-white mb-2 font-display">Something went wrong</h3>
              <p className="text-xs text-slate-500 mb-6">{error}</p>
              <Button 
                onClick={fetchRoadmaps} 
                className="bg-white hover:bg-slate-200 text-black px-5 py-2 text-xs font-semibold rounded-lg"
              >
                Retry Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <SEO 
        title="My Learning Roadmaps - PathGenie"
        description="View and manage your personalized AI-generated learning roadmaps. Track your progress, access curated resources, and master new skills with PathGenie."
        keywords="my roadmaps, learning progress, skill tracking, personal dashboard, learning management"
        url="/roadmaps"
        noIndex={true}
      />
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Hero Section */}
      <div className="relative pt-28 pb-10 px-6 overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-300 text-xs font-mono">AI-Powered Workspace</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-display">
              My Learning Roadmaps
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Your personalized journey to mastery. Track progress, achieve goals, and unlock your potential with AI-guided learning paths.
            </p>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-10 max-w-3xl mx-auto text-left">
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <Target className="w-5 h-5 text-purple-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">{roadmaps.length}</div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">Active Roadmaps</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <TrendingUp className="w-5 h-5 text-emerald-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">
                  {roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.timeline || '4'), 0)}
                </div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">Total Weeks</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <Clock className="w-5 h-5 text-cyan-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">
                  {roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.time_commitment || '10'), 0)}h
                </div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">Weekly Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-5xl px-6 pb-20">
        {/* Search and Stats */}
        {roadmaps.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-4">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
                <Input
                  type="text"
                  placeholder="Search roadmaps..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                />
              </div>
              <div className="text-slate-500 text-xs font-mono">
                {filteredRoadmaps.length} {filteredRoadmaps.length === 1 ? 'roadmap' : 'roadmaps'} found
              </div>
            </div>
          </div>
        )}

        {roadmaps.length === 0 ? (
          <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-10 text-center max-w-2xl mx-auto backdrop-blur-xl">
            <BookOpen className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-2 font-display">Start Your Learning Journey</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Create your first AI-powered roadmap and transform the way you learn. Get personalized recommendations, structured timelines, and expert guidance.
            </p>
            <Button 
              onClick={handleCreateNew}
              className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01]"
            >
              Create Your First Roadmap
            </Button>
          </div>
        ) : filteredRoadmaps.length === 0 ? (
          <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-10 text-center max-w-2xl mx-auto backdrop-blur-xl">
            <Search className="w-10 h-10 text-purple-400 mx-auto mb-4" />
            <h3 className="text-base font-bold text-white mb-2 font-display">No roadmaps found</h3>
            <p className="text-xs text-slate-500 mb-6 max-w-sm mx-auto leading-relaxed">
              Try adjusting your search terms or create a new roadmap to get started.
            </p>
            <Button 
              onClick={handleCreateNew}
              className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01]"
            >
              Create New Roadmap
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoadmaps.map((roadmap, index) => (
              <div
                key={roadmap.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <RoadmapCard
                  roadmap={roadmap}
                  onClick={() => handleRoadmapClick(roadmap.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Roadmaps;
