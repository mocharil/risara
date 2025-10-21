// src/app/(dashboard)/social-monitoring/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CriticalMetrics } from '@/components/unified-monitoring/critical-metrics';
import { ActivityTable } from '@/components/unified-monitoring/activity-table';
import { SentimentChart } from '@/components/unified-monitoring/sentiment-chart';
import { RegionalMap } from '@/components/unified-monitoring/regional-map';
import { UrgencyChart } from '@/components/unified-monitoring/urgency-chart';
import { PriorityIssues } from '@/components/unified-monitoring/priority-issues';
import { TopPosts } from '@/components/unified-monitoring/top-posts';
import { StatsCard } from '@/components/dashboard/stats-card';
import { ExecutiveSummary } from '@/components/social-monitoring/executive-summary';
import { ProblemSolutionMatrix } from '@/components/social-monitoring/problem-solution-matrix';
import { KeywordCloud } from '@/components/social-monitoring/keyword-cloud';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  AlertOctagon,
  Users,
  Building2,
  MessageSquare,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loading } from '@/components/ui/loading';
import {
  useExecutiveSummary,
  useProblemSolution,
  useKeywords
} from '@/hooks/use-social-monitoring';

export default function SocialMonitoringPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // days
  const [page, setPage] = useState(1);
  const [topPostsPage, setTopPostsPage] = useState(1);
  const topPostsPerPage = 5;
  const [activeTab, setActiveTab] = useState('monitoring');

  // Fetch AI analysis data
  const executiveSummary = useExecutiveSummary();
  const problemSolution = useProblemSolution({ minUrgency: 0 });
  const keywords = useKeywords({ limit: 50 });

  useEffect(() => {
    fetchData();
  }, [dateRange, page]);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - parseInt(dateRange));

      const response = await fetch(
        `/api/unified-monitoring?dateFrom=${startDate.toISOString()}&dateTo=${endDate.toISOString()}&page=${page}&itemsPerPage=20`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching unified monitoring data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !data) {
    return <Loading variant="pulse" message="Loading social monitoring data..." />;
  }

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertOctagon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Social Monitoring</h1>
              <p className="text-sm text-gray-600">Real-time tracking & AI-powered insights for social media issues</p>
            </div>
          </div>
          <p className="text-gray-500 flex items-center gap-2 ml-14">
            <Calendar className="h-4 w-4" />
            {data?.dateRange.from && new Date(data.dateRange.from).toLocaleDateString('id-ID')} -{' '}
            {data?.dateRange.to && new Date(data.dateRange.to).toLocaleDateString('id-ID')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={fetchData}
            variant="outline"
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Tabs for Monitoring vs AI Analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="monitoring" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Urgent Issues
          </TabsTrigger>
          <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Analysis
          </TabsTrigger>
        </TabsList>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-6"  >

      {/* Critical Metrics */}
      <CriticalMetrics
        highUrgencyCount={data?.metrics.highPriorityCount || 0}
        criticalNegativeCount={data?.metrics.criticalNegativeCount || 0}
        avgUrgency={data?.metrics.avgUrgency || 0}
        criticalTopicsCount={data?.metrics.criticalTopicsCount || 0}
        mostCriticalRegion={data?.metrics.mostCriticalRegion || 'N/A'}
        changePercentage={data?.metrics.changes.engagement || '0'}
      />

      {/* Additional Government Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Citizen Reach"
          value={(data?.metrics.citizenReach || 0).toLocaleString()}
          description="Total unique citizens engaged"
          icon={Users}
          color="text-blue-600"
        />
        <StatsCard
          title="Department Mentions"
          value={(data?.metrics.departmentMentionsCount || 0).toLocaleString()}
          description="Government offices mentioned"
          icon={Building2}
          color="text-purple-600"
        />
        <StatsCard
          title="Active Discussions"
          value={(data?.metrics.activeDiscussions || 0).toLocaleString()}
          description="Ongoing public conversations"
          icon={MessageSquare}
          color="text-indigo-600"
        />
        <StatsCard
          title="Public Sentiment"
          value={`${data?.metrics.publicSentiment || 0}%`}
          description="Positive sentiment rate"
          icon={TrendingUp}
          color="text-green-600"
        />
      </div>

      {/* Charts Grid - 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityIssues
          data={data?.priorityIssues || []}
          isLoading={isLoading}
        />
        <RegionalMap
          data={data?.regionalDistribution || []}
          isLoading={isLoading}
        />
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UrgencyChart
          data={data?.urgencyDistribution || { high: 0, medium: 0, low: 0 }}
          isLoading={isLoading}
        />
        <SentimentChart
          data={data?.sentimentDistribution || []}
          isLoading={isLoading}
        />
      </div>

      {/* Top Posts with Pagination */}
      <div className="grid grid-cols-1">
        <TopPosts
          data={
            (data?.topPosts || []).slice(
              (topPostsPage - 1) * topPostsPerPage,
              topPostsPage * topPostsPerPage
            )
          }
          isLoading={isLoading}
        />
        {data?.topPosts && data.topPosts.length > topPostsPerPage && (
          <div className="mt-4 flex items-center justify-between bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-500">
              Showing {((topPostsPage - 1) * topPostsPerPage) + 1} to{' '}
              {Math.min(topPostsPage * topPostsPerPage, data.topPosts.length)} of{' '}
              {data.topPosts.length} posts
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTopPostsPage(p => Math.max(1, p - 1))}
                disabled={topPostsPage === 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTopPostsPage(p => p + 1)}
                disabled={topPostsPage >= Math.ceil(data.topPosts.length / topPostsPerPage) || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Activity Table */}
      <div className="grid grid-cols-1">
        <ActivityTable
          activities={data?.recentActivity || []}
          isLoading={isLoading}
        />
      </div>

      {/* Activity Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
          <div className="text-sm text-gray-500">
            Showing {((data.pagination.currentPage - 1) * data.pagination.itemsPerPage) + 1} to{' '}
            {Math.min(data.pagination.currentPage * data.pagination.itemsPerPage, data.pagination.totalItems)} of{' '}
            {data.pagination.totalItems} urgent posts
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, data.pagination.totalPages))].map((_, idx) => {
                let pageNum;
                if (data.pagination.totalPages <= 5) {
                  pageNum = idx + 1;
                } else if (page <= 3) {
                  pageNum = idx + 1;
                } else if (page >= data.pagination.totalPages - 2) {
                  pageNum = data.pagination.totalPages - 4 + idx;
                } else {
                  pageNum = page - 2 + idx;
                }

                return (
                  <Button
                    key={idx}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    disabled={isLoading}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= data.pagination.totalPages || isLoading}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai-analysis" className="space-y-6">
          {/* Executive Summary */}
          <ExecutiveSummary
            data={executiveSummary.data}
            isLoading={executiveSummary.isLoading}
            onRefresh={executiveSummary.refetch}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Problem-Solution Matrix */}
            <ProblemSolutionMatrix
              data={problemSolution.data}
              isLoading={problemSolution.isLoading}
              onFilterChange={(topic) => problemSolution.updateFilters({ topic })}
            />

            {/* Keyword Cloud */}
            <KeywordCloud
              data={keywords.data}
              isLoading={keywords.isLoading}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
