// src/components/unified-monitoring/today-activity.tsx
'use client';

import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TodayActivityProps {
  hourlyData: Array<{ hour: number; count: number }>;
  topicData: Array<{ topic: string; count: number }>;
  totalToday: number;
  isLoading?: boolean;
}

export function TodayActivity({ hourlyData, topicData, totalToday, isLoading }: TodayActivityProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-gray-500">Loading activity...</div>
        </div>
      </Card>
    );
  }

  // Format hourly data for display
  const formattedHourly = hourlyData.map(item => ({
    hour: `${item.hour.toString().padStart(2, '0')}:00`,
    count: item.count
  }));

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Today Activity</h3>
        <p className="text-sm text-gray-500">
          Total posts today: <span className="font-semibold text-gray-900">{totalToday}</span>
        </p>
      </div>

      {/* Hourly Activity */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Posts by Hour</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={formattedHourly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="hour"
              tick={{ fontSize: 10 }}
              tickLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fontSize: 10 }}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Bar
              dataKey="count"
              fill="#f59e0b"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Topic Distribution */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Top Topics Today</h4>
        <div className="space-y-2">
          {topicData.slice(0, 5).map((item, index) => {
            const percentage = totalToday > 0 ? (item.count / totalToday) * 100 : 0;
            return (
              <div key={index} className="flex items-center gap-2">
                <div className="text-xs text-gray-600 w-32 truncate">
                  {item.topic}
                </div>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-xs font-medium text-gray-700 w-12 text-right">
                  {item.count}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {topicData.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No activity today yet
        </div>
      )}
    </Card>
  );
}
