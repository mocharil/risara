// src/components/social-monitoring/executive-summary.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatsCard } from '@/components/dashboard/stats-card';
import { FileText, RefreshCw, Calendar, TrendingUp, AlertTriangle, Activity, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

export interface ExecutiveSummaryData {
  summary: string;
  metadata: {
    date: string;
    totalInsights: number;
    criticalIssues: number;
    highPriorityIssues: number;
    avgUrgency: number;
    byPlatform: {
      tiktok: number;
      news: number;
    };
  };
}

interface ExecutiveSummaryProps {
  data: ExecutiveSummaryData | null;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function ExecutiveSummary({ data, isLoading, onRefresh }: ExecutiveSummaryProps) {
  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />
            <div className="text-gray-500">Generating AI-powered executive summary...</div>
            <div className="text-sm text-gray-400">This may take a few seconds</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="text-gray-500 text-center">
            No summary data available. Please try refreshing.
          </div>
        </CardContent>
      </Card>
    );
  }

  const { summary, metadata } = data;

  return (
    <div className="space-y-6">
      {/* Metadata Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Report Date"
          value={new Date(metadata.date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
          description="Analysis period"
          icon={Calendar}
          color="text-gray-900"
          tooltip="Date of this executive summary report"
        />

        <StatsCard
          title="Critical Issues"
          value={metadata.criticalIssues.toString()}
          description="Urgency ≥ 80"
          icon={AlertCircle}
          color="text-red-600"
          tooltip="Number of critical issues requiring immediate attention"
        />

        <StatsCard
          title="Total Insights"
          value={metadata.totalInsights.toString()}
          description={`TikTok: ${metadata.byPlatform.tiktok} | News: ${metadata.byPlatform.news}`}
          icon={TrendingUp}
          color="text-blue-600"
          tooltip="Total insights analyzed across all platforms"
        />

        <StatsCard
          title="Avg Urgency"
          value={metadata.avgUrgency.toFixed(1)}
          description="Out of 100"
          icon={Activity}
          color={metadata.avgUrgency >= 70 ? 'text-red-600' : metadata.avgUrgency >= 50 ? 'text-orange-600' : 'text-green-600'}
          tooltip="Average urgency level across all monitored content"
        />

        <StatsCard
          title="High Priority"
          value={metadata.highPriorityIssues.toString()}
          description="Urgency 60-79"
          icon={AlertTriangle}
          color="text-orange-600"
          tooltip="Number of high priority issues requiring attention"
        />
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                AI-Generated Executive Summary
              </CardTitle>
              <CardDescription>
                Powered by LLAMA 4 Maverick
              </CardDescription>
            </div>
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-xl font-semibold mt-4 mb-3 text-gray-800" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 my-3" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 my-3" {...props} />,
                li: ({ node, ...props }) => <li className="text-gray-700 leading-relaxed" {...props} />,
                p: ({ node, ...props }) => <p className="text-gray-700 leading-relaxed my-2" {...props} />,
                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                em: ({ node, ...props }) => <em className="italic text-gray-600" {...props} />,
                hr: ({ node, ...props }) => <hr className="my-6 border-gray-300" {...props} />,
              }}
            >
              {summary}
            </ReactMarkdown>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
