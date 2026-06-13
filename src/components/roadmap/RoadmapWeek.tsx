import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Target, CheckCircle, BookOpen, Star } from 'lucide-react';
import RoadmapTask from './RoadmapTask';

interface RoadmapWeekProps {
  week: any;
  completedTasks: Set<string>;
  onToggleTask: (taskId: string) => void;
  isOpen: boolean;
  onToggleWeek: (weekNumber: number) => void;
  roadmapId?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Beginner': return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30';
    case 'Intermediate': return 'bg-amber-500/20 text-amber-300 border-amber-400/30';
    case 'Advanced': return 'bg-red-500/20 text-red-300 border-red-400/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  }
};

const RoadmapWeek: React.FC<RoadmapWeekProps> = ({
  week,
  completedTasks,
  onToggleTask,
  isOpen,
  onToggleWeek,
  roadmapId
}) => {
  const weekTasks = week.tasks?.length || 0;
  const weekCompleted = week.tasks?.filter((task: any) => completedTasks.has(task.id)).length || 0;
  const weekProgress = weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0;

  return (
    <Card
      className="group bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:border-white/[0.08]"
    >
      <Collapsible open={isOpen} onOpenChange={() => onToggleWeek(week.week)}>
        <CollapsibleTrigger asChild>
          <CardHeader className="relative cursor-pointer hover:bg-white/[0.02] transition-all duration-300 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-white font-bold text-lg font-mono shrink-0 shadow-md">
                  {week.week}
                </div>
                <div className="flex-1 text-left">
                  <CardTitle className="text-base sm:text-lg font-bold text-white font-display">
                    Week {week.week}: {week.title}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs mt-1 leading-relaxed">
                    {week.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-row items-center gap-4 sm:gap-6 self-start sm:self-center">
                <Badge className={`${getDifficultyColor(week.difficulty)} border text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 rounded`}>
                  {week.difficulty}
                </Badge>
                <div className="text-right">
                  <div className="text-xs font-bold text-white font-mono mb-1">{Math.round(weekProgress)}%</div>
                  <Progress value={weekProgress} className="w-16 bg-white/[0.04] h-1.5 rounded-full" />
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0 space-y-5 p-4 sm:p-6">
            {week.goals && week.goals.length > 0 && (
              <div className="p-4 sm:p-5 bg-white/[0.01] border border-white/[0.06] rounded-lg">
                <h4 className="font-semibold text-xs font-mono mb-3 flex items-center gap-2 text-slate-300 uppercase tracking-wider">
                  <Target className="w-3.5 h-3.5 text-purple-400" />
                  Week Goals
                </h4>
                <ul className="space-y-2">
                  {week.goals.map((goal: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs leading-relaxed">
                      <CheckCircle className="w-3.5 h-3.5 text-purple-400/80 shrink-0 mt-0.5" />
                      <span>{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {week.tasks && week.tasks.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-xs font-mono flex items-center gap-2 text-slate-300 uppercase tracking-wider mb-2">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  Learning Tasks
                </h4>
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
            )}

            {week.checkpoint && (
              <div className="p-4 sm:p-5 bg-white/[0.01] border border-white/[0.06] rounded-lg">
                <h4 className="font-semibold text-xs font-mono mb-3 flex items-center gap-2 text-slate-300 uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 text-purple-400" />
                  Week Checkpoint
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">{week.checkpoint}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default RoadmapWeek;
