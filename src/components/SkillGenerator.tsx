import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Sparkles, User, Clock, Target, BookOpen, Zap, Crown } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';
import { useSubscription } from '@/hooks/useSubscription';
import SubscriptionButton from './SubscriptionButton';

const SkillGenerator = () => {
  const [skill, setSkill] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [timeCommitment, setTimeCommitment] = useState('10');
  const [learningStyle, setLearningStyle] = useState('');
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState('4');
  const { subscription, usage, refreshSubscription, isProUser } = useSubscription();

  const monthlyLimit = 1000;
  const canGenerateRoadmap = isProUser || usage.gemini < monthlyLimit;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!skill.trim()) {
      toast.error('Please enter a skill you want to learn');
      return;
    }

    if (!user) {
      toast.error('Please sign in to generate a roadmap');
      return;
    }

    if (!canGenerateRoadmap) {
      toast.error('Monthly roadmap limit reached. Upgrade to Pro for unlimited access!');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-roadmap', {
        body: { 
          skill: skill.trim(), 
          level, 
          timeCommitment, 
          learningStyle,
          goal: goal.trim(),
          timeline: parseInt(timeline)
        }
      });

      if (error) throw error;

      if (data?.success) {
        toast.success(data.fromCache ? 'Roadmap loaded from cache!' : 'Roadmap generated successfully!');
        refreshSubscription(); // Refresh usage after generation
        navigate(`/roadmap/${data.roadmapId}`);
      } else {
        throw new Error('Failed to generate roadmap');
      }
    } catch (error: any) {
      console.error('Error generating roadmap:', error);
      let errMsg = 'Failed to generate roadmap. Please try again.';
      
      if (error.context && typeof error.context.text === 'function') {
        try {
          const textBody = await error.context.text();
          try {
            const body = JSON.parse(textBody);
            if (body?.error) {
              errMsg = body.error;
            } else if (body?.message) {
              errMsg = body.message;
            }
          } catch {
            if (textBody && textBody.length < 250 && !textBody.includes('<html')) {
              errMsg = textBody;
            }
          }
        } catch (e) {
          console.error('Could not read error response context:', e);
        }
      } else if (error.message) {
        errMsg = error.message;
      }

      if (errMsg.includes('Monthly roadmap generation limit reached')) {
        toast.error('Monthly limit reached. Upgrade to Pro for unlimited roadmaps!');
      } else {
        toast.error(errMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-left">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-purple-500/5 blur-[90px] -z-10 rounded-full" />
      
      {/* Header */}
      <div className="mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 bg-white/[0.02] border border-white/[0.06] rounded-full px-3.5 py-1 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-slate-300 text-xs font-mono">Roadmap Compiler</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
          Configure Your Learning Path
        </h2>
        <p className="text-xs text-slate-500 mt-2 font-mono leading-relaxed">
          Specify your outcome metrics below to synthesize a tailored 4-week learning roadmap.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Skill */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Target Skill *
            </label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., React, Python, UI/UX Design"
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 placeholder-slate-600"
              required
            />
          </div>

          {/* Current Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Current Experience Level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <option value="Beginner" className="bg-[#0B0B0F] text-white">Beginner</option>
              <option value="Intermediate" className="bg-[#0B0B0F] text-white">Intermediate</option>
              <option value="Advanced" className="bg-[#0B0B0F] text-white">Advanced</option>
            </select>
          </div>

          {/* Time Commitment */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Weekly Commitment (Hours)
            </label>
            <select
              value={timeCommitment}
              onChange={(e) => setTimeCommitment(e.target.value)}
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <option value="5" className="bg-[#0B0B0F] text-white">5 hours / week</option>
              <option value="10" className="bg-[#0B0B0F] text-white">10 hours / week</option>
              <option value="15" className="bg-[#0B0B0F] text-white">15 hours / week</option>
              <option value="20" className="bg-[#0B0B0F] text-white">20 hours / week</option>
              <option value="25" className="bg-[#0B0B0F] text-white">25+ hours / week</option>
            </select>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              Timeline Duration
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <option value="2" className="bg-[#0B0B0F] text-white">2 weeks (Intensive)</option>
              <option value="4" className="bg-[#0B0B0F] text-white">4 weeks (Standard)</option>
              <option value="6" className="bg-[#0B0B0F] text-white">6 weeks (Comprehensive)</option>
              <option value="8" className="bg-[#0B0B0F] text-white">8 weeks (In-depth)</option>
              <option value="12" className="bg-[#0B0B0F] text-white">12 weeks (Mastery)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Style */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-slate-500" />
              Learning Format
            </label>
            <select
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <option value="" className="bg-[#0B0B0F] text-white">Select format preference</option>
              <option value="Visual" className="bg-[#0B0B0F] text-white">Visual (videos, diagrams)</option>
              <option value="Reading" className="bg-[#0B0B0F] text-white">Reading (docs, articles)</option>
              <option value="Hands-on" className="bg-[#0B0B0F] text-white">Hands-on (coding, projects)</option>
              <option value="Mixed" className="bg-[#0B0B0F] text-white">Mixed Approach</option>
            </select>
          </div>

          {/* Specific Goal */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-400 text-xs font-mono font-semibold uppercase tracking-wider">
              <Target className="w-3.5 h-3.5 text-slate-500" />
              Outcome Goal (Optional)
            </label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., Deploy a SaaS app, Get certified, Build a portfolio"
              className="w-full bg-[#09090D] border border-white/[0.06] text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 text-xs py-3.5 px-4 rounded-lg transition-all duration-200 placeholder-slate-600"
            />
          </div>
        </div>

        {/* Submit & Status Messages */}
        <div className="pt-4 text-center">
          <Button
            type="submit"
            disabled={isLoading || !user || !canGenerateRoadmap}
            className="w-full bg-white hover:bg-slate-200 text-black font-semibold text-xs py-5 rounded-lg shadow-lg hover:scale-[1.01] transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-black"></div>
                Compiling Roadmap...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
                Synthesize Learning Path
              </>
            )}
          </Button>

          {!user && (
            <p className="text-slate-500 text-[10px] font-mono mt-4">
              Please sign in to generate personalized roadmaps.
            </p>
          )}

          {user && !canGenerateRoadmap && (
            <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/10 rounded-lg max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider">Monthly Limit Reclaimed</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                You have reached the free roadmap compilation quota. Upgrade to Pro for unlimited roadmaps.
              </p>
              <div className="pt-1">
                <SubscriptionButton size="sm" className="w-full justify-center bg-none bg-[#09090D] border border-white/[0.06] text-slate-300 hover:text-white" />
              </div>
            </div>
          )}

          {user && isProUser && (
            <p className="text-amber-400/80 text-[10px] font-mono mt-4 flex items-center justify-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              Pro tier active: Unlimited roadmap generation enabled
            </p>
          )}

          {user && !isProUser && canGenerateRoadmap && (
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-white/[0.01] border border-white/[0.04] rounded-lg">
              <div className="text-left">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Free Tier: {monthlyLimit - usage.gemini} remaining this month
                </p>
              </div>
              <Link to="/pricing" className="text-purple-400 hover:text-purple-300 text-[10px] font-mono flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" />
                Unlock Unlimited with Pro
              </Link>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default SkillGenerator;
