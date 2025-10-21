// src/components/unified-monitoring/topic-chart.tsx
'use client';

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopicData {
  topic: string;
  count: number;
}

interface TopicChartProps {
  data: TopicData[];
  isLoading?: boolean;
}

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#f43f5e'];

export function TopicChart({ data, isLoading }: TopicChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  const chartData = data.map((item, index) => ({
    topic: item.topic.length > 20 ? item.topic.substring(0, 20) + '...' : item.topic,
    fullTopic: item.topic,
    count: item.count,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Top Topics</h3>
        <p className="text-sm text-gray-500">Most discussed topics across all posts</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="horizontal">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="topic"
            tick={{ fontSize: 11 }}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    <p className="font-semibold text-sm mb-1">{payload[0].payload.fullTopic}</p>
                    <p className="text-sm text-gray-600">Posts: {payload[0].value}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="count" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
