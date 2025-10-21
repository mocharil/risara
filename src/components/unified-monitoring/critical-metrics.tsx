// src/components/unified-monitoring/critical-metrics.tsx
'use client';

import { Card } from "@/components/ui/card";
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
      {/* Critical Issues */}
      <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-red-500 rounded-lg">
            <AlertOctagon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-red-600 bg-red-200 px-2 py-1 rounded-full">
            Urgent
          </span>
        </div>
        <div>
          <p className="text-sm text-red-700 mb-1">Critical Issues</p>
          <p className="text-3xl font-bold text-red-900">{highUrgencyCount}</p>
          <p className="text-xs text-red-600 mt-1">Urgency ≥ 80</p>
        </div>
      </Card>

      {/* High Risk (Urgent + Negative) */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-orange-500 rounded-lg">
            <TrendingDown className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-orange-600 bg-orange-200 px-2 py-1 rounded-full">
            High Risk
          </span>
        </div>
        <div>
          <p className="text-sm text-orange-700 mb-1">Urgent + Negative</p>
          <p className="text-3xl font-bold text-orange-900">{criticalNegativeCount}</p>
          <p className="text-xs text-orange-600 mt-1">Requires immediate action</p>
        </div>
      </Card>

      {/* Average Urgency */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-yellow-500 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-yellow-700 bg-yellow-200 px-2 py-1 rounded-full">
            {changePercentage}%
          </span>
        </div>
        <div>
          <p className="text-sm text-yellow-700 mb-1">Avg Urgency Level</p>
          <p className="text-3xl font-bold text-yellow-900">{avgUrgency}/100</p>
          <p className="text-xs text-yellow-600 mt-1">Overall urgency score</p>
        </div>
      </Card>

      {/* Most Critical Region */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-blue-500 rounded-lg">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="text-xs font-medium text-blue-600 bg-blue-200 px-2 py-1 rounded-full">
            Hotspot
          </span>
        </div>
        <div>
          <p className="text-sm text-blue-700 mb-1">Most Critical Region</p>
          <p className="text-xl font-bold text-blue-900 truncate">{mostCriticalRegion || 'N/A'}</p>
          <p className="text-xs text-blue-600 mt-1">{criticalTopicsCount} critical topics</p>
        </div>
      </Card>
    </div>
  );
}
