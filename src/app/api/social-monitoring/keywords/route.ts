// src/app/api/social-monitoring/keywords/route.ts
import { NextRequest, NextResponse } from 'next/server';
import {
  getTikTokCollection,
  getNewsCollection,
  getInsightTikTokCollection,
  getInsightNewsCollection
} from '@/lib/mongodb';
import { enhancedKeywordsCloud } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: NextRequest) {
  try {
    // Use dummy data if enabled
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for keywords cloud');
      const { searchParams } = new URL(request.url);
      const limit = parseInt(searchParams.get('limit') || '50');
      const sentimentFilter = searchParams.get('sentiment');

      let keywordsData = enhancedKeywordsCloud;

      // Filter by sentiment if requested
      if (sentimentFilter && sentimentFilter !== 'all') {
        keywordsData = keywordsData.filter(k => k.sentiment.toLowerCase() === sentimentFilter.toLowerCase());
      }

      const limitedKeywords = keywordsData.slice(0, limit);

      // Transform to expected format
      const transformedKeywords = limitedKeywords.map(k => ({
        keyword: k.text,
        count: k.value,
        type: k.text.startsWith('#') ? 'hashtag' as const : 'keyword' as const,
        avgUrgency: k.urgency,
        sentiment: k.sentiment,
      }));

      // Calculate stats
      const totalMentions = limitedKeywords.reduce((sum, k) => sum + k.value, 0);
      const highUrgencyKeywords = limitedKeywords.filter(k => k.urgency >= 70).length;

      return NextResponse.json({
        success: true,
        data: {
          keywords: transformedKeywords,
          stats: {
            total: limitedKeywords.length,
            totalMentions,
            avgMentions: totalMentions > 0 ? Math.round(totalMentions / limitedKeywords.length) : 0,
            highUrgencyKeywords,
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source') || 'all'; // 'hashtags', 'keywords', or 'all'

    const keywordMap = new Map();

    // Get hashtags from insights
    if (source === 'hashtags' || source === 'all') {
      const tiktokInsightCollection = await getInsightTikTokCollection();

      const hashtags = await tiktokInsightCollection.aggregate([
        { $unwind: '$total_hashtags' },
        {
          $project: {
            keyword: '$total_hashtags.tag',
            count: '$total_hashtags.count',
            type: { $literal: 'hashtag' }
          }
        }
      ]).toArray();

      hashtags.forEach((item: any) => {
        if (item.keyword) {
          const key = item.keyword.toLowerCase();
          if (keywordMap.has(key)) {
            const existing = keywordMap.get(key);
            keywordMap.set(key, {
              keyword: item.keyword,
              count: existing.count + item.count,
              type: 'hashtag'
            });
          } else {
            keywordMap.set(key, {
              keyword: item.keyword,
              count: item.count,
              type: 'hashtag'
            });
          }
        }
      });
    }

    // Get contextual keywords from raw data
    if (source === 'keywords' || source === 'all') {
      const tiktokCollection = await getTikTokCollection();
      const newsCollection = await getNewsCollection();

      const [tiktokKeywords, newsKeywords] = await Promise.all([
        tiktokCollection.aggregate([
          { $unwind: '$contextual_keywords' },
          {
            $group: {
              _id: '$contextual_keywords',
              count: { $sum: 1 },
              avgUrgency: { $avg: '$urgency_level' },
              sentiments: { $push: '$sentiment' }
            }
          },
          {
            $project: {
              keyword: '$_id',
              count: '$count',
              avgUrgency: '$avgUrgency',
              sentiments: '$sentiments',
              type: { $literal: 'keyword' }
            }
          }
        ]).toArray(),
        newsCollection.aggregate([
          { $unwind: '$contextual_keywords' },
          {
            $group: {
              _id: '$contextual_keywords',
              count: { $sum: 1 },
              avgUrgency: { $avg: '$urgency_level' },
              sentiments: { $push: '$sentiment' }
            }
          },
          {
            $project: {
              keyword: '$_id',
              count: '$count',
              avgUrgency: '$avgUrgency',
              sentiments: '$sentiments',
              type: { $literal: 'keyword' }
            }
          }
        ]).toArray()
      ]);

      [...tiktokKeywords, ...newsKeywords].forEach((item: any) => {
        if (item.keyword) {
          const key = item.keyword.toLowerCase();

          // Calculate dominant sentiment
          const sentimentCounts: any = {};
          (item.sentiments || []).forEach((s: string) => {
            sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
          });
          const dominantSentiment = Object.keys(sentimentCounts).length > 0
            ? Object.keys(sentimentCounts).reduce((a, b) =>
                sentimentCounts[a] > sentimentCounts[b] ? a : b
              )
            : 'neutral';

          if (keywordMap.has(key)) {
            const existing = keywordMap.get(key);
            const totalCount = existing.count + item.count;
            keywordMap.set(key, {
              keyword: item.keyword,
              count: totalCount,
              type: existing.type === 'hashtag' ? 'hashtag' : 'keyword',
              avgUrgency: existing.avgUrgency
                ? (existing.avgUrgency * existing.count + item.avgUrgency * item.count) / totalCount
                : item.avgUrgency,
              sentiment: dominantSentiment
            });
          } else {
            keywordMap.set(key, {
              keyword: item.keyword,
              count: item.count,
              type: 'keyword',
              avgUrgency: item.avgUrgency,
              sentiment: dominantSentiment
            });
          }
        }
      });
    }

    // Convert to array and sort by count
    const keywords = Array.from(keywordMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);

    // Calculate statistics
    const stats = {
      total: keywords.length,
      totalMentions: keywords.reduce((sum, k) => sum + k.count, 0),
      avgMentions: keywords.length > 0
        ? keywords.reduce((sum, k) => sum + k.count, 0) / keywords.length
        : 0,
      byType: {
        hashtags: keywords.filter(k => k.type === 'hashtag').length,
        keywords: keywords.filter(k => k.type === 'keyword').length
      },
      highUrgencyKeywords: keywords.filter(k => k.avgUrgency && k.avgUrgency >= 70).length
    };

    return NextResponse.json({
      success: true,
      data: {
        keywords,
        stats
      },
      params: {
        limit,
        source
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching keywords:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch keywords',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
