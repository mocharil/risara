import { NextResponse } from 'next/server';
import { getNewsCollection, getTikTokCollection } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const {
      query,
      source = 'news',
      page = 1,
      itemsPerPage = 10,
      filters,
    } = await request.json();

    // Get the appropriate collection
    const collection = source === 'news'
      ? await getNewsCollection()
      : await getTikTokCollection();

    // Build MongoDB query
    const mongoQuery: any = {};
    const andConditions: any[] = [];

    // Text search across multiple fields
    if (query) {
      andConditions.push({
        $or: [
          { post_caption: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ]
      });
    }

    // Date range filter
    if (filters?.dateRange?.from && filters?.dateRange?.to) {
      andConditions.push({
        post_created_at: {
          $gte: filters.dateRange.from,
          $lte: filters.dateRange.to,
        },
      });
    }

    // Categories filter - using topic_classification
    if (filters?.categories?.length) {
      andConditions.push({
        topic_classification: { $in: filters.categories }
      });
    }

    // Urgency level filter
    if (filters?.urgencyLevel?.length) {
      const urgencyConditions = filters.urgencyLevel.map((level: string) => {
        switch (level) {
          case 'High':
            return { urgency_level: { $gte: 80 } };
          case 'Medium':
            return { urgency_level: { $gte: 50, $lt: 80 } };
          case 'Low':
            return { urgency_level: { $lt: 50 } };
          default:
            return null;
        }
      }).filter(Boolean);

      if (urgencyConditions.length) {
        andConditions.push({ $or: urgencyConditions });
      }
    }

    // Sentiment filter
    if (filters?.sentiment?.length) {
      andConditions.push({
        sentiment: { $in: filters.sentiment }
      });
    }

    // Region filter - using affected_region
    if (filters?.region?.length) {
      andConditions.push({
        affected_region: { $in: filters.region }
      });
    }

    // Combine all conditions
    if (andConditions.length > 0) {
      mongoQuery.$and = andConditions;
    }

    // Get total count
    const total = await collection.countDocuments(mongoQuery);

    // Get paginated results
    const results = await collection
      .find(mongoQuery)
      .sort({ post_created_at: -1 })
      .skip((page - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .toArray();

    // Format results to match expected structure
    const formattedHits = results.map(doc => ({
      _id: doc._id,
      _source: {
        ...(source === 'news' ? {
          title: doc.title,
          link_post: doc.link_post,
          post_media_link: doc.post_media_link,
          post_caption: doc.post_caption,
          description: doc.description,
          post_created_at: doc.post_created_at,
          sentiment: doc.sentiment,
          topic: doc.topic_classification,
          viral_score: doc.viral_score,
          urgency_level: doc.urgency_level,
          region: doc.affected_region,
          creator: doc.creator,
          username: doc.username,
          contextual_content: doc.contextual_content,
          contextual_keywords: doc.contextual_keywords,
          target_audience: doc.target_audience,
          engagement_rate: doc.engagement_rate,
          influence_score: doc.influence_score,
          reach_score: doc.reach_score
        } : {
          post_caption: doc.post_caption,
          link_post: doc.link_post,
          thumbnail_url: doc.thumbnail_url,
          username: doc.username,
          post_created_at: doc.post_created_at,
          topic: doc.topic_classification,
          sentiment: doc.sentiment,
          urgency_level: doc.urgency_level,
          region: doc.affected_region,
          like_count: doc.like_count,
          post_hashtags: doc.post_hashtags,
          post_mentions: doc.post_mentions,
          profile_link: doc.profile_link,
          contextual_content: doc.contextual_content,
          contextual_keywords: doc.contextual_keywords,
          target_audience: doc.target_audience,
          post_type: doc.post_type
        })
      }
    }));

    return NextResponse.json({
      hits: formattedHits,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / itemsPerPage),
        itemsPerPage,
      },
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search content' },
      { status: 500 }
    );
  }
}
