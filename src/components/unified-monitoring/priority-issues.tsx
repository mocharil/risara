// src/components/unified-monitoring/priority-issues.tsx
'use client';

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AlertCircle } from "lucide-react";
import { LoadingSpinner } from '@/components/ui/loading';

interface PriorityIssue {
  topic: string;
  count: number;
  urgency: number;
}

interface PriorityIssuesProps {
  data: PriorityIssue[];
  isLoading?: boolean;
}

export function PriorityIssues({ data, isLoading }: PriorityIssuesProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[350px] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 text-sm">Loading priority issues...</p>
        </div>
      </Card>
    );
  }

  const getUrgencyColor = (urgency: number) => {
    if (urgency > 70) return '#ef4444'; // High urgency (Red)
    if (urgency > 40) return '#f59e0b'; // Medium urgency (Yellow)
    return '#10b981'; // Low urgency (Green)
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-all duration-300 border border-gray-200">
      <div className="mb-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Priority Issues</h3>
          <p className="text-sm text-gray-500">Topics ranked by urgency level</p>
        </div>
      </div>

      <div className="relative h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            barSize={24}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke="#e5e7eb" />
            <XAxis
              dataKey="topic"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              fontSize={12}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: '500',
                fill: '#4b5563',
              }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#4b5563', fontWeight: '500' }}
              style={{ fontFamily: 'Inter, sans-serif' }}
            />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  const { topic, count, urgency } = payload[0].payload;
                  return (
                    <div className="p-3 bg-white border border-gray-300 rounded-lg shadow-md">
                      <p className="text-sm font-medium text-gray-800">{topic}</p>
                      <p className="text-sm text-gray-600">Count: <span className="font-semibold">{count}</span></p>
                      <p className="text-sm text-gray-600">Urgency Score: <span className="font-semibold">{urgency}</span></p>
                    </div>
                  );
                }
                return null;
              }}
              wrapperStyle={{
                outline: 'none',
              }}
            />
            <Bar dataKey="count">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getUrgencyColor(entry.urgency)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          High Urgency (&gt;70)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          Medium Urgency (40-70)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          Low Urgency (&lt;40)
        </div>
      </div>
    </Card>
  );
}
