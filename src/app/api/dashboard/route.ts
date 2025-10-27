// src/app/api/dashboard/route.ts

import { NextResponse } from 'next/server'
import { getTikTokCollection, getInsightTikTokCollection, getNewsCollection, getInsightNewsCollection } from '@/lib/mongodb'
import { enhancedNewsArticles, enhancedTikTokPosts, enhancedStatistics, enhancedNewsInsights, enhancedTikTokInsights } from '@/lib/enhancedDummyData'
import { useDummyData } from '@/lib/useDummyData'

// Check if we should use dummy data
const USE_DUMMY_DATA = useDummyData()

interface NewsMetrics {
  totalArticles: number;
  urgentArticles: number;
  governmentMentions: number;
  publicSentiment: number;
  regionalImpact: number;
  topicDistribution: {
    [key: string]: number;
  };
}

interface TikTokMetrics {
  totalEngagements: number;
  citizenReach: number;
  activeDiscussions: number;
  publicResponse: number;
  totalPosts: number;
  avgEngagementRate: number;
}

interface Insight {
  date: string;
  insight: Array<{ urgency_score: number }>;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source') || 'news';
    const page = parseInt(url.searchParams.get('page') || '1');
    const itemsPerPage = parseInt(url.searchParams.get('itemsPerPage') || '10');
    const skip = (page - 1) * itemsPerPage;

    let allDocs: any[];
    let contentData: any[];
    let totalDocs: number;

    if (USE_DUMMY_DATA) {
      // Use enhanced dummy data
      console.log('🎭 Using enhanced dummy data for dashboard');
      const dummyData = source === 'news' ? enhancedNewsArticles : enhancedTikTokPosts;

      allDocs = dummyData;
      totalDocs = dummyData.length;
      contentData = dummyData.slice(skip, skip + itemsPerPage);
    } else {
      // Get the appropriate collection
      const collection = source === 'news'
        ? await getNewsCollection()
        : await getTikTokCollection();

      // Get total count
      totalDocs = await collection.countDocuments();

      // Get paginated content
      contentData = await collection
        .find({})
        .sort({ post_created_at: -1 })
        .skip(skip)
        .limit(itemsPerPage)
        .toArray();

      // Calculate metrics based on all documents (not just paginated)
      allDocs = await collection.find({}).toArray();
    }

    let metrics;
    if (source === 'news') {
      // Calculate news metrics
      // Use urgency_level >= 80 for urgent articles
      const urgentArticles = allDocs.filter(doc =>
        (doc.urgency_level || 0) >= 80
      ).length;

      // Use topic_classification instead of topic
      const govMentions = allDocs.filter(doc =>
        doc.topic_classification === "Government and Public Policy" ||
        doc.topic_classification === "Politics & Public Policy"
      ).length;

      const positiveSentiment = allDocs.filter(doc =>
        doc.sentiment === "Positive"
      ).length;

      // Use affected_region instead of region
      const regionalImpact = allDocs.filter(doc =>
        doc.affected_region === "DKI Jakarta"
      ).length;

      // Calculate topic distribution using topic_classification
      const topicDistribution = allDocs.reduce((acc: { [key: string]: number }, doc) => {
        const topic = doc.topic_classification || 'Unknown';
        acc[topic] = (acc[topic] || 0) + 1;
        return acc;
      }, {});

      metrics = {
        totalArticles: totalDocs,
        urgentArticles,
        governmentMentions: govMentions,
        publicSentiment: totalDocs > 0 ? (positiveSentiment / totalDocs) * 100 : 0,
        regionalImpact,
        topicDistribution
      };
    } else {
      // Calculate TikTok metrics
      // Use urgency_level >= 80 for urgent posts (same as news)
      const urgentPosts = allDocs.filter(doc =>
        (doc.urgency_level || 0) >= 80
      ).length;

      const totalEngagements = allDocs.reduce((acc, doc) => {
        return acc + Number(doc.like_count || 0);
      }, 0);

      // Use like_count as reach proxy
      const totalReach = allDocs.reduce((acc, doc) => {
        return acc + Number(doc.like_count || 0);
      }, 0);

      // Use like_count > 10 as proxy for active discussions
      const activeDiscussions = allDocs.filter(doc =>
        Number(doc.like_count || 0) > 10
      ).length;

      // TikTok data HAS sentiment field now!
      const positiveSentiment = allDocs.filter(doc =>
        doc.sentiment === "Positive"
      ).length;

      const avgEngagementRate = totalDocs > 0 ?
        (totalEngagements / totalDocs) : 0;

      metrics = {
        totalEngagements,
        citizenReach: totalReach,
        activeDiscussions,
        publicResponse: totalDocs > 0 ? (positiveSentiment / totalDocs) * 100 : 0,
        totalPosts: totalDocs,
        avgEngagementRate,
        urgentPosts // Add urgent posts metric
      };
    }

    // Get insights
    let formattedInsight: Insight = {
      date: new Date().toISOString().split('T')[0],
      insight: []
    };

    if (USE_DUMMY_DATA) {
      // Use enhanced dummy insights
      formattedInsight = source === 'news' ? enhancedNewsInsights : enhancedTikTokInsights;
    } else {
      try {
        const insightCollection = source === 'news'
          ? await getInsightNewsCollection()
          : await getInsightTikTokCollection();

        const insightDocs = await insightCollection
          .find({})
          .sort({ date: -1 })
          .limit(1)
          .toArray();

        if (insightDocs.length > 0) {
          formattedInsight = insightDocs[0] as any;
          if (formattedInsight.insight && Array.isArray(formattedInsight.insight)) {
            formattedInsight.insight = formattedInsight.insight
              .sort((a, b) => b.urgency_score - a.urgency_score)
              .slice(0, 5);
          }
        }
      } catch (insightError) {
        console.warn('Insight collection not found or error:', insightError);
      }
    }

    // Format content data for response
    const formattedContent = contentData.map(doc => ({
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
          sentiment: doc.sentiment, // Add sentiment
          urgency_level: doc.urgency_level, // Add urgency_level
          region: doc.affected_region, // Add region
          like_count: doc.like_count,
          post_hashtags: doc.post_hashtags,
          post_mentions: doc.post_mentions,
          profile_link: doc.profile_link,
          contextual_content: doc.contextual_content, // Add contextual_content
          contextual_keywords: doc.contextual_keywords, // Add contextual_keywords
          target_audience: doc.target_audience, // Add target_audience
          post_type: doc.post_type
        })
      }
    }));

    return NextResponse.json({
      stats: metrics,
      data: formattedContent,
      total: totalDocs,
      insights: {
        [source]: formattedInsight
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalDocs / itemsPerPage),
        itemsPerPage
      }
    });

  } catch (error: any) {
    console.error('API error details:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    return NextResponse.json(
      {
        error: 'Failed to fetch dashboard data',
        details: {
          message: error.message
        }
      },
      { status: 500 }
    );
  }
}
