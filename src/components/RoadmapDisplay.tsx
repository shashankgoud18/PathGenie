
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Download, Share, Bell } from 'lucide-react';
import { toast } from 'sonner';
import RoadmapWeek from './roadmap/RoadmapWeek';

interface RoadmapDisplayProps {
  roadmapData?: any;
  roadmapId?: string;
  onBack?: () => void;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ roadmapData, roadmapId, onBack }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [openWeeks, setOpenWeeks] = useState<Set<number>>(new Set([1]));
  // Early return if no roadmap data is provided
  if (!roadmapData) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-xl">
          <h3 className="text-white text-xl font-semibold mb-2">No Roadmap Data</h3>
          <p className="text-gray-400">Unable to load roadmap content. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const displayData = roadmapData;

  // Handle missing weeks data
  if (!displayData.weeks || !Array.isArray(displayData.weeks) || displayData.weeks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-xl">
          <h3 className="text-white text-xl font-semibold mb-2">No Weeks Data</h3>
          <p className="text-gray-400">This roadmap doesn't contain any weekly content yet.</p>
        </div>
      </div>
    );
  }

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  const toggleWeek = (weekNumber: number) => {
    const newOpenWeeks = new Set(openWeeks);
    if (newOpenWeeks.has(weekNumber)) {
      newOpenWeeks.delete(weekNumber);
    } else {
      newOpenWeeks.add(weekNumber);
    }
    setOpenWeeks(newOpenWeeks);
  };

  const handleExportToPDF = () => {
    const roadmapText = `
${displayData.title}
Duration: ${displayData.duration}
Time Commitment: ${displayData.totalHours} hours/week

${displayData.weeks.map(week => `
Week ${week.week}: ${week.title}
${week.description}
Difficulty: ${week.difficulty}

Goals:
${week.goals?.map(goal => `• ${goal}`).join('\n') || ''}

Tasks:
${week.tasks?.map(task => `• ${task.title} (${task.duration})`).join('\n') || ''}

Checkpoint: ${week.checkpoint || 'N/A'}
`).join('\n')}
    `;

    const blob = new Blob([roadmapText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roadmap.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Roadmap exported successfully!');
  };

  const handleShareRoadmap = async () => {
    const shareText = `Check out this learning roadmap! ${displayData.duration} journey to master new skills.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: displayData.title,
          text: shareText,
          url: window.location.href,
        });
        toast.success('Roadmap shared successfully!');
      } catch (error) {
        if (error.name !== 'AbortError') {
          fallbackShare();
        }
      }
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const shareText = `Check out this learning roadmap! ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Roadmap link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleGetReminders = () => {
    toast.success('Reminders feature coming soon! We\'ll notify you about your learning milestones.');
  };

  const totalTasks = displayData.weeks.reduce((acc, week) => acc + (week.tasks?.length || 0), 0);
  const completedCount = completedTasks.size;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
  return (
    <div className="space-y-6">
      {/* Progress Overview - Premium Dark Card */}
      <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-5 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-purple-500/5 blur-[85px] -z-10 rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex-1 space-y-4">
            {displayData.summary && (
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {displayData.summary}
              </p>
            )}
            {displayData.motivationalTip && (
              <div className="bg-white/[0.01] border border-white/[0.06] rounded-lg p-4 max-w-2xl">
                <p className="text-purple-300 text-xs font-mono leading-relaxed flex items-start gap-2">
                  <span className="shrink-0 text-purple-400">💡</span>
                  <span>{displayData.motivationalTip}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="shrink-0">
            <div className="bg-[#09090D] border border-white/[0.06] rounded-xl p-5 min-w-[220px] text-center shadow-lg">
              <div className="text-3xl font-bold text-white font-mono tracking-tight mb-1">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-slate-500 font-mono text-[10px] uppercase tracking-wider mb-3">Overall Progress</div>
              <Progress value={progressPercentage} className="w-full bg-white/[0.04] h-2 rounded-full" />
              <div className="text-[10px] text-slate-400 font-mono mt-3">
                {completedCount} of {totalTasks} tasks completed
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Roadmap */}
      <div className="space-y-6">
        {displayData.weeks?.map((week, index) => {
          const isOpen = openWeeks.has(week.week);
          return (
            <RoadmapWeek
              key={week.week}
              week={week}
              completedTasks={completedTasks}
              onToggleTask={toggleTask}
              isOpen={isOpen}
              onToggleWeek={toggleWeek}
              roadmapId={roadmapId}
            />
          );
        })}
      </div>

      {/* Action Buttons - Premium Minimalist Style */}
      <div className="mt-12 sm:mt-16">
        <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/[0.04] rounded-xl p-6 sm:p-8 shadow-2xl text-center">
          <h3 className="text-lg font-bold text-white mb-2 font-display">Export & Share Roadmap</h3>
          <p className="text-slate-500 text-xs font-mono mb-6 leading-relaxed">
            Download your customized checklist offline or share your progress metrics with others.
          </p>
          <div className="flex flex-wrap gap-3.5 justify-center">
            <Button 
              onClick={handleExportToPDF}
              className="bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2.5 px-6 rounded-lg shadow-md transition-all duration-200 hover:scale-[1.01]"
            >
              <Download className="w-3.5 h-3.5 mr-2 shrink-0" />
              Export to Text
            </Button>
            <Button 
              onClick={handleShareRoadmap}
              className="bg-[#09090D] border border-white/[0.06] hover:bg-[#121217] text-slate-300 hover:text-white font-semibold text-xs py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              <Share className="w-3.5 h-3.5 mr-2 shrink-0" />
              Share Link
            </Button>
            <Button 
              onClick={handleGetReminders}
              className="bg-[#09090D] border border-white/[0.06] hover:bg-[#121217] text-slate-300 hover:text-white font-semibold text-xs py-2.5 px-6 rounded-lg transition-all duration-200"
            >
              <Bell className="w-3.5 h-3.5 mr-2 shrink-0" />
              Notify Reminders
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDisplay;
