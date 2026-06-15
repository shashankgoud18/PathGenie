import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Target, CheckCircle2, BookOpen, Star, Sparkles, Award } from 'lucide-react';
import RoadmapTask from './RoadmapTask';

interface RoadmapWeekProps {
  week: any;
  completedTasks: Set<string>;
  onToggleTask: (taskId: string) => void;
  isOpen: boolean;
  onToggleWeek: (weekNumber: number) => void;
  roadmapId?: string;
  onCheckpointComplete?: () => void;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10';
    case 'intermediate': return 'bg-amber-500/5 text-amber-400 border-amber-500/10';
    case 'advanced': return 'bg-rose-500/5 text-rose-400 border-rose-500/10';
    default: return 'bg-purple-500/5 text-purple-400 border-purple-500/10';
  }
};

const RoadmapWeek: React.FC<RoadmapWeekProps> = ({
  week,
  completedTasks,
  onToggleTask,
  roadmapId,
  onCheckpointComplete
}) => {
  if (!week) {
    return (
      <div className="text-center py-12 text-slate-500 font-mono text-xs">
        No milestone data available for this week.
      </div>
    );
  }

  const weekTasks = week.tasks?.length || 0;
  const weekCompleted = (week.tasks || []).filter((task: any) => completedTasks.has(task.id)).length;
  const weekProgress = weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0;
  const isWeekFinished = weekTasks > 0 && weekCompleted === weekTasks;

  return (
    <div className="space-y-6 text-left">
      {/* Week Title & Description Header */}
      <div className="space-y-3.5 pb-5 border-b border-white/[0.04]">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/5 border border-purple-500/15 flex items-center justify-center text-purple-400 font-bold text-sm font-mono shrink-0 shadow-md">
              W{week.week}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-display tracking-tight leading-tight">
                Week {week.week}: {week.title}
              </h2>
              <div className="flex items-center gap-2 mt-1 select-none">
                <Badge className={`${getDifficultyColor(week.difficulty)} border text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded`}>
                  {week.difficulty}
                </Badge>
                {week.estimatedHours && (
                  <span className="text-[10px] font-mono text-slate-500">
                    Est. {week.estimatedHours}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="text-xs font-bold text-white font-mono mb-1">{Math.round(weekProgress)}% Week Complete</div>
            <div className="w-24 bg-white/[0.02] border border-white/[0.04] h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-cyan-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${weekProgress}%` }}
              />
            </div>
          </div>
        </div>
        
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-sans font-medium">
          {week.description}
        </p>
      </div>

      {/* Week Goals / Target Outcomes */}
      {week.goals && week.goals.length > 0 && (
        <div className="p-4 sm:p-5 bg-[#09090D]/50 border border-white/[0.04] rounded-xl relative overflow-hidden shadow-md">
          <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-purple-500/[0.02] blur-2xl rounded-full" />
          <h4 className="font-bold text-[10px] font-mono mb-3.5 flex items-center gap-2 text-slate-300 uppercase tracking-wider">
            <Target className="w-3.5 h-3.5 text-purple-400" />
            Expected Outcomes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {week.goals.map((goal: string, idx: number) => (
              <div key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs leading-normal">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="font-sans font-medium text-slate-300">{goal}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Tasks Stack */}
      {week.tasks && week.tasks.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-bold text-[10px] font-mono flex items-center gap-2 text-slate-300 uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            Learning Checklist
          </h4>
          <div className="space-y-3">
            {week.tasks.map((task: any) => (
              <RoadmapTask
                key={task.id}
                task={task}
                completed={completedTasks.has(task.id)}
                onToggle={onToggleTask}
                roadmapId={roadmapId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Week Checkpoint & Verification Panel */}
      {week.checkpoint && (
        <div className="p-5 bg-[#0B0B0F]/50 border border-white/[0.04] rounded-xl relative overflow-hidden shadow-lg mt-6">
          <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-cyan-500/[0.02] blur-3xl -z-10 rounded-full" />
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-[10px] font-mono flex items-center gap-2 text-slate-300 uppercase tracking-wider">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                Milestone Verification
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed font-sans font-medium max-w-xl">
                {week.checkpoint}
              </p>
            </div>

            {onCheckpointComplete && (
              <div className="shrink-0 self-start sm:self-center">
                {isWeekFinished ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono border border-emerald-500/20 bg-emerald-500/5 px-4.5 py-2.5 rounded-lg select-none">
                    <CheckCircle2 className="w-4 h-4" />
                    Milestone Completed
                  </div>
                ) : (
                  <Button
                    onClick={onCheckpointComplete}
                    className="bg-white hover:bg-slate-200 text-black text-xs font-bold py-2.5 px-4.5 rounded-lg shadow-md transition-all hover:scale-[1.01] flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Approve & Advance
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapWeek;
