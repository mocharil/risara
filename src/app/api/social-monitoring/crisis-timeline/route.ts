// src/app/api/social-monitoring/crisis-timeline/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTikTokCollection, getNewsCollection } from '@/lib/mongodb';
import { enhancedCrisisTimeline } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: NextRequest) {
  try {
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for crisis timeline');

      const { searchParams } = new URL(request.url);
      const minUrgency = parseInt(searchParams.get('minUrgency') || '70');
      const topic = searchParams.get('topic');
      const limit = parseInt(searchParams.get('limit') || '50');

      // Filter crisis events based on query params
      let filteredEvents = enhancedCrisisTimeline;

      // Add more filtering if needed
      if (topic && topic !== 'all') {
        // Filter by topic if needed
      }

      return NextResponse.json({
        success: true,
        data: filteredEvents.slice(0, limit),
        count: filteredEvents.length,
      });
    }

    const { searchParams } = new URL(request.url);
    const minUrgency = parseInt(searchParams.get('minUrgency') || '70');
    const topic = searchParams.get('topic');
    const platform = searchParams.get('platform'); // 'tiktok', 'news', or 'all'
    const limit = parseInt(searchParams.get('limit') || '50');

    // Build match query
    const matchQuery: any = {
      urgency_level: { $gte: minUrgency }
    };

    if (topic && topic !== 'all') {
      matchQuery.topic_classification = topic;
    }

    // Common aggregation pipeline
    const buildPipeline = (platformName: string) => [
      { $match: matchQuery },
      {
        $project: {
          title: platformName === 'TikTok' ? '$post_caption' : '$title',
          urgency: '$urgency_level',
          topic: '$topic_classification',
          sentiment: '$sentiment',
          timestamp: {
            $cond: {
              if: { $eq: [{ $type: '$post_created_at' }, 'string'] },
              then: { $dateFromString: { dateString: '$post_created_at', onError: new Date() } },
              else: '$post_created_at'
            }
          },
          platform: { $literal: platformName },
          region: '$affected_region',
          link: platformName === 'TikTok' ? '$post_link' : '$original_url',
          engagement: platformName === 'TikTok' ? '$like_count' : '$engagement_rate',
          keywords: '$contextual_keywords',
          targetAudience: '$target_audience'
        }
      },
      { $sort: { timestamp: -1 } }
    ];

    let results = [];

    // Fetch from both platforms
    const tiktokCollection = await getTikTokCollection();
    const newsCollection = await getNewsCollection();

    if (platform === 'tiktok') {
      results = await tiktokCollection.aggregate(buildPipeline('TikTok')).toArray();
    } else if (platform === 'news') {
      results = await newsCollection.aggregate(buildPipeline('News')).toArray();
    } else {
      // Fetch from both and combine
      const [tiktokData, newsData] = await Promise.all([
        tiktokCollection.aggregate(buildPipeline('TikTok')).toArray(),
        newsCollection.aggregate(buildPipeline('News')).toArray()
      ]);
      results = [...tiktokData, ...newsData].sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    }

    // Limit results
    results = results.slice(0, limit);

    return NextResponse.json({
      success: true,
      data: results,
      count: results.length
    });

  } catch (error) {
    console.error('Error fetching crisis timeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch crisis timeline',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
