
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, TrendingUp } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import { Link } from 'react-router-dom';

const UsageIndicator = () => {
  const { subscription, usage, isProUser } = useSubscription();

  if (isProUser) {
    return (
      <div className="flex items-center gap-2">
        <Crown className="w-4 h-4 text-amber-400" />
        <span className="text-[10px] font-mono text-amber-400 border border-amber-500/20 bg-amber-500/5 px-2 py-0.5 rounded uppercase tracking-wider">
          Pro · Unlimited
        </span>
      </div>
    );
  }

  // Free tier: 10 roadmap generations per month (server-side limit)
  const monthlyLimit = 10;
  const used = usage.gemini;
  const remaining = Math.max(monthlyLimit - used, 0);
  const usagePercent = Math.min((used / monthlyLimit) * 100, 100);

  const getProgressColor = () => {
    if (usagePercent < 60) return 'bg-cyan-400';
    if (usagePercent < 90) return 'bg-amber-400';
    return 'bg-red-400';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col gap-1 min-w-[140px]">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Roadmaps</span>
          <span className="text-[10px] font-mono text-slate-300 font-semibold">{remaining}/{monthlyLimit} left</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>
      {remaining === 0 && (
        <Link to="/pricing">
          <Badge variant="outline" className="text-amber-400 border-amber-500/30 text-[10px] font-mono hover:bg-amber-400/10 cursor-pointer transition-colors">
            <TrendingUp className="w-3 h-3 mr-1" />
            Upgrade
          </Badge>
        </Link>
      )}
    </div>
  );
};

export default UsageIndicator;
