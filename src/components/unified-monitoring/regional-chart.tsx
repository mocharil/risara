// src/components/unified-monitoring/regional-chart.tsx
'use client';

import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface RegionalData {
  region: string;
  count: number;
}

interface RegionalChartProps {
  data: RegionalData[];
  isLoading?: boolean;
}

export function RegionalChart({ data, isLoading }: RegionalChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  const totalPosts = data.reduce((sum, item) => sum + item.count, 0);
  const topRegions = data.slice(0, 6);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Regional Distribution</h3>
        <p className="text-sm text-gray-500">Posts by region</p>
      </div>

      <div className="space-y-3">
        {topRegions.map((item, index) => {
          const percentage = totalPosts > 0 ? (item.count / totalPosts) * 100 : 0;
          const colors = [
            'from-blue-400 to-blue-600',
            'from-purple-400 to-purple-600',
            'from-pink-400 to-pink-600',
            'from-orange-400 to-orange-600',
            'from-green-400 to-green-600',
            'from-teal-400 to-teal-600'
          ];

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{item.region}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{item.count}</span>
                  <span className="text-gray-400 text-xs">({percentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors[index]} transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {data.length > 6 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          +{data.length - 6} more regions
        </div>
      )}
    </Card>
  );
}
