import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Play, ExternalLink, Info, PlayCircle, BookOpen, Layers, Sparkles, Award, TrendingUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { useResourceDiscovery } from '@/hooks/useResourceDiscovery';
import ResourceFormatTabs from './ResourceFormatTabs';
import GenerateResourcesButton from './GenerateResourcesButton';

interface RoadmapTaskProps {
  task: any;
  completed: boolean;
  onToggle: (taskId: string) => void;
  roadmapId?: string;
}

const getTaskTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video': return <PlayCircle className="w-4 h-4" />;
    case 'reading': return <BookOpen className="w-4 h-4" />;
    case 'practice': return <TrendingUp className="w-4 h-4" />;
    case 'project': return <Award className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getTaskTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'video': return 'bg-rose-500/5 border-rose-500/10 text-rose-400';
    case 'reading': return 'bg-blue-500/5 border-blue-500/10 text-blue-400';
    case 'practice': return 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400';
    case 'project': return 'bg-purple-500/5 border-purple-500/10 text-purple-400';
    default: return 'bg-white/5 border-white/[0.06] text-slate-300';
  }
};

const RoadmapTask: React.FC<RoadmapTaskProps> = ({ task, completed, onToggle, roadmapId }) => {
  const [showResources, setShowResources] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const {
    resources,
    userProgress,
    updateResourceStatus,
    getResourceTypeCounts,
    refetch
  } = useResourceDiscovery(task.id, task.skill || 'general', roadmapId || '');

  const hasYouTubeVideo = task.youtubeLink && task.youtubeLink !== 'undefined';
  const typeCounts = getResourceTypeCounts();
  const totalAlternativeResources = resources.length;
  const taskTypeColor = getTaskTypeColor(task.type);

  const handleResourcesGenerated = () => {
    refetch();
  };

  return (
    <TooltipProvider>
      <div className={`group relative rounded-xl border transition-all duration-300 hover:bg-[#0C0C12]/40 ${
        completed 
          ? 'bg-emerald-500/[0.02] border-emerald-500/15 shadow-md shadow-emerald-500/[0.01]' 
          : 'bg-[#0B0B0F]/20 border-white/[0.04] hover:border-white/[0.08]'
      }`}>
        
        {/* Task Entry Row */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative p-4 sm:p-5 flex items-start gap-4 cursor-pointer select-none"
        >
          {/* Accent vertical line based on task status */}
          <div className={`absolute top-3 bottom-3 left-0 w-[3px] rounded-r-md transition-all ${
            completed ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-white/20'
          }`} />

          {/* Task Icon */}
          <div className={`flex-shrink-0 p-2 rounded-lg border ${taskTypeColor} shadow-sm transition-transform group-hover:scale-105`}>
            {getTaskTypeIcon(task.type)}
          </div>
          
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className={`text-sm sm:text-base font-bold leading-snug tracking-tight font-display transition-colors ${
                completed ? 'line-through text-slate-500' : 'text-white group-hover:text-purple-300'
              }`}>
                {task.title}
              </h3>
              
              <div 
                className="flex items-center gap-2.5 shrink-0"
                onClick={(e) => e.stopPropagation()} // Stop expansion trigger on checkbox/info click
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="p-1 rounded-md hover:bg-white/5 transition-colors">
                      <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-400" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="bg-[#0B0B0F] border border-white/[0.08] text-slate-300 text-[10px] font-mono p-2.5 max-w-[200px]">
                    This unit maps to key {task.skill || 'syllabus'} benchmarks. Click row to reveal study guides.
                  </TooltipContent>
                </Tooltip>
                
                <Checkbox
                  checked={completed}
                  onCheckedChange={() => onToggle(task.id)}
                  className="w-4.5 h-4.5 border-slate-600 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 data-[state=checked]:text-black"
                />
              </div>
            </div>
            
            {/* Metadata Badges Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-[9px] font-mono uppercase tracking-wider bg-white/[0.03] text-slate-400 border border-white/[0.06] px-1.5 py-0.5 rounded">
                {task.type}
              </span>
              <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.duration}</span>
              </div>
              {task.difficulty && (
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500">
                  • {task.difficulty}
                </span>
              )}
              {task.resource && (
                <span className="text-[10px] font-mono text-slate-500 truncate max-w-[150px] sm:max-w-none">
                  • {task.resource}
                </span>
              )}
            </div>
          </div>
          
          {/* Row expansion chevron */}
          <ChevronDown className={`w-4 h-4 text-slate-500 self-center shrink-0 ml-1 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 text-white' : ''
          }`} />
        </div>

        {/* Collapsible Details Panel */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent className="border-t border-white/[0.03] bg-[#050508]/30 px-4.5 sm:px-6 pb-5 pt-4 space-y-5">
            
            {/* YouTube Premium Video Recommendation Card */}
            {hasYouTubeVideo && (
              <div className="text-left space-y-2">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  <Play className="w-3 h-3 text-red-500" />
                  Recommended Reference Video
                </div>
                
                <div className="bg-[#050508]/60 border border-white/[0.04] rounded-xl p-4 shadow-lg hover:border-white/[0.08] transition-colors relative overflow-hidden flex flex-col md:flex-row gap-5 items-stretch">
                  <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-red-500/[0.02] blur-3xl rounded-full pointer-events-none" />
                  
                  {/* Visual Video Thumbnail Player Mockup */}
                  {task.youtubeThumbnail && (
                    <div className="md:w-1/3 shrink-0 relative rounded-lg overflow-hidden border border-white/[0.06] group/player bg-[#08080C] min-h-[110px] flex items-center justify-center">
                      <a 
                        href={task.youtubeLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="absolute inset-0 block w-full h-full"
                      >
                        <img
                          src={task.youtubeThumbnail}
                          alt={task.youtubeTitle}
                          className="object-cover w-full h-full transform group-hover/player:scale-103 transition-transform duration-500 opacity-80 group-hover/player:opacity-100"
                        />
                        {/* Play overlay ring */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover/player:bg-black/15 transition-all">
                          <div className="w-10 h-10 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover/player:scale-110 group-hover/player:bg-red-500 transition-all duration-300">
                            <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                          </div>
                        </div>
                      </a>
                    </div>
                  )}
                  
                  {/* YouTube Video Info */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                        {task.youtubeTitle || 'Video Tutorial'}
                      </h4>
                      <p className="text-xs text-slate-400 leading-normal line-clamp-2 font-medium">
                        Learn core paradigms and explore implementation patterns in this step-by-step developer tutorial.
                      </p>
                      
                      {/* Relevance Insight explanation */}
                      <p className="text-[10px] font-mono text-purple-300 leading-normal flex items-start gap-1">
                        <span className="text-purple-400">⚡</span>
                        <span>Relevance: This lecture focuses specifically on the topics outlined in "{task.title}", mapping details to your skill level.</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <span className="text-[9px] font-mono text-slate-500 bg-white/[0.02] border border-white/[0.06] px-2 py-0.5 rounded">
                        YouTube Resource
                      </span>
                      
                      <a
                        href={task.youtubeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold rounded-lg transition-all shadow-md shadow-red-600/10"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Launch Reference Video
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative learning resources */}
            <div className="text-left space-y-3">
              <div className="flex items-center justify-between gap-4 border-b border-white/[0.04] pb-2">
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-500 uppercase tracking-wider">
                  <Layers className="w-3 h-3" />
                  Alternative Trajectories
                </div>
                
                {totalAlternativeResources > 0 && (
                  <button
                    onClick={() => setShowResources(!showResources)}
                    className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    {showResources ? 'Hide materials' : `Show alternative resources (${totalAlternativeResources})`}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showResources ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>

              {totalAlternativeResources > 0 ? (
                showResources && (
                  <div className="animate-fade-in">
                    <ResourceFormatTabs
                      resources={resources}
                      userProgress={userProgress}
                      onStatusChange={updateResourceStatus}
                      typeCounts={typeCounts}
                    />
                  </div>
                )
              ) : (
                <div className="bg-[#050508]/30 border border-white/[0.04] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="text-left">
                    <p className="text-xs text-slate-400 font-semibold">Generate structured study references?</p>
                    <p className="text-[10px] font-mono text-slate-500 mt-0.5">We will compile reading documentation and codebase setups for this task.</p>
                  </div>
                  
                  <GenerateResourcesButton 
                    task={task}
                    roadmapId={roadmapId || ''}
                    onResourcesGenerated={handleResourcesGenerated}
                  />
                </div>
              )}
            </div>

            {/* Checkpoint success challenge */}
            {task.checkpoint && (
              <div className="text-left p-3.5 bg-emerald-500/[0.02] border border-emerald-500/10 rounded-lg">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="text-xs font-sans">
                    <span className="text-slate-500 font-mono text-[9px] block uppercase tracking-wider mb-0.5">Verification Criteria</span>
                    <span className="text-slate-300 font-medium">{task.checkpoint}</span>
                  </div>
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </TooltipProvider>
  );
};

export default RoadmapTask;
