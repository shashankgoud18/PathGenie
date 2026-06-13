
import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Clock, Play, ExternalLink, CheckCircle2, Info, PlayCircle, BookOpen, Layers, Sparkles, Award, TrendingUp } from 'lucide-react';
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
  switch (type) {
    case 'video': return <PlayCircle className="w-4 h-4" />;
    case 'reading': return <BookOpen className="w-4 h-4" />;
    case 'practice': return <TrendingUp className="w-4 h-4" />;
    case 'project': return <Award className="w-4 h-4" />;
    default: return <Sparkles className="w-4 h-4" />;
  }
};

const getTaskTypeColor = (type: string) => {
  switch (type) {
    case 'video': return 'bg-red-500/10 border-red-400/30 text-red-300';
    case 'reading': return 'bg-blue-500/10 border-blue-400/30 text-blue-300';
    case 'practice': return 'bg-green-500/10 border-green-400/30 text-green-300';
    case 'project': return 'bg-purple-500/10 border-purple-400/30 text-purple-300';
    default: return 'bg-white/10 border-white/20 text-gray-300';
  }
};

const RoadmapTask: React.FC<RoadmapTaskProps> = ({ task, completed, onToggle, roadmapId }) => {
  const [showResources, setShowResources] = useState(false);
  
  const {
    resources,
    userProgress,
    loading: resourcesLoading,
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
      <div className={`group relative rounded-xl border transition-all duration-300 hover:border-white/[0.08] ${
        completed 
          ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/5' 
          : 'bg-[#0B0B0F]/40 border-white/[0.04] shadow-lg backdrop-blur-xl'
      }`}>
        
        {/* Task Header */}
        <div className="relative p-4 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Task Icon with animation */}
            <div className={`flex-shrink-0 p-2.5 rounded-lg border ${taskTypeColor} shadow-sm`}>
              {getTaskTypeIcon(task.type)}
            </div>
            
            <div className="flex-1 min-w-0 text-left">
              {/* Title and Checkbox */}
              <div className="flex items-start justify-between mb-3">
                <h3 className={`text-sm sm:text-base font-bold leading-snug ${
                  completed ? 'line-through text-slate-500' : 'text-white'
                }`}>
                  {task.title}
                </h3>
                
                <div className="flex items-center gap-2 shrink-0">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1.5 rounded-lg hover:bg-white/5 transition-colors">
                        <Info className="w-3.5 h-3.5 text-slate-500 hover:text-slate-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs bg-slate-900 border-white/[0.08] text-slate-300">
                      <p className="text-xs font-mono">This task builds essential skills for mastering {task.skill || 'this topic'}.</p>
                    </TooltipContent>
                  </Tooltip>
                  
                  <Checkbox
                    checked={completed}
                    onCheckedChange={() => onToggle(task.id)}
                    className="w-4 h-4 sm:w-4.5 sm:h-4.5 border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                  />
                </div>
              </div>
              
              {/* Metadata Row */}
              <div className="flex flex-wrap items-center gap-2.5 mb-3">
                <Badge variant="secondary" className="text-[10px] font-mono tracking-wider uppercase bg-white/[0.02] text-slate-300 border-white/[0.08]">
                  {task.type}
                </Badge>
                <div className="flex items-center gap-1 text-slate-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px] font-medium">{task.duration}</span>
                </div>
                {task.difficulty && (
                  <Badge variant="outline" className="text-[10px] font-mono tracking-wider uppercase bg-white/[0.01] text-slate-400 border-white/[0.06]">
                    {task.difficulty}
                  </Badge>
                )}
              </div>
              
              {/* Resource info */}
              <p className="text-xs text-slate-500 font-mono">{task.resource || 'Learning Resource'}</p>
            </div>
          </div>
        </div>

        {/* YouTube Video Section - Most Popular Video */}
        {hasYouTubeVideo && (
          <div className="mx-4 sm:mx-6 mb-5">
            <div className="group bg-[#09090D]/50 border border-white/[0.04] rounded-lg p-4 sm:p-5 shadow-lg transition-all duration-300">
              
              {/* Section Header */}
              <div className="relative flex items-center gap-2.5 mb-4">
                <div className="p-1.5 bg-red-500/10 rounded-lg border border-red-500/20">
                  <PlayCircle className="w-4 h-4 text-red-300" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white text-xs sm:text-sm">Recommended Video</h4>
                  <p className="text-[10px] text-slate-500 font-mono">Most popular tutorial for this task</p>
                </div>
                <Badge className="text-[9px] font-mono tracking-wider uppercase bg-yellow-500/5 text-yellow-400 border-yellow-500/10">
                  Popular
                </Badge>
              </div>
              
              {/* Video Content */}
              <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Thumbnail */}
                {task.youtubeThumbnail && (
                  <div className="lg:col-span-1">
                    <a
                      href={task.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-24 sm:h-28 rounded-lg overflow-hidden border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 shadow-sm group/thumb"
                    >
                      <img
                        src={task.youtubeThumbnail}
                        alt={`YouTube: ${task.title}`}
                        className="object-cover w-full h-full transform group-hover/thumb:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </a>
                  </div>
                )}
                
                {/* Video Details */}
                <div className="lg:col-span-2 text-left flex flex-col justify-between">
                  <div>
                    <h5 className="font-semibold text-white mb-2 text-xs sm:text-sm leading-snug">
                      {task.youtubeTitle || 'Tutorial Video'}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Watch this popular video to learn the concepts step by step.
                    </p>
                  </div>
                  <a
                    href={task.youtubeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit inline-flex items-center gap-2 px-3.5 py-2 bg-red-500/5 text-red-400 text-xs font-semibold rounded-lg hover:bg-red-500/10 transition-all duration-200 border border-red-500/10 hover:border-red-500/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Watch Video
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Learning Resources - Task Specific */}
        <div className="mx-4 sm:mx-6 mb-5">
          <Collapsible open={showResources} onOpenChange={setShowResources}>
            <CollapsibleTrigger asChild>
              <button className="w-full p-4 bg-[#09090D]/30 border border-white/[0.04] rounded-lg hover:bg-[#09090D]/50 transition-all duration-200 text-left group">
                <div className="flex items-center justify-between">
                  {/* Section Header */}
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                      <Layers className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white text-xs sm:text-sm">Additional Resources</h4>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {totalAlternativeResources > 0 
                          ? `${totalAlternativeResources} resource${totalAlternativeResources !== 1 ? 's' : ''} available`
                          : 'Generate learning materials'
                        }
                      </p>
                    </div>
                  </div>
                  
                  {/* Resource Type Indicators or Generate Button */}
                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    {totalAlternativeResources > 0 ? (
                      <>
                        <div className="hidden sm:flex items-center gap-2">
                          {Object.entries(typeCounts).slice(0, 3).map(([type, count]) => (
                            <Badge key={type} variant="secondary" className="text-[9px] font-mono tracking-wider uppercase bg-white/[0.02] text-slate-400 border-white/[0.08]">
                              {type}: {count}
                            </Badge>
                          ))}
                        </div>
                        <div className="sm:hidden">
                          <Badge variant="secondary" className="text-[9px] font-mono tracking-wider uppercase bg-white/[0.02] text-slate-400 border-white/[0.08]">
                            {totalAlternativeResources}
                          </Badge>
                        </div>
                        <div className={`w-4 h-4 transform transition-transform duration-200 ${showResources ? 'rotate-180' : ''}`}>
                          <svg className="w-full h-full text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </>
                    ) : (
                      <GenerateResourcesButton 
                        task={task}
                        roadmapId={roadmapId || ''}
                        onResourcesGenerated={handleResourcesGenerated}
                      />
                    )}
                  </div>
                </div>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {totalAlternativeResources > 0 ? (
                <div className="p-4 bg-[#09090D]/50 border border-white/[0.04] rounded-lg">
                  <ResourceFormatTabs
                    resources={resources}
                    userProgress={userProgress}
                    onStatusChange={updateResourceStatus}
                    typeCounts={typeCounts}
                  />
                </div>
              ) : (
                <div className="p-4 bg-[#09090D]/50 border border-white/[0.04] rounded-lg text-center">
                  <p className="text-slate-500 text-xs font-mono">Click "Generate Resources" to fetch learning materials specifically for this task.</p>
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Task Checkpoint */}
        {task.checkpoint && (
          <div className="mx-4 sm:mx-6 mb-5">
            <div className="group bg-[#09090D]/40 border border-white/[0.04] rounded-lg p-4 sm:p-5 shadow-lg transition-all duration-300">
              <div className="relative flex items-start gap-3">
                <div className="p-1.5 bg-green-500/10 rounded-lg border border-green-500/20 flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-green-300" />
                </div>
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-white text-xs sm:text-sm mb-1">Success Checkpoint</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{task.checkpoint}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};

export default RoadmapTask;
