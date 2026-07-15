import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Bookmark, Clock, Star, Github, BookOpen, Play, Code, Headphones, BarChart3, Award, TrendingUp, CheckCircle2 } from 'lucide-react';
import { LearningResource, UserResourceProgress } from '@/hooks/useResourceDiscovery';

interface ResourceCardProps {
  resource: LearningResource;
  userProgress?: UserResourceProgress;
  onStatusChange: (resourceId: string, status: UserResourceProgress['status']) => void;
  compact?: boolean;
}

const getResourceTypeIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'reading': return <BookOpen className="w-3.5 h-3.5" />;
    case 'video': return <Play className="w-3.5 h-3.5" />;
    case 'interactive': return <Code className="w-3.5 h-3.5" />;
    case 'audio': return <Headphones className="w-3.5 h-3.5" />;
    case 'visual': return <BarChart3 className="w-3.5 h-3.5" />;
    default: return <BookOpen className="w-3.5 h-3.5" />;
  }
};

const getResourceTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'reading': return 'bg-blue-500/5 border-blue-500/10 text-blue-400';
    case 'video': return 'bg-rose-500/5 border-rose-500/10 text-rose-400';
    case 'interactive': return 'bg-emerald-500/5 border-emerald-500/10 text-emerald-400';
    case 'audio': return 'bg-purple-500/5 border-purple-500/10 text-purple-400';
    case 'visual': return 'bg-amber-500/5 border-amber-500/10 text-amber-400';
    default: return 'bg-white/5 border-white/[0.06] text-slate-300';
  }
};

const getSourceIcon = (source: string) => {
  if (source?.toLowerCase().includes('github')) return <Github className="w-3.5 h-3.5 shrink-0" />;
  if (source?.toLowerCase().includes('youtube')) return <Play className="w-3.5 h-3.5 shrink-0" />;
  return null;
};

const getQualityStars = (score: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-2.5 h-2.5 ${
        i < score ? 'text-yellow-500 fill-yellow-500' : 'text-slate-600'
      }`}
    />
  ));
};

const getStatusColor = (status?: string) => {
  switch (status) {
    case 'completed': return 'bg-emerald-500/5 text-emerald-400 border-emerald-500/15';
    case 'in_progress': return 'bg-blue-500/5 text-blue-400 border-blue-500/15';
    case 'bookmarked': return 'bg-amber-500/5 text-amber-400 border-amber-500/15';
    default: return 'bg-purple-500/5 text-purple-400 border-purple-500/15';
  }
};

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  userProgress,
  onStatusChange,
  compact = false
}) => {
  const handleStatusChange = (status: UserResourceProgress['status']) => {
    onStatusChange(resource.id, status);
  };

  const typeColor = getResourceTypeColor(resource.resource_type);
  const isCompleted = userProgress?.status === 'completed';
  const isBookmarked = userProgress?.status === 'bookmarked';

  if (compact) {
    return (
      <div className="group flex items-center justify-between p-3 bg-[#050508]/40 border border-white/[0.04] hover:border-white/[0.08] hover:bg-[#09090D]/50 rounded-lg shadow-md transition-all select-none">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded-md border shrink-0 ${typeColor}`}>
            {getResourceTypeIcon(resource.resource_type)}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="font-bold text-white text-xs truncate font-display">{resource.title}</h4>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <div className="flex items-center">
                {getQualityStars(resource.quality_score)}
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-mono text-[9px]">
                <Clock className="w-3 h-3" />
                <span>{resource.estimated_time_minutes}m</span>
              </div>
              {resource.is_official && (
                <span className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 text-[8px] font-mono tracking-wider uppercase px-1.5 rounded flex items-center">
                  Official
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleStatusChange(isBookmarked ? 'planned' : 'bookmarked')}
            className={`p-1.5 hover:bg-white/5 h-8 w-8 rounded-md ${isBookmarked ? 'text-amber-400' : 'text-slate-500 hover:text-amber-400'}`}
          >
            <Bookmark className="w-3.5 h-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            asChild
            className="p-1.5 hover:bg-white/5 h-8 w-8 text-slate-500 hover:text-white rounded-md"
          >
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative p-4.5 border rounded-xl transition-all duration-300 hover:bg-[#09090D]/40 text-left select-none ${
      isCompleted 
        ? 'bg-emerald-500/[0.01] border-emerald-500/15' 
        : 'bg-[#050508]/40 border-white/[0.04] hover:border-white/[0.08]'
    }`}>
      {/* Header Info */}
      <div className="relative flex items-start justify-between gap-4 mb-3.5">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className={`p-2 rounded-md border shrink-0 ${typeColor}`}>
            {getResourceTypeIcon(resource.resource_type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-white mb-1.5 text-sm sm:text-base tracking-tight font-display">
              {resource.title}
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {getSourceIcon(resource.source)}
              <span className="text-[10px] font-mono text-slate-500">{resource.source}</span>
              {resource.is_official && (
                <Badge className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/20 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded">
                  Official
                </Badge>
              )}
            </div>
          </div>
        </div>
        {userProgress?.status && (
          <Badge className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getStatusColor(userProgress.status)}`}>
            {isCompleted && <CheckCircle2 className="w-3 h-3 mr-1" />}
            {userProgress.status.replace('_', ' ')}
          </Badge>
        )}
      </div>

      {/* Description text */}
      {resource.description && (
        <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium mb-4 pl-0.5">
          {resource.description}
        </p>
      )}

      {/* Bottom Actions Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.03] pt-4 mt-2">
        <div className="flex items-center gap-3.5 text-[10px] font-mono text-slate-500">
          <div className="flex items-center gap-1 select-none">
            {getQualityStars(resource.quality_score)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{resource.estimated_time_minutes}m</span>
          </div>
          {resource.difficulty_level && (
            <span className="uppercase tracking-wider">
              • {resource.difficulty_level}
            </span>
          )}
        </div>

        {/* Control Button Grid */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleStatusChange(isBookmarked ? 'planned' : 'bookmarked')}
            className={`text-[10px] font-mono px-3.5 py-1.5 h-8 rounded-lg border transition-all ${
              isBookmarked 
                ? 'bg-amber-500/5 text-amber-400 border-amber-500/15' 
                : 'bg-white/[0.01] text-slate-400 border-white/[0.06] hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 mr-1" />
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
          
          <Button
            size="sm"
            onClick={() => handleStatusChange(isCompleted ? 'planned' : 'completed')}
            className={`text-[10px] font-mono px-3.5 py-1.5 h-8 rounded-lg font-bold transition-all ${
              isCompleted
                ? 'bg-emerald-600 hover:bg-emerald-500 text-black'
                : 'bg-white/5 hover:bg-white text-slate-300 hover:text-black border border-white/[0.08]'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 shrink-0" />
                Done
              </>
            ) : (
              'Mark Done'
            )}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            asChild
            className="text-[10px] font-mono px-3 py-1.5 h-8 bg-white/[0.01] hover:bg-white/5 text-slate-400 hover:text-white border border-white/[0.06] rounded-lg"
          >
            <a href={resource.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3.5 h-3.5 mr-1" />
              Launch
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;
