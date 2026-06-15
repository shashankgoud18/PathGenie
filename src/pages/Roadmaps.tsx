import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { BookOpen, Zap, Target, Clock, TrendingUp, Search, List, LayoutGrid, Trash2, Play, Plus, Calendar, Sparkles } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');

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

  const handleDeleteRoadmap = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this learning path? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('roadmaps')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        toast.success('Learning path deleted successfully');
        setRoadmaps(roadmaps.filter(r => r.id !== id));
        localStorage.removeItem(`pathgenie-roadmap-progress-${id}`);
      } catch (err) {
        console.error('Error deleting roadmap:', err);
        toast.error('Failed to delete learning path');
      }
    }
  };

  // Utility to read progress from localStorage
  const getRoadmapProgress = (roadmap: any) => {
    const saved = localStorage.getItem(`pathgenie-roadmap-progress-${roadmap.id}`);
    if (!saved) return 0;
    try {
      const completedList = JSON.parse(saved);
      const tasks = roadmap.generated_data?.weeks?.reduce((acc: number, w: any) => acc + (w.tasks?.length || 0), 0) || 0;
      if (tasks === 0) return 0;
      return Math.round((completedList.length / tasks) * 100);
    } catch {
      return 0;
    }
  };

  const filteredRoadmaps = roadmaps.filter(roadmap =>
    roadmap.skill_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.end_goal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roadmap.current_level?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCommittedHours = roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.time_commitment || '10'), 0);
  const totalWeeks = roadmaps.reduce((acc, roadmap) => acc + parseInt(roadmap.timeline || '4'), 0);

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
                My Learning Workspace
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
        title="Workspace - PathGenie"
        description="Access and track your personal AI learning roadmap dashboard. Track your milestones and continue building your skills."
        keywords="my roadmaps, learning progress, skill tracking, personal dashboard, learning management"
        url="/roadmaps"
        noIndex={true}
      />
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      {/* Workspace Header */}
      <div className="relative pt-28 pb-8 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.04]">
            <div className="text-left space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-purple-500/5 text-purple-400 border border-purple-500/10 text-[10px] font-mono tracking-wider uppercase px-2.5 py-0.5 rounded">
                <Zap className="w-3 h-3 text-purple-400" />
                WORKSPACE DIRECTORY
              </div>
              <h1 className="text-3xl font-extrabold text-white font-display tracking-tight">
                Mastery Workspace
              </h1>
              <p className="text-xs text-slate-400 max-w-xl font-mono leading-relaxed">
                Review active learning trajectories, check milestone logs, and configure new AI paths.
              </p>
            </div>

            <Button 
              onClick={handleCreateNew}
              className="bg-white hover:bg-slate-200 text-black px-4 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01] shrink-0 shadow-lg shadow-white/5 flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Build Mastery Path
            </Button>
          </div>

          {/* Quick Metrics Bar */}
          {roadmaps.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-6 text-left">
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-purple-500/5 blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Paths</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">{roadmaps.length}</div>
              </div>
              
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-cyan-500/5 blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Milestones</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">{totalWeeks} weeks</div>
              </div>
              
              <div className="bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-4 shadow-xl backdrop-blur-md relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[80px] h-[80px] bg-emerald-500/5 blur-3xl -z-10 group-hover:scale-110 transition-transform" />
                <div className="flex items-center gap-2 text-slate-500 mb-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[10px] font-mono uppercase tracking-wider">Intensity</span>
                </div>
                <div className="text-lg font-bold text-white font-mono">{totalCommittedHours} hrs/wk</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        {roadmaps.length > 0 ? (
          <div className="space-y-6">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-[#0B0B0F]/20 p-3 border border-white/[0.03] rounded-xl backdrop-blur-md">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
                <Input
                  type="text"
                  placeholder="Filter paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                />
              </div>

              {/* Layout Switcher Tabs */}
              <div className="flex items-center bg-[#09090D] border border-white/[0.06] rounded-lg p-0.5 self-stretch sm:self-auto">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all ${
                    viewMode === 'timeline'
                      ? 'bg-white/[0.05] text-white font-bold border border-white/[0.08]'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono tracking-wide transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white/[0.05] text-white font-bold border border-white/[0.08]'
                      : 'text-slate-400 hover:text-white border border-transparent'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
              </div>
            </div>

            {/* List Content */}
            {filteredRoadmaps.length === 0 ? (
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-12 text-center backdrop-blur-xl max-w-lg mx-auto">
                <Search className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                <h3 className="text-base font-bold text-white mb-2 font-display">No roadmaps matched filter</h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  Try searching for another skill, or clear your query terms.
                </p>
                <Button 
                  onClick={() => setSearchTerm('')} 
                  className="bg-white hover:bg-slate-200 text-black px-5 py-2 text-xs font-semibold rounded-lg"
                >
                  Reset Filter
                </Button>
              </div>
            ) : viewMode === 'timeline' ? (
              /* Premium Workspace Journey Timeline Rows */
              <div className="space-y-4 text-left">
                {filteredRoadmaps.map((roadmap) => {
                  const progress = getRoadmapProgress(roadmap);
                  const weeksCount = parseInt(roadmap.timeline || '4');
                  
                  return (
                    <div
                      key={roadmap.id}
                      onClick={() => handleRoadmapClick(roadmap.id)}
                      className="group relative bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 hover:border-purple-500/20 hover:bg-[#0C0C12]/60 cursor-pointer shadow-xl backdrop-blur-md transition-all duration-300 overflow-hidden"
                    >
                      {/* Left vertical timeline glow indicator */}
                      <div className="absolute top-0 left-0 bottom-0 w-[3px] bg-gradient-to-b from-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                        {/* Info Column */}
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-white/[0.03] text-slate-300 border border-white/[0.08] px-2 py-0.5 rounded uppercase tracking-wider">
                              {roadmap.current_level}
                            </span>
                            <span className="text-[10px] font-mono text-slate-500">
                              {new Date(roadmap.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight font-display">
                            {roadmap.skill_name}
                          </h2>
                          {roadmap.end_goal && (
                            <p className="text-xs text-slate-400 truncate leading-relaxed max-w-xl font-sans">
                              🎯 Goal: {roadmap.end_goal}
                            </p>
                          )}
                        </div>

                        {/* Interactive Steps Mini Visual Progression */}
                        <div className="hidden md:flex flex-col items-center gap-2 max-w-xs w-full">
                          <div className="flex items-center justify-between w-full text-[10px] font-mono text-slate-500">
                            <span>Syllabus Progression</span>
                            <span className="text-white font-bold font-mono">{progress}%</span>
                          </div>
                          
                          {/* Mini interactive nodes connector */}
                          <div className="flex items-center justify-between w-full relative pt-2 pb-1.5 px-2">
                            {/* Connector line */}
                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/[0.04] -translate-y-1/2 z-0" />
                            <div 
                              className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />

                            {[...Array(weeksCount)].map((_, idx) => {
                              const weekNum = idx + 1;
                              const nodePercent = (idx / (weeksCount - 1)) * 100;
                              const isNodePassed = progress >= nodePercent;
                              
                              return (
                                <div 
                                  key={weekNum} 
                                  className={`relative z-10 w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[7px] font-bold font-mono transition-all ${
                                    isNodePassed 
                                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' 
                                      : 'bg-[#050507] border-white/[0.08] text-slate-500'
                                  }`}
                                  title={`Week ${weekNum}`}
                                >
                                  {weekNum}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 border-t border-white/[0.04] lg:border-none pt-4 lg:pt-0">
                          <div className="flex flex-col items-start lg:items-end text-xs font-mono text-slate-500 flex-1 lg:flex-none">
                            <span className="text-white font-bold">{roadmap.time_commitment} hrs/wk</span>
                            <span>{weeksCount} weeks total</span>
                          </div>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                            className="text-slate-500 hover:text-red-400 hover:bg-red-500/5 p-2 rounded-lg transition-colors border border-transparent hover:border-red-500/10 ml-auto lg:ml-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>

                          <button
                            className="bg-white/5 hover:bg-white text-slate-300 hover:text-black border border-white/[0.08] group-hover:border-white p-2.5 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center shrink-0 group-hover:scale-[1.03]"
                            title="Resume Learning trajectory"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Grid view */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRoadmaps.map((roadmap) => (
                  <div key={roadmap.id} className="relative group text-left">
                    <button
                      onClick={(e) => handleDeleteRoadmap(roadmap.id, e)}
                      className="absolute top-4 right-4 z-20 p-2 bg-[#09090D]/80 border border-white/[0.08] hover:border-red-500/20 text-slate-500 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    
                    <RoadmapCard
                      roadmap={roadmap}
                      onClick={() => handleRoadmapClick(roadmap.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Developer CLI Terminal Mockup Empty State */
          <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-2xl p-6 sm:p-10 text-left max-w-2xl mx-auto shadow-2xl backdrop-blur-xl overflow-hidden relative group">
            {/* Header border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-cyan-500" />
            
            {/* Window control dots */}
            <div className="flex items-center gap-1.5 mb-6 border-b border-white/[0.04] pb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/30 border border-red-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/30 border border-yellow-500/40" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/30 border border-green-500/40" />
              <span className="text-[10px] font-mono text-slate-500 ml-2">bash - pathgenie.sh</span>
            </div>

            {/* Terminal Body */}
            <div className="font-mono text-xs sm:text-sm space-y-4 mb-8 text-slate-300">
              <div className="flex items-center gap-2">
                <span className="text-purple-400">~</span>
                <span>npx pathgenie generate --skill</span>
                <span className="bg-slate-400 text-transparent animate-subtle-pulse select-none">|</span>
              </div>
              
              <div className="text-slate-500 leading-normal pl-4 border-l border-white/[0.04] py-1 space-y-1">
                <p># PathGenie Compiler v1.2.0 initialized.</p>
                <p># No active trajectories found in local DB workspace.</p>
                <p># Run command with --skill parameter to compile custom goals.</p>
              </div>

              <div className="flex items-center gap-2 text-cyan-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Select from 2 to 12 weeks of learning intensity.</span>
              </div>
            </div>

            <Button 
              onClick={handleCreateNew}
              className="w-full bg-white hover:bg-slate-200 text-black py-4.5 rounded-lg text-xs font-extrabold transition-all hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
              Compile Your First Roadmap
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Roadmaps;
