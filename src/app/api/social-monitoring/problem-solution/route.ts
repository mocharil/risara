// src/app/api/social-monitoring/problem-solution/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getInsightTikTokCollection, getInsightNewsCollection } from '@/lib/mongodb';
import { enhancedProblemSolutions } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: NextRequest) {
  try {
    // Use dummy data if enabled
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for problem-solution');
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '20');
      const minUrgency = parseInt(searchParams.get('minUrgency') || '0');
      const topic = searchParams.get('topic');

      // Filter insights based on params
      let filteredInsights = enhancedProblemSolutions.insights.filter(
        i => i.urgency >= minUrgency
      );

      if (topic && topic !== 'all') {
        filteredInsights = filteredInsights.filter(i => i.topic === topic);
      }

      // Limit results
      const limitedInsights = filteredInsights.slice(0, limit);

      return NextResponse.json({
        insights: limitedInsights,
        stats: {
          total: limitedInsights.length,
          critical: limitedInsights.filter(i => i.urgency >= 80).length,
          high: limitedInsights.filter(i => i.urgency >= 60 && i.urgency < 80).length,
          avgUrgency: limitedInsights.length > 0
            ? limitedInsights.reduce((sum, i) => sum + i.urgency, 0) / limitedInsights.length
            : 0
        },
        filters: enhancedProblemSolutions.filters
      });
    }

    const { searchParams } = new URL(request.url);
    const minUrgency = parseInt(searchParams.get('minUrgency') || '0');
    const topic = searchParams.get('topic');
    const limit = parseInt(searchParams.get('limit') || '20');

    const tiktokInsightCollection = await getInsightTikTokCollection();
    const newsInsightCollection = await getInsightNewsCollection();

    // Build pipeline for TikTok insights
    const tiktokPipeline: any[] = [
      { $unwind: '$insight' },
      {
        $match: {
          'insight.urgency_score': { $gte: minUrgency }
        }
      }
    ];

    if (topic && topic !== 'all') {
      tiktokPipeline[1].$match['insight.topic'] = topic;
    }

    tiktokPipeline.push({
      $project: {
        topic: '$insight.topic',
        mainIssue: '$insight.main_issue',
        problem: '$insight.problem',
        suggestion: '$insight.suggestion',
        urgency: '$insight.urgency_score',
        platform: { $literal: 'TikTok' },
        date: '$created_at'
      }
    });

    // Build pipeline for News insights
    const newsPipeline: any[] = [
      { $unwind: '$insight' },
      {
        $match: {
          'insight.urgency_score': { $gte: minUrgency }
        }
      }
    ];

    if (topic && topic !== 'all') {
      newsPipeline[1].$match['insight.topic'] = topic;
    }

    newsPipeline.push({
      $project: {
        topic: '$insight.topic',
        mainIssue: '$insight.main_issue',
        problem: '$insight.problem',
        suggestion: '$insight.suggestion',
        urgency: '$insight.urgency_score',
        platform: { $literal: 'News' },
        date: '$created_at'
      }
    });

    const [tiktokInsights, newsInsights] = await Promise.all([
      tiktokInsightCollection.aggregate(tiktokPipeline).toArray(),
      newsInsightCollection.aggregate(newsPipeline).toArray()
    ]);

    // Combine and sort by urgency
    const allInsights = [...tiktokInsights, ...newsInsights]
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, limit);

    // Calculate statistics
    const stats = {
      total: allInsights.length,
      critical: allInsights.filter(i => i.urgency >= 80).length,
      high: allInsights.filter(i => i.urgency >= 60 && i.urgency < 80).length,
      medium: allInsights.filter(i => i.urgency >= 40 && i.urgency < 60).length,
      byPlatform: {
        tiktok: allInsights.filter(i => i.platform === 'TikTok').length,
        news: allInsights.filter(i => i.platform === 'News').length
      },
      avgUrgency: allInsights.length > 0
        ? allInsights.reduce((sum, i) => sum + i.urgency, 0) / allInsights.length
        : 0
    };

    // Get unique topics for filtering
    const uniqueTopics = [...new Set(allInsights.map(i => i.topic).filter(Boolean))];

    return NextResponse.json({
      success: true,
      data: {
        insights: allInsights,
        stats,
        filters: {
          topics: uniqueTopics
        }
      },
      params: {
        minUrgency,
        topic: topic || 'all',
        limit
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching problem-solution data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch problem-solution data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
