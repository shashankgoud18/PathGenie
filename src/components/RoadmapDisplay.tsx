import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Download, Share, Bell, ChevronRight, Award, Compass, Zap, CheckCircle2, Star, Target, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { Confetti } from './ui/Confetti';
import RoadmapWeek from './roadmap/RoadmapWeek';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface RoadmapDisplayProps {
  roadmapData?: any;
  roadmapId?: string;
  onBack?: () => void;
}

const RoadmapDisplay: React.FC<RoadmapDisplayProps> = ({ roadmapData, roadmapId, onBack }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderTime, setReminderTime] = useState('18:00');
  const [reminderFreq, setReminderFreq] = useState('daily');
  const [reminderChannel, setReminderChannel] = useState('email');

  // Load completed tasks from localStorage
  useEffect(() => {
    if (roadmapId) {
      const savedProgress = localStorage.getItem(`pathgenie-roadmap-progress-${roadmapId}`);
      if (savedProgress) {
        try {
          const parsed = JSON.parse(savedProgress);
          if (Array.isArray(parsed)) {
            setCompletedTasks(new Set(parsed));
          }
        } catch (e) {
          console.error('Failed to parse saved progress', e);
        }
      }
    }
  }, [roadmapId]);

  // Early return if no roadmap data is provided
  if (!roadmapData) {
    return (
      <div className="text-center py-12">
        <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-xl">
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
        <div className="bg-[#0B0B0F]/60 backdrop-blur-xl border border-white/20 rounded-xl p-8 shadow-xl">
          <h3 className="text-white text-xl font-semibold mb-2">No Weeks Data</h3>
          <p className="text-gray-400">This roadmap doesn't contain any weekly content yet.</p>
        </div>
      </div>
    );
  }

  const toggleTask = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    let isChecking = false;

    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
      isChecking = true;
    }
    
    setCompletedTasks(newCompleted);
    
    if (roadmapId) {
      localStorage.setItem(`pathgenie-roadmap-progress-${roadmapId}`, JSON.stringify(Array.from(newCompleted)));
    }

    // Interactive week complete celebration check
    if (isChecking) {
      const currentWeekData = displayData.weeks.find(w => Number(w.week) === Number(selectedWeek));
      if (currentWeekData && currentWeekData.tasks) {
        const allCompleted = currentWeekData.tasks.every(t => t.id === taskId || newCompleted.has(t.id));
        if (allCompleted) {
          window.dispatchEvent(new CustomEvent('trigger-confetti'));
          toast.success(`🎉 Week ${selectedWeek} complete! Milestone unlocked.`);
        }
      }
    }
  };

  const handleExportToPDF = () => {
    const roadmapText = `
=============================================
${displayData.title}
=============================================
Duration: ${displayData.duration}
Time Commitment: ${displayData.totalHours} hours/week
Summary: ${displayData.summary || ''}

${displayData.weeks.map(week => `
---------------------------------------------
Week ${week.week}: ${week.title}
---------------------------------------------
Difficulty: ${week.difficulty}
Description: ${week.description}

Goals:
${week.goals?.map(goal => `• ${goal}`).join('\n') || 'N/A'}

Tasks:
${week.tasks?.map(task => `• [${completedTasks.has(task.id) ? 'X' : ' '}] ${task.title} (${task.duration}) - ${task.resource || 'Self study'}`).join('\n') || 'N/A'}

Checkpoint:
${week.checkpoint || 'N/A'}
`).join('\n')}
    `;

    const blob = new Blob([roadmapText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayData.title.toLowerCase().replace(/\s+/g, '-')}-checklist.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Roadmap outline exported successfully!');
  };

  const handleShareRoadmap = async () => {
    const shareText = `Check out this AI learning roadmap! ${displayData.duration} journey to master new skills.`;
    
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
    const shareText = `Explore my learning roadmap: ${window.location.href}`;
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('Workspace URL copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  const handleSaveReminders = () => {
    setIsReminderOpen(false);
    toast.success(`🔔 Learning notifications scheduled! We will notify you ${reminderFreq} at ${reminderTime} via ${reminderChannel}.`);
  };

  // Stats calculation
  const totalTasks = displayData.weeks.reduce((acc, week) => acc + (week.tasks?.length || 0), 0);
  const completedCount = completedTasks.size;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  // Find currently active week data to render in details panel
  const activeWeekData = displayData.weeks.find(w => Number(w.week) === Number(selectedWeek)) || displayData.weeks[0];

  return (
    <div className="space-y-6 select-none">
      <Confetti />
      
      {/* Workspace Performance Dashboard Stats card */}
      <div className="bg-[#0B0B0F]/45 border border-white/[0.04] rounded-xl p-5 sm:p-6 lg:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-purple-500/5 blur-[95px] -z-10 rounded-full" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 space-y-4 text-left">
            {displayData.summary && (
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-sans font-medium">
                {displayData.summary}
              </p>
            )}
            {displayData.motivationalTip && (
              <div className="bg-[#09090D]/50 border border-white/[0.04] rounded-lg p-3.5 max-w-2xl">
                <p className="text-purple-300 text-xs font-mono leading-relaxed flex items-start gap-2">
                  <span className="shrink-0 text-purple-400">💡</span>
                  <span>{displayData.motivationalTip}</span>
                </p>
              </div>
            )}
          </div>
          
          <div className="shrink-0 self-center md:self-auto">
            <div className="bg-[#050508] border border-white/[0.05] rounded-xl p-5 min-w-[240px] text-center shadow-lg relative overflow-hidden">
              <div className="text-4xl font-extrabold text-white font-mono tracking-tighter mb-1 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                {Math.round(progressPercentage)}%
              </div>
              <div className="text-slate-500 font-mono text-[9px] uppercase tracking-wider mb-3">Workspace Progress</div>
              <Progress value={progressPercentage} className="w-full bg-white/[0.02] h-1.5 rounded-full overflow-hidden" />
              <div className="text-[10px] text-slate-400 font-mono mt-3.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{completedCount} of {totalTasks} tasks complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Timeline sidebar + Active detail panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Timeline Panel */}
        <div className="lg:col-span-4 bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 shadow-2xl backdrop-blur-md relative overflow-hidden text-left space-y-4">
          <div className="flex items-center gap-2 border-b border-white/[0.04] pb-3.5">
            <Compass className="w-4 h-4 text-purple-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Mastery Timeline</h3>
          </div>
          
          <div className="relative pl-4 space-y-5">
            {/* SVG Connecting Timeline Line */}
            <div className="absolute top-2.5 bottom-2.5 left-6 w-0.5 bg-white/[0.02] -translate-x-1/2 z-0" />
            
            {displayData.weeks.map((weekItem) => {
              const isActive = selectedWeek === weekItem.week;
              const weekTasks = weekItem.tasks?.length || 0;
              const weekCompleted = (weekItem.tasks || []).filter((task: any) => completedTasks.has(task.id)).length;
              const isWeekDone = weekTasks > 0 && weekCompleted === weekTasks;
              const wProgress = weekTasks > 0 ? (weekCompleted / weekTasks) * 100 : 0;
              
              return (
                <div 
                  key={weekItem.week}
                  onClick={() => setSelectedWeek(weekItem.week)}
                  className={`relative z-10 flex items-start gap-4 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-purple-500/[0.03] border-purple-500/20 shadow-md shadow-purple-500/5' 
                      : 'border-transparent hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Status Indicator circle */}
                  <div className="relative shrink-0 flex items-center justify-center w-5.5 h-5.5 mt-0.5">
                    {isWeekDone ? (
                      <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-[9px] text-emerald-400 shadow-md shadow-emerald-500/10">
                        ✓
                      </div>
                    ) : isActive ? (
                      <div className="w-5.5 h-5.5 rounded-full bg-purple-600 border border-purple-400 text-white flex items-center justify-center text-[9px] font-bold font-mono shadow-md shadow-purple-500/20 animate-pulse">
                        {weekItem.week}
                      </div>
                    ) : (
                      <div className="w-5.5 h-5.5 rounded-full bg-[#050508] border border-white/[0.08] text-slate-500 flex items-center justify-center text-[9px] font-mono">
                        {weekItem.week}
                      </div>
                    )}
                  </div>
                  
                  {/* Title & Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-xs font-bold font-mono tracking-tight leading-none mb-1 ${
                      isActive ? 'text-purple-400' : 'text-slate-300'
                    }`}>
                      Week {weekItem.week}
                    </h4>
                    <p className={`text-xs font-semibold truncate ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}>
                      {weekItem.title}
                    </p>
                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 mt-2">
                      <span>{weekCompleted}/{weekTasks} tasks</span>
                      <span>{Math.round(wProgress)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Week Panel */}
        <div className="lg:col-span-8 bg-[#0B0B0F]/40 border border-white/[0.04] rounded-xl p-5 sm:p-7 shadow-2xl backdrop-blur-md text-left min-h-[500px] flex flex-col">
          <RoadmapWeek
            week={activeWeekData}
            completedTasks={completedTasks}
            onToggleTask={toggleTask}
            isOpen={true}
            onToggleWeek={() => {}}
            roadmapId={roadmapId}
            onCheckpointComplete={() => {
              // Mark all tasks in active week completed
              const newCompleted = new Set(completedTasks);
              activeWeekData.tasks?.forEach((task: any) => {
                newCompleted.add(task.id);
              });
              setCompletedTasks(newCompleted);
              if (roadmapId) {
                localStorage.setItem(`pathgenie-roadmap-progress-${roadmapId}`, JSON.stringify(Array.from(newCompleted)));
              }

              // Trigger confetti celebration!
              window.dispatchEvent(new CustomEvent('trigger-confetti'));
              toast.success(`🎉 Week ${selectedWeek} complete! Next milestone unlocked.`);

              // Auto advance week if not on last week
              if (selectedWeek < displayData.weeks.length) {
                setTimeout(() => {
                  setSelectedWeek(prev => prev + 1);
                }, 1000);
              }
            }}
          />
        </div>
      </div>

      {/* Global Workspace Control Buttons */}
      <div className="bg-[#0B0B0F]/45 border border-white/[0.04] rounded-xl p-6 shadow-2xl backdrop-blur-md text-center">
        <h3 className="text-base font-extrabold text-white mb-1.5 font-display">Workspace Tools</h3>
        <p className="text-slate-400 text-xs font-mono mb-5">
          Download your learning outline offline, share access URLs, or configure schedule reminders.
        </p>
        <div className="flex flex-wrap gap-3.5 justify-center">
          <Button 
            onClick={handleExportToPDF}
            className="bg-white hover:bg-slate-200 text-black font-semibold text-xs py-2 px-5 rounded-lg shadow-md transition-all hover:scale-[1.01]"
          >
            <Download className="w-3.5 h-3.5 mr-2 shrink-0" />
            Export Outline
          </Button>
          <Button 
            onClick={handleShareRoadmap}
            className="bg-[#09090D] border border-white/[0.06] hover:bg-[#121217] text-slate-300 hover:text-white font-semibold text-xs py-2 px-5 rounded-lg transition-all"
          >
            <Share className="w-3.5 h-3.5 mr-2 shrink-0" />
            Share Workspace
          </Button>
          <Button 
            onClick={() => setIsReminderOpen(true)}
            className="bg-[#09090D] border border-white/[0.06] hover:bg-[#121217] text-slate-300 hover:text-white font-semibold text-xs py-2 px-5 rounded-lg transition-all"
          >
            <Bell className="w-3.5 h-3.5 mr-2 shrink-0" />
            Schedule Reminders
          </Button>
        </div>
      </div>

      {/* Reminders Dialog Modal */}
      <Dialog open={isReminderOpen} onOpenChange={setIsReminderOpen}>
        <DialogContent className="bg-[#0B0B0F] border border-white/[0.06] text-white max-w-sm rounded-xl">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-bold font-display text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-purple-400" />
              Schedule Study Alerts
            </DialogTitle>
            <DialogDescription className="text-slate-400 text-xs font-mono leading-relaxed mt-1">
              Configure daily or weekly notifications to keep your learning progression active.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 text-left text-xs font-mono">
            {/* Frequency Selector */}
            <div className="space-y-2">
              <label className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Frequency</label>
              <select
                value={reminderFreq}
                onChange={(e) => setReminderFreq(e.target.value)}
                className="w-full bg-[#050508] border border-white/[0.08] text-white rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-purple-500/50"
              >
                <option value="daily">Daily reminders</option>
                <option value="weekday">Mon - Fri check-ins</option>
                <option value="weekly">Weekly digest</option>
              </select>
            </div>

            {/* Time commitments hour selector */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Time</label>
                <input
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-[#050508] border border-white/[0.08] text-white rounded-lg p-2 outline-none focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">Channel</label>
                <select
                  value={reminderChannel}
                  onChange={(e) => setReminderChannel(e.target.value)}
                  className="w-full bg-[#050508] border border-white/[0.08] text-white rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-purple-500/50"
                >
                  <option value="email">Email digest</option>
                  <option value="browser push">Browser alerts</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-row sm:justify-end gap-2.5 pt-2 border-t border-white/[0.04]">
            <Button
              variant="ghost"
              onClick={() => setIsReminderOpen(false)}
              className="text-slate-400 hover:text-white border border-white/[0.06] hover:bg-white/5 rounded-lg text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveReminders}
              className="bg-white hover:bg-slate-200 text-black font-semibold rounded-lg text-xs"
            >
              Configure Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RoadmapDisplay;
