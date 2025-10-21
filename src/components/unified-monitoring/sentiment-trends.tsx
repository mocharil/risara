// src/components/unified-monitoring/sentiment-trends.tsx
'use client';

import { Card } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SentimentTrendsProps {
  data: Array<{
    date: string;
    Positive: number;
    Negative: number;
    Neutral: number;
  }>;
  isLoading?: boolean;
}

export function SentimentTrends({ data, isLoading }: SentimentTrendsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">Loading chart...</div>
        </div>
      </Card>
    );
  }

  // Format date for display
  const formattedData = data.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('id-ID', {
      month: 'short',
      day: 'numeric'
    })
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Sentiment Trends</h3>
        <p className="text-sm text-gray-500">Sentiment distribution over time</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData}>
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorNeutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6b7280" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#6b7280" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px'
            }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="Positive"
            stroke="#10b981"
            fillOpacity={1}
            fill="url(#colorPositive)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="Neutral"
            stroke="#6b7280"
            fillOpacity={1}
            fill="url(#colorNeutral)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="Negative"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#colorNegative)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
