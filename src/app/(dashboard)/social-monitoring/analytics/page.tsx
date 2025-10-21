// src/app/(dashboard)/social-monitoring/analytics/page.tsx
'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertOctagon, TrendingUp, Target, FileText, CheckSquare, Hash } from 'lucide-react';

// Import Phase 1 components
import { UrgencyDashboard } from '@/components/social-monitoring/urgency-dashboard';
import { ExecutiveSummary } from '@/components/social-monitoring/executive-summary';
import { CrisisTimeline } from '@/components/social-monitoring/crisis-timeline';
import { TopicMatrix } from '@/components/social-monitoring/topic-matrix';
import { ProblemSolutionMatrix } from '@/components/social-monitoring/problem-solution-matrix';
import { KeywordCloud } from '@/components/social-monitoring/keyword-cloud';

// Import custom hooks
import {
  useUrgencyData,
  useExecutiveSummary,
  useCrisisTimeline,
  useTopicMatrix,
  useProblemSolution,
  useKeywords
} from '@/hooks/use-social-monitoring';

export default function SocialMonitoringAnalyticsPage() {
  // Fetch all data using custom hooks
  const urgencyData = useUrgencyData();
  const executiveSummary = useExecutiveSummary();
  const crisisTimeline = useCrisisTimeline({ minUrgency: 70 });
  const topicMatrix = useTopicMatrix();
  const problemSolution = useProblemSolution({ minUrgency: 0 });
  const keywords = useKeywords({ limit: 50 });

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Monitoring Analytics</h1>
              <p className="text-sm text-gray-600">Phase 1: Critical Dashboards & AI Insights</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs for organizing different views */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 lg:w-auto">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="executive" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Executive</span>
          </TabsTrigger>
          <TabsTrigger value="crisis" className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4" />
            <span className="hidden sm:inline">Crisis</span>
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Topics</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Insights</span>
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            <span className="hidden sm:inline">Keywords</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab - Shows Urgency Dashboard + Quick Stats */}
        <TabsContent value="overview" className="space-y-6">
          <UrgencyDashboard
            data={urgencyData.data}
            isLoading={urgencyData.isLoading}
          />

          {/* Quick Preview of Other Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeywordCloud
              data={keywords.data}
              isLoading={keywords.isLoading}
            />
            <TopicMatrix
              data={topicMatrix.data}
              isLoading={topicMatrix.isLoading}
            />
          </div>
        </TabsContent>

        {/* Executive Summary Tab */}
        <TabsContent value="executive" className="space-y-6">
          <ExecutiveSummary
            data={executiveSummary.data}
            isLoading={executiveSummary.isLoading}
            onRefresh={executiveSummary.refetch}
          />
        </TabsContent>

        {/* Crisis Timeline Tab */}
        <TabsContent value="crisis" className="space-y-6">
          <CrisisTimeline
            data={crisisTimeline.data}
            isLoading={crisisTimeline.isLoading}
            onFilterChange={(filters) => crisisTimeline.updateFilters(filters)}
          />
        </TabsContent>

        {/* Topic Matrix Tab */}
        <TabsContent value="topics" className="space-y-6">
          <TopicMatrix
            data={topicMatrix.data}
            isLoading={topicMatrix.isLoading}
          />
        </TabsContent>

        {/* Problem-Solution Insights Tab */}
        <TabsContent value="insights" className="space-y-6">
          <ProblemSolutionMatrix
            data={problemSolution.data}
            isLoading={problemSolution.isLoading}
            onFilterChange={(topic) => problemSolution.updateFilters({ topic })}
          />
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-6">
          <KeywordCloud
            data={keywords.data}
            isLoading={keywords.isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
