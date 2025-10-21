import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { getInsightTikTokCollection, getNewsCollection } from '@/lib/mongodb'
import { enhancedTrendingTopics, enhancedTikTokTrending, enhancedNewsArticles } from '@/lib/enhancedDummyData'

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true'

export async function GET(request: NextRequest) {
  // Get source from query parameter
  const searchParams = request.nextUrl.searchParams
  const source = searchParams.get('source')

  try {
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for trending - October 21, 2025');

      if (source === 'tiktok') {
        // Return enhanced TikTok trending data matching insights
        return NextResponse.json({
          data: enhancedTikTokTrending
        });
      } else {
        // Return enhanced News trending data matching insights
        const trending = enhancedTrendingTopics.news;
        return NextResponse.json({ trending });
      }
    }

    if (source === 'tiktok') {
      // Fetch TikTok insights from MongoDB
      const collection = await getInsightTikTokCollection()

      const result = await collection
        .find({})
        .sort({ date: -1 })
        .limit(1)
        .toArray()

      if (result.length === 0) {
        return NextResponse.json({ data: null })
      }

      return NextResponse.json({ data: result[0] })
    } else {
      // Fetch News trending topics using MongoDB aggregation
      const collection = await getNewsCollection()

      // Calculate date 7 days ago
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const sevenDaysAgoISO = sevenDaysAgo.toISOString()

      // Get trending keywords from contextual_keywords field in last 7 days
      const trending = await collection.aggregate([
        {
          $addFields: {
            // Convert post_created_at to date if it's a string
            created_date: {
              $cond: {
                if: { $eq: [{ $type: "$post_created_at" }, "string"] },
                then: { $dateFromString: { dateString: "$post_created_at", onError: null } },
                else: "$post_created_at"
              }
            }
          }
        },
        {
          $match: {
            $or: [
              { created_date: { $gte: sevenDaysAgo } }, // Date format
              { post_created_at: { $gte: sevenDaysAgoISO } } // String format
            ]
          }
        },
        {
          $unwind: '$contextual_keywords' // Expand contextual_keywords array
        },
        {
          $group: {
            _id: '$contextual_keywords',
            doc_count: { $sum: 1 },
            max_urgency: { $max: '$urgency_level' },
            avg_urgency: { $avg: '$urgency_level' }
          }
        },
        {
          $match: {
            _id: { $nin: [null, ''] } // Remove null or empty keywords
          }
        },
        {
          $sort: { doc_count: -1 } // Sort by frequency
        },
        {
          $limit: 10
        },
        {
          $project: {
            key: '$_id',
            doc_count: 1,
            max_urgency: 1,
            avg_urgency: { $round: ['$avg_urgency', 0] },
            _id: 0
          }
        }
      ]).toArray()

      // If no results from last 7 days, get all time trending
      if (trending.length === 0) {
        const allTimeTrending = await collection.aggregate([
          {
            $unwind: '$contextual_keywords'
          },
          {
            $group: {
              _id: '$contextual_keywords',
              doc_count: { $sum: 1 },
              max_urgency: { $max: '$urgency_level' },
              avg_urgency: { $avg: '$urgency_level' }
            }
          },
          {
            $match: {
              _id: { $nin: [null, ''] }
            }
          },
          {
            $sort: { doc_count: -1 }
          },
          {
            $limit: 10
          },
          {
            $project: {
              key: '$_id',
              doc_count: 1,
              max_urgency: 1,
              avg_urgency: { $round: ['$avg_urgency', 0] },
              _id: 0
            }
          }
        ]).toArray()

        return NextResponse.json({ trending: allTimeTrending })
      }

      return NextResponse.json({ trending })
    }
  } catch (error) {
    console.error('Failed to fetch trending topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending topics' },
      { status: 500 }
    )
  }
}

// Add types to help with response typing
export type TikTokInsightResponse = {
  data: {
    id: string;
    date: string;
    total_location: Array<{
      name: string;
      total: number;
    }>;
    total_hashtags: Array<{
      name: string;
      total: number;
    }>;
    total_mentions: Array<{
      name: string;
      total: number;
    }>;
  } | null;
}

export type NewsTopicsResponse = {
  trending: Array<{
    key: string;
    doc_count: number;
  }>;
}
