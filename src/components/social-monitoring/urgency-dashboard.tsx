// src/components/social-monitoring/urgency-dashboard.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Gauge, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface UrgencyData {
  overall: {
    avgUrgency: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  byTopic: Array<{
    topic: string;
    avgUrgency: number;
    count: number;
  }>;
  bySentiment: Array<{
    sentiment: string;
    avgUrgency: number;
    count: number;
  }>;
}

interface UrgencyDashboardProps {
  data: UrgencyData | null;
  isLoading: boolean;
}

export function UrgencyDashboard({ data, isLoading }: UrgencyDashboardProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading urgency data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-full">
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">No urgency data available</div>
        </CardContent>
      </Card>
    );
  }

  const avgUrgency = data.overall.avgUrgency || 0;

  // Color based on urgency level
  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 80) return '#EF4444'; // red
    if (urgency >= 61) return '#F97316'; // orange
    if (urgency >= 31) return '#FBBF24'; // yellow
    return '#10B981'; // green
  };

  const getUrgencyLabel = (urgency: number) => {
    if (urgency >= 80) return 'Critical';
    if (urgency >= 61) return 'High';
    if (urgency >= 31) return 'Medium';
    return 'Low';
  };

  // Pie chart data
  const distributionData = [
    { name: 'Critical (≥80)', value: data.overall.critical, color: '#EF4444' },
    { name: 'High (61-79)', value: data.overall.high, color: '#F97316' },
    { name: 'Medium (31-60)', value: data.overall.medium, color: '#FBBF24' },
    { name: 'Low (<31)', value: data.overall.low, color: '#10B981' }
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gauge Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Overall Urgency Level
          </CardTitle>
          <CardDescription>Average urgency across all posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={{
                background: `conic-gradient(${getUrgencyColor(avgUrgency)} ${avgUrgency}%, #e5e7eb ${avgUrgency}%)`
              }}
            >
              <div className="absolute w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                <div className="text-4xl font-bold" style={{ color: getUrgencyColor(avgUrgency) }}>
                  {avgUrgency.toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <div
                className="text-xl font-semibold"
                style={{ color: getUrgencyColor(avgUrgency) }}
              >
                {getUrgencyLabel(avgUrgency)}
              </div>
              <div className="text-sm text-gray-500 mt-1">Priority Level</div>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 text-red-600 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-xs font-medium">Critical</span>
              </div>
              <div className="text-2xl font-bold text-red-700">{data.overall.critical}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 text-orange-600 mb-1">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs font-medium">High</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">{data.overall.high}</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-600 mb-1">
                <Info className="h-4 w-4" />
                <span className="text-xs font-medium">Medium</span>
              </div>
              <div className="text-2xl font-bold text-yellow-700">{data.overall.medium}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 text-green-600 mb-1">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Low</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{data.overall.low}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Urgency Distribution</CardTitle>
          <CardDescription>Breakdown by priority level</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Topics by Urgency */}
      <Card>
        <CardHeader>
          <CardTitle>Top Topics by Urgency</CardTitle>
          <CardDescription>Most urgent topics requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.byTopic.slice(0, 5)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis type="category" dataKey="topic" width={120} style={{ fontSize: '11px' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow-lg">
                        <p className="font-semibold text-sm">{data.topic}</p>
                        <p className="text-sm">Urgency: {data.avgUrgency.toFixed(1)}/100</p>
                        <p className="text-sm text-gray-500">Posts: {data.count}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="avgUrgency"
                fill="#8884d8"
                radius={[0, 4, 4, 0]}
              >
                {data.byTopic.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getUrgencyColor(entry.avgUrgency)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
