import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Target, TrendingUp, Users, Sparkles, CheckCircle2 } from 'lucide-react';

interface RoadmapCardProps {
  roadmap: {
    id: string;
    skill_name: string;
    current_level: string;
    time_commitment: string;
    learning_style?: string;
    end_goal?: string;
    timeline?: string;
    created_at: string;
    generated_data?: any;
  };
  onClick: () => void;
  showPublicBadge?: boolean;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, onClick, showPublicBadge = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
      case 'intermediate': return 'bg-amber-500/5 text-amber-400 border-amber-500/10';
      case 'advanced': return 'bg-rose-500/5 text-rose-400 border-rose-500/10';
      default: return 'bg-purple-500/5 text-purple-400 border-purple-500/10';
    }
  };

  // Get progress directly from localStorage inside the card
  const progress = useMemo(() => {
    const saved = localStorage.getItem(`pathgenie-roadmap-progress-${roadmap.id}`);
    if (!saved) return 0;
    try {
      const completedList = JSON.parse(saved);
      const totalTasks = roadmap.generated_data?.weeks?.reduce((acc: number, w: any) => acc + (w.tasks?.length || 0), 0) || 0;
      if (totalTasks === 0) return 0;
      return Math.round((completedList.length / totalTasks) * 100);
    } catch {
      return 0;
    }
  }, [roadmap.id, roadmap.generated_data]);

  return (
    <Card 
      className="bg-[#0B0B0F]/40 hover:bg-[#0C0C12]/70 backdrop-blur-xl border border-white/[0.04] hover:border-purple-500/20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden relative text-left min-h-[260px] flex flex-col justify-between"
      onClick={onClick}
    >
      {/* Dynamic spot gradient hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-cyan-500/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative p-5 pb-3">
        <div className="flex items-center justify-between gap-4 mb-3.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge 
              variant="secondary" 
              className={`${getLevelColor(roadmap.current_level)} border font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded`}
            >
              {roadmap.current_level}
            </Badge>
            {showPublicBadge && (
              <Badge 
                variant="secondary" 
                className="bg-cyan-500/5 text-cyan-400 border-cyan-500/15 border font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded"
              >
                <Users className="w-2.5 h-2.5 mr-1" />
                Public
              </Badge>
            )}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {formatDate(roadmap.created_at)}
          </span>
        </div>
        
        <CardTitle className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors tracking-tight font-display mb-1.5 leading-snug line-clamp-2">
          {roadmap.skill_name}
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs leading-relaxed font-sans line-clamp-2 select-none">
          {roadmap.end_goal || 'General development roadmap and skill acquisition.'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative p-5 pt-0 mt-auto">
        <div className="space-y-4">
          {/* Progress Indicators */}
          {progress > 0 && (
            <div className="flex items-center gap-2.5 border-t border-white/[0.04] pt-4.5">
              <div className="flex-1">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 mb-1">
                  <span>Current Progress</span>
                  <span className="text-slate-300 font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-white/[0.02] border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              {progress === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border border-purple-500/20 flex items-center justify-center text-[7px] text-purple-400 font-mono shrink-0">
                  ⚡
                </div>
              )}
            </div>
          )}

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 gap-2 mt-2 border-t border-white/[0.03] pt-3">
            <div className="flex items-center gap-1.5 text-slate-400 p-2 bg-[#09090D]/50 border border-white/[0.03] rounded-lg">
              <Clock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
              <span className="text-[10px] font-mono text-slate-300 font-semibold">{roadmap.time_commitment}h/wk</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 p-2 bg-[#09090D]/50 border border-white/[0.03] rounded-lg">
              <Calendar className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
              <span className="text-[10px] font-mono text-slate-300 font-semibold">{roadmap.timeline || '4'} weeks</span>
            </div>
          </div>
          
          {/* Bottom tag */}
          <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-500" />
              AI Synthesized
            </span>
            <span className="capitalize">
              {roadmap.learning_style?.split('_').join(' ') || 'Mixed'} format
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoadmapCard;
