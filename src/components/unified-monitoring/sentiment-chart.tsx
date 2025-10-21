// src/components/unified-monitoring/sentiment-chart.tsx
'use client';

import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SentimentData {
  sentiment: string;
  count: number;
  percentage: number;
}

interface SentimentChartProps {
  data: SentimentData[];
  isLoading?: boolean;
}

const COLORS = {
  'Positive': '#10b981',
  'Negative': '#ef4444',
  'Neutral': '#6b7280'
};

export function SentimentChart({ data, isLoading }: SentimentChartProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  const chartData = data.map(item => ({
    name: item.sentiment,
    value: item.count,
    percentage: item.percentage.toFixed(1)
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sentiment Distribution</h3>
        <p className="text-sm text-gray-500">Overall sentiment across all posts</p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || '#94a3b8'} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px'
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend with counts */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {chartData.map((item) => (
          <div key={item.name} className="p-2 rounded-lg border">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
              />
              <span className="text-xs font-medium">{item.name}</span>
            </div>
            <div className="text-lg font-bold">{item.value}</div>
            <div className="text-xs text-gray-500">{item.percentage}%</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
