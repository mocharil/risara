// src/components/social-monitoring/topic-matrix.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, ZAxis } from 'recharts';

export interface TopicBubble {
  topic: string;
  urgency: number;
  frequency: number;
  engagement: number;
  sentiment: string;
  quadrant: string;
  platforms: string[];
}

export interface TopicMatrixData {
  bubbles: TopicBubble[];
  stats: {
    totalTopics: number;
    avgUrgency: number;
    criticalTopics: number;
  };
  thresholds: {
    urgency: { high: number; medium: number };
    frequency: { high: number; medium: number };
  };
}

interface TopicMatrixProps {
  data: TopicMatrixData | null;
  isLoading: boolean;
}

export function TopicMatrix({ data, isLoading }: TopicMatrixProps) {
  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'critical': return '#EF4444'; // Red - High urgency + High frequency
      case 'monitor': return '#F97316'; // Orange - High urgency + Low frequency
      case 'trending': return '#FBBF24'; // Yellow - Low urgency + High frequency
      case 'routine': return '#10B981'; // Green - Low urgency + Low frequency
      default: return '#6B7280';
    }
  };

  const getQuadrantLabel = (quadrant: string) => {
    switch (quadrant) {
      case 'critical': return 'TOP PRIORITY';
      case 'monitor': return 'MONITOR';
      case 'trending': return 'TRENDING';
      case 'routine': return 'ROUTINE';
      default: return 'UNKNOWN';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading topic matrix...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.bubbles.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Topic Urgency Matrix
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">No topic data available</div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for scatter chart
  const chartData = data.bubbles.map(bubble => ({
    x: bubble.frequency,
    y: bubble.urgency,
    z: bubble.engagement * 0.5, // Scale for bubble size
    topic: bubble.topic,
    quadrant: bubble.quadrant,
    sentiment: bubble.sentiment,
    platforms: bubble.platforms.join(', ')
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Topic Urgency Matrix
            </CardTitle>
            <CardDescription>
              {data.stats.totalTopics} topics | {data.stats.criticalTopics} critical | Avg Urgency: {data.stats.avgUrgency.toFixed(1)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Info className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Quadrant Guide:</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span><strong>Critical:</strong> High urgency + High frequency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span><strong>Monitor:</strong> High urgency + Low frequency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span><strong>Trending:</strong> Low urgency + High frequency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span><strong>Routine:</strong> Low urgency + Low frequency</span>
            </div>
          </div>
        </div>

        {/* Scatter Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey="x"
              name="Frequency"
              label={{ value: 'Frequency (Number of Posts)', position: 'bottom', offset: 40 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Urgency"
              domain={[0, 100]}
              label={{ value: 'Urgency Level (0-100)', angle: -90, position: 'left', offset: 40 }}
            />
            <ZAxis type="number" dataKey="z" range={[100, 1000]} name="Engagement" />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border rounded-lg shadow-lg">
                      <p className="font-bold text-sm mb-2">{data.topic}</p>
                      <div className="space-y-1 text-xs">
                        <p><strong>Urgency:</strong> {data.y.toFixed(1)}/100</p>
                        <p><strong>Frequency:</strong> {data.x} posts</p>
                        <p><strong>Engagement:</strong> {(data.z * 2).toFixed(0)}</p>
                        <p><strong>Sentiment:</strong> {data.sentiment}</p>
                        <p><strong>Platforms:</strong> {data.platforms}</p>
                        <p className="mt-2 font-semibold" style={{ color: getQuadrantColor(data.quadrant) }}>
                          {getQuadrantLabel(data.quadrant)}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Topics" data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getQuadrantColor(entry.quadrant)} />
              ))}
            </Scatter>

            {/* Reference lines for quadrants */}
            {data.thresholds && (
              <>
                <line
                  x1={0}
                  y1={data.thresholds.urgency.high}
                  x2="100%"
                  y2={data.thresholds.urgency.high}
                  stroke="#94a3b8"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                />
              </>
            )}
          </ScatterChart>
        </ResponsiveContainer>

        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {['critical', 'monitor', 'trending', 'routine'].map(quadrant => {
            const count = data.bubbles.filter(b => b.quadrant === quadrant).length;
            return (
              <div key={quadrant} className="p-3 border rounded-lg">
                <div
                  className="w-3 h-3 rounded-full mb-2"
                  style={{ backgroundColor: getQuadrantColor(quadrant) }}
                ></div>
                <div className="text-xs text-gray-600 mb-1">{getQuadrantLabel(quadrant)}</div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
