// src/components/social-monitoring/crisis-timeline.tsx
'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, AlertTriangle, ExternalLink, Filter, TrendingUp, MessageSquare } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface CrisisEvent {
  _id: string;
  title: string;
  urgency: number;
  topic: string;
  sentiment: string;
  timestamp: string;
  platform: 'TikTok' | 'News';
  region: string;
  link: string;
  engagement: number;
  keywords?: string[];
  targetAudience?: string[];
}

export interface CrisisTimelineData {
  events: CrisisEvent[];
  stats: {
    total: number;
    critical: number;
    high: number;
    avgUrgency: number;
  };
  filters: {
    topics: string[];
    platforms: string[];
  };
}

interface CrisisTimelineProps {
  data: CrisisTimelineData | null;
  isLoading: boolean;
  onFilterChange?: (filters: { topic?: string; platform?: string }) => void;
}

export function CrisisTimeline({ data, isLoading, onFilterChange }: CrisisTimelineProps) {
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const handleTopicChange = (value: string) => {
    setSelectedTopic(value);
    onFilterChange?.({ topic: value, platform: selectedPlatform });
  };

  const handlePlatformChange = (value: string) => {
    setSelectedPlatform(value);
    onFilterChange?.({ topic: selectedTopic, platform: value });
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 80) return 'bg-red-100 text-red-700 border-red-300';
    if (urgency >= 61) return 'bg-orange-100 text-orange-700 border-orange-300';
    return 'bg-yellow-100 text-yellow-700 border-yellow-300';
  };

  const getSentimentBadge = (sentiment: string) => {
    const colors: any = {
      positive: 'bg-green-100 text-green-700',
      negative: 'bg-red-100 text-red-700',
      neutral: 'bg-gray-100 text-gray-700'
    };
    return colors[sentiment] || colors.neutral;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <div className="text-gray-500">Loading crisis timeline...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Crisis Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">No crisis events found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-600" />
              Crisis Timeline
            </CardTitle>
            <CardDescription>
              {data.stats.total} events | {data.stats.critical} critical | Avg Urgency: {data.stats.avgUrgency.toFixed(1)}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedTopic} onValueChange={handleTopicChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by topic" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                {data.filters.topics.map(topic => (
                  <SelectItem key={topic} value={topic}>{topic}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPlatform} onValueChange={handlePlatformChange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="tiktok">TikTok</SelectItem>
                <SelectItem value="news">News</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[600px] overflow-y-auto">
          {data.events.map((event, index) => (
            <div
              key={event._id || index}
              className={`border-l-4 p-4 rounded-r-lg hover:shadow-md transition-shadow ${
                event.urgency >= 80 ? 'border-red-500 bg-red-50' :
                event.urgency >= 61 ? 'border-orange-500 bg-orange-50' :
                'border-yellow-500 bg-yellow-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={getUrgencyColor(event.urgency)}>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Urgency: {event.urgency}
                    </Badge>
                    <Badge variant="outline" className={getSentimentBadge(event.sentiment)}>
                      {event.sentiment}
                    </Badge>
                    <Badge variant="outline" className="bg-blue-100 text-blue-700">
                      {event.platform}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h4>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(event.timestamp).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    {event.topic && (
                      <span className="flex items-center gap-1">
                        <Filter className="h-3 w-3" />
                        {event.topic}
                      </span>
                    )}
                    {event.engagement && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {event.platform === 'TikTok' ? `${event.engagement} likes` : `${event.engagement} engagement`}
                      </span>
                    )}
                  </div>
                  {event.keywords && event.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {event.keywords.slice(0, 5).map((keyword, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="ml-2"
                >
                  <a href={event.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
