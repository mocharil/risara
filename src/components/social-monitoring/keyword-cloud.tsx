// src/components/social-monitoring/keyword-cloud.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Hash, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Keyword {
  keyword: string;
  count: number;
  type: 'hashtag' | 'keyword';
  avgUrgency?: number;
  sentiment?: string;
}

export interface KeywordCloudData {
  keywords: Keyword[];
  stats: {
    total: number;
    totalMentions: number;
    avgMentions: number;
    highUrgencyKeywords: number;
  };
}

interface KeywordCloudProps {
  data: KeywordCloudData | null;
  isLoading: boolean;
}

export function KeywordCloud({ data, isLoading }: KeywordCloudProps) {
  const [displayMode, setDisplayMode] = React.useState<'cloud' | 'list'>('cloud');

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading trending keywords...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.keywords.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Trending Keywords
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">No keyword data available</div>
        </CardContent>
      </Card>
    );
  }

  // Calculate font sizes for word cloud
  const maxCount = Math.max(...data.keywords.map(k => k.count));
  const minCount = Math.min(...data.keywords.map(k => k.count));
  const fontSizeScale = (count: number) => {
    const normalized = (count - minCount) / (maxCount - minCount || 1);
    return 12 + normalized * 32; // Range from 12px to 44px
  };

  const getUrgencyColor = (urgency?: number) => {
    if (!urgency) return '#6B7280';
    if (urgency >= 70) return '#EF4444';
    if (urgency >= 50) return '#F97316';
    return '#10B981';
  };

  const getSentimentColor = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive': return '#10B981';
      case 'negative': return '#EF4444';
      case 'neutral': return '#6B7280';
      default: return '#6B7280';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-green-600" />
              Trending Keywords & Hashtags
            </CardTitle>
            <CardDescription>
              {data.stats.total} keywords | {data.stats.totalMentions} total mentions | {data.stats.highUrgencyKeywords} high urgency
            </CardDescription>
          </div>
          <Select value={displayMode} onValueChange={(value: any) => setDisplayMode(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cloud">Cloud View</SelectItem>
              <SelectItem value="list">List View</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-blue-600 mb-1">Total Keywords</div>
            <div className="text-2xl font-bold text-blue-700">{data.stats.total}</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-green-600 mb-1">Total Mentions</div>
            <div className="text-2xl font-bold text-green-700">{data.stats.totalMentions}</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs text-purple-600 mb-1">Avg Mentions</div>
            <div className="text-2xl font-bold text-purple-700">{data.stats.avgMentions.toFixed(1)}</div>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-xs text-red-600 mb-1">High Urgency</div>
            <div className="text-2xl font-bold text-red-700">{data.stats.highUrgencyKeywords}</div>
          </div>
        </div>

        {/* Cloud View */}
        {displayMode === 'cloud' && (
          <div className="p-8 bg-gradient-to-br from-gray-50 to-white rounded-lg border min-h-[400px] flex flex-wrap items-center justify-center gap-4">
            {data.keywords.slice(0, 40).map((keyword, index) => {
              const fontSize = fontSizeScale(keyword.count);
              const color = keyword.avgUrgency
                ? getUrgencyColor(keyword.avgUrgency)
                : getSentimentColor(keyword.sentiment);

              return (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 hover:scale-110 transition-transform cursor-pointer"
                  style={{
                    fontSize: `${fontSize}px`,
                    color: color,
                    fontWeight: keyword.count > maxCount * 0.7 ? 'bold' : 'normal',
                    opacity: 0.7 + (keyword.count / maxCount) * 0.3
                  }}
                  title={`${keyword.keyword}: ${keyword.count} mentions${keyword.avgUrgency ? ` | Urgency: ${keyword.avgUrgency.toFixed(1)}` : ''}`}
                >
                  {keyword.type === 'hashtag' && '#'}
                  {keyword.keyword}
                </div>
              );
            })}
          </div>
        )}

        {/* List View */}
        {displayMode === 'list' && (
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {data.keywords.map((keyword, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="text-gray-500 font-mono text-sm w-8 text-right">
                    #{index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    {keyword.type === 'hashtag' ? (
                      <Hash className="h-4 w-4 text-blue-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{keyword.keyword}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {keyword.avgUrgency && (
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: getUrgencyColor(keyword.avgUrgency),
                        color: getUrgencyColor(keyword.avgUrgency)
                      }}
                    >
                      Urgency: {keyword.avgUrgency.toFixed(0)}
                    </Badge>
                  )}
                  {keyword.sentiment && (
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: getSentimentColor(keyword.sentiment),
                        color: getSentimentColor(keyword.sentiment)
                      }}
                    >
                      {keyword.sentiment}
                    </Badge>
                  )}
                  <Badge className="bg-gray-100 text-gray-700">
                    {keyword.count} mentions
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Color Guide:</div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>High Urgency (≥70)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>Medium Urgency (50-69)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Low Urgency / Positive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span>Neutral / No urgency data</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
