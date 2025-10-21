// src/components/social-monitoring/executive-summary.tsx
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FileText, RefreshCw, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';

interface ExecutiveSummaryProps {
  data: {
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
  } | null;
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
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-xs font-medium">Date</span>
            </div>
            <div className="text-lg font-bold">
              {new Date(metadata.date).toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Critical Issues</span>
            </div>
            <div className="text-lg font-bold text-red-600">{metadata.criticalIssues}</div>
            <div className="text-xs text-gray-500">Urgency ≥ 80</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs font-medium">Total Insights</span>
            </div>
            <div className="text-lg font-bold">{metadata.totalInsights}</div>
            <div className="text-xs text-gray-500">
              TikTok: {metadata.byPlatform.tiktok} | News: {metadata.byPlatform.news}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span className="text-xs font-medium">Avg Urgency</span>
            </div>
            <div className="text-lg font-bold" style={{
              color: metadata.avgUrgency >= 70 ? '#EF4444' : metadata.avgUrgency >= 50 ? '#F97316' : '#10B981'
            }}>
              {metadata.avgUrgency.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">/ 100</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-2">
              <span className="text-xs font-medium">High Priority</span>
            </div>
            <div className="text-lg font-bold text-orange-600">{metadata.highPriorityIssues}</div>
            <div className="text-xs text-gray-500">Urgency 60-79</div>
          </CardContent>
        </Card>
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
                Powered by Gemini 2.5 Flash Lite
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
