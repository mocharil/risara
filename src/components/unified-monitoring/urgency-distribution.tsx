// src/components/unified-monitoring/urgency-distribution.tsx
'use client';

import { Card } from "@/components/ui/card";
import { AlertTriangle, AlertCircle, CheckCircle } from "lucide-react";
import { LoadingSpinner } from '@/components/ui/loading';

interface UrgencyDistributionProps {
  data: {
    high: number;
    medium: number;
    low: number;
  };
  isLoading?: boolean;
}

export function UrgencyDistribution({ data, isLoading }: UrgencyDistributionProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[200px] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 text-sm">Loading urgency levels...</p>
        </div>
      </Card>
    );
  }

  const total = data.high + data.medium + data.low;
  const highPercentage = total > 0 ? (data.high / total) * 100 : 0;
  const mediumPercentage = total > 0 ? (data.medium / total) * 100 : 0;
  const lowPercentage = total > 0 ? (data.low / total) * 100 : 0;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Urgency Levels</h3>
        <p className="text-sm text-gray-500">Distribution of post urgency</p>
      </div>

      <div className="space-y-4">
        {/* High Urgency */}
        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-900">High Urgency</span>
            </div>
            <span className="text-2xl font-bold text-red-600">{data.high}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-red-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-red-600 transition-all duration-500"
                style={{ width: `${highPercentage}%` }}
              />
            </div>
            <span className="text-sm text-red-700 font-medium">{highPercentage.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-red-700 mt-1">Urgency ≥ 80</p>
        </div>

        {/* Medium Urgency */}
        <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-900">Medium Urgency</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600">{data.medium}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-yellow-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-600 transition-all duration-500"
                style={{ width: `${mediumPercentage}%` }}
              />
            </div>
            <span className="text-sm text-yellow-700 font-medium">{mediumPercentage.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">Urgency 50-79</p>
        </div>

        {/* Low Urgency */}
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-semibold text-green-900">Low Urgency</span>
            </div>
            <span className="text-2xl font-bold text-green-600">{data.low}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-green-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${lowPercentage}%` }}
              />
            </div>
            <span className="text-sm text-green-700 font-medium">{lowPercentage.toFixed(1)}%</span>
          </div>
          <p className="text-xs text-green-700 mt-1">Urgency {'<'} 50</p>
        </div>
      </div>
    </Card>
  );
}
