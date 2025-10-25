// src/components/unified-monitoring/critical-metrics.tsx
'use client';

import { StatsCard } from "@/components/dashboard/stats-card";
import { AlertTriangle, AlertOctagon, TrendingDown, MapPin } from "lucide-react";

interface CriticalMetricsProps {
  highUrgencyCount: number;
  criticalNegativeCount: number;
  avgUrgency: number;
  criticalTopicsCount: number;
  mostCriticalRegion: string;
  changePercentage: string;
}

export function CriticalMetrics({
  highUrgencyCount,
  criticalNegativeCount,
  avgUrgency,
  criticalTopicsCount,
  mostCriticalRegion,
  changePercentage
}: CriticalMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Critical Issues"
        value={highUrgencyCount.toString()}
        description="Urgency ≥ 80"
        icon={AlertOctagon}
        color="text-red-600"
        tooltip="Critical issues requiring immediate attention with urgency level of 80 or higher"
      />

      <StatsCard
        title="Urgent + Negative"
        value={criticalNegativeCount.toString()}
        description="Requires immediate action"
        icon={TrendingDown}
        color="text-orange-600"
        tooltip="High risk posts that are both urgent and have negative sentiment"
      />

      <StatsCard
        title="Avg Urgency Level"
        value={`${avgUrgency}/100`}
        description="Overall urgency score"
        icon={AlertTriangle}
        color="text-yellow-600"
        tooltip={`Average urgency level across all monitored content. Change: ${changePercentage}%`}
      />

      <StatsCard
        title="Most Critical Region"
        value={mostCriticalRegion || 'N/A'}
        description={`${criticalTopicsCount} critical topics`}
        icon={MapPin}
        color="text-blue-600"
        tooltip="Geographic region with the highest concentration of critical issues"
      />
    </div>
  );
}
