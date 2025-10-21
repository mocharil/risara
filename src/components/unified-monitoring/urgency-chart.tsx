// src/components/unified-monitoring/urgency-chart.tsx
'use client';

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AlertTriangle } from "lucide-react";
import { LoadingSpinner } from '@/components/ui/loading';

interface UrgencyChartProps {
  data: {
    high: number;
    medium: number;
    low: number;
  };
  isLoading?: boolean;
}

const COLORS = {
  high: '#ef4444',    // Red
  medium: '#f59e0b',  // Orange/Yellow
  low: '#10b981',     // Green
};

export function UrgencyChart({ data, isLoading }: UrgencyChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[250px] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 text-sm">Loading urgency distribution...</p>
        </div>
      </Card>
    );
  }

  const chartData = [
    { name: 'High', value: data.high, color: COLORS.high },
    { name: 'Medium', value: data.medium, color: COLORS.medium },
    { name: 'Low', value: data.low, color: COLORS.low },
  ].filter(item => item.value > 0);

  const total = data.high + data.medium + data.low;

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-600" />
        <div>
          <h3 className="text-lg font-semibold">Urgency Distribution</h3>
          <p className="text-sm text-gray-500">Posts categorized by urgency level</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Pie Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px'
                }}
                formatter={(value: number) => [`${value} posts`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend with Stats */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm font-medium text-gray-700">High</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{data.high}</div>
              <div className="text-xs text-gray-500">
                {total > 0 ? ((data.high / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm font-medium text-gray-700">Medium</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{data.medium}</div>
              <div className="text-xs text-gray-500">
                {total > 0 ? ((data.medium / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm font-medium text-gray-700">Low</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{data.low}</div>
              <div className="text-xs text-gray-500">
                {total > 0 ? ((data.low / total) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
