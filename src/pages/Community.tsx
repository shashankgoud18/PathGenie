import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Users, Target, Clock, TrendingUp, Star, Search, ArrowLeft, Crown, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import RoadmapCard from '@/components/RoadmapCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import AnimatedBackground from '@/components/AnimatedBackground';
import CursorGlow from '@/components/CursorGlow';

const Community = () => {
  const { user } = useAuth();
  const { isProUser, loading: subscriptionLoading } = useSubscription();
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPublicRoadmaps();
  }, []);

  const fetchPublicRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error) {
      console.error('Error fetching public roadmaps:', error);
      toast.error('Failed to load community roadmaps');
    } finally {
      setLoading(false);
    }
  };

  const handleRoadmapClick = (roadmapId: string) => {
    navigate(`/roadmap/${roadmapId}`);
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

  if (loading || subscriptionLoading) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-400 mx-auto mb-4"></div>
            <div className="text-white text-sm font-mono">Loading community roadmaps...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show Pro upgrade prompt for free users
  if (!isProUser) {
    return (
      <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
        <CursorGlow />
        <AnimatedBackground />
        <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
        
        <div className="pt-28 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back button */}
            <div className="flex justify-start mb-8">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                Back to Home
              </Button>
            </div>

            {/* Pro upgrade section */}
            <div className="text-center">
              <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-purple-500/20 rounded-xl p-8 sm:p-12 shadow-2xl relative overflow-hidden text-left">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-500/10 blur-[80px] -z-10 rounded-full animate-aurora" />
                
                <div className="w-16 h-16 bg-purple-500/5 rounded-lg flex items-center justify-center mb-6 border border-purple-400/20">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                
                <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-white font-display">
                  Community Roadmaps
                </h1>
                
                <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-xl">
                  Browse and discover learning roadmaps shared by our Pro community members. 
                  Get inspired by others' learning journeys and find new paths to master your skills.
                </p>

                <div className="bg-[#050507]/60 border border-white/[0.04] rounded-lg p-6 mb-8 text-left max-w-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Crown className="w-4.5 h-4.5 text-purple-400" />
                    <h3 className="text-sm font-bold text-white font-display">Pro Feature</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                    Access to community roadmaps is available exclusively for Pro subscribers. 
                    Upgrade to Pro to unlock this feature and many more!
                  </p>
                  
                  <ul className="text-slate-300 space-y-2.5 text-xs font-mono">
                    <li className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>Browse roadmaps from other learners</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" />
                      <span>Share your own roadmaps with the community</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Unlimited AI-generated roadmaps</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => navigate('/pricing')}
                    className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01]"
                  >
                    Upgrade to Pro - ₹79/month
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/roadmaps')}
                    variant="ghost"
                    className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-6 py-2.5"
                  >
                    View My Roadmaps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050507] text-[#A1A1AA] selection:bg-purple-500/20 selection:text-purple-200 relative font-sans overflow-x-hidden">
      <CursorGlow />
      <AnimatedBackground />
      <Navbar onAuthClick={handleAuthClick} onScrollToSection={handleScrollToSection} />
      
      <div className="pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back button */}
          <div className="flex justify-start mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="border border-white/[0.08] text-white hover:bg-white/5 rounded-lg text-xs font-semibold px-4 py-2 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-2" />
              Back to Home
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-full px-4 py-1.5 mb-6">
              <Crown className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-300 text-xs font-mono">Pro Community</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white font-display">
              Community Roadmaps
            </h1>
            <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
              Discover and explore learning roadmaps shared by our Pro community. Get inspired by others' learning journeys and find new paths to master your skills.
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-10">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-500 w-3.5 h-3.5" />
                <Input
                  type="text"
                  placeholder="Search roadmaps by skill, goal, or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white/[0.01] border-white/[0.06] text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-4.5 rounded-lg"
                />
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto text-left">
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <Users className="w-5 h-5 text-purple-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">{roadmaps.length}</div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">Public Roadmaps</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <Star className="w-5 h-5 text-yellow-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">
                  {new Set(roadmaps.map(r => r.skill_name)).size}
                </div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">Unique Skills</div>
              </div>
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-5 shadow-xl">
                <TrendingUp className="w-5 h-5 text-emerald-400 mb-3" />
                <div className="text-xl font-bold text-white font-mono">
                  {filteredRoadmaps.length}
                </div>
                <div className="text-slate-500 text-xs font-mono mt-0.5">
                  {searchTerm ? 'Matching Results' : 'Total Roadmaps'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          {filteredRoadmaps.length === 0 ? (
            <div className="text-center py-10">
              <div className="bg-[#0B0B0F]/60 border border-white/[0.04] rounded-xl p-10 max-w-2xl mx-auto text-left">
                <div className="w-12 h-12 bg-purple-500/5 rounded-lg flex items-center justify-center mb-6 border border-purple-400/20">
                  <Users className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-display">
                  {searchTerm ? 'No matching roadmaps found' : 'No public roadmaps yet'}
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed max-w-md">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse all available roadmaps.'
                    : 'Be the first to share your learning journey with the community!'
                  }
                </p>
                
                {searchTerm ? (
                  <Button 
                    onClick={() => setSearchTerm('')}
                    className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01]"
                  >
                    Clear Search
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('/roadmaps')}
                    className="bg-white hover:bg-slate-200 text-black px-6 py-2.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.01]"
                  >
                    Create Your First Roadmap
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6 text-center">
                <p className="text-xs text-slate-500 font-mono">
                  Showing {filteredRoadmaps.length} of {roadmaps.length} community roadmaps
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
              </div>
              
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
                      showPublicBadge={true}
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
