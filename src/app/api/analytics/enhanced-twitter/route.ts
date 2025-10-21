// src/app/api/analytics/enhanced-twitter/route.ts
import { NextResponse } from 'next/server';
import { getTikTokCollection } from '@/lib/mongodb';

interface DateRange {
  gte: string;
  lt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'daily';
    const region = searchParams.get('region') || 'all';

    // Calculate date ranges
    let hoursAgo: number;
    let intervalType: 'hour' | 'day';

    switch (timeRange) {
      case 'weekly':
        hoursAgo = 7 * 24;
        intervalType = 'day';
        break;
      case 'monthly':
        hoursAgo = 30 * 24;
        intervalType = 'day';
        break;
      default: // daily
        hoursAgo = 24;
        intervalType = 'hour';
    }

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - hoursAgo);

    const collection = await getTikTokCollection();

    // Build query
    const query: any = {
      post_created_at: {
        $gte: startDate.toISOString(),
        $lt: new Date().toISOString()
      }
    };

    // Add region filter if specified
    if (region !== 'all') {
      query.affected_region = region;
    }

    // Fetch all documents matching the query
    const docs = await collection.find(query).toArray();

    // Sentiment Distribution
    const sentimentCounts = docs.reduce((acc: any, doc) => {
      const sentiment = doc.sentiment || 'Neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const sentimentDistribution = {
      buckets: Object.entries(sentimentCounts).map(([key, doc_count]) => ({
        key,
        doc_count
      }))
    };

    // Sentiment Trends Over Time
    const sentimentTrendMap = new Map<string, any>();
    docs.forEach(doc => {
      const date = new Date(doc.post_created_at);
      let key: string;

      if (intervalType === 'day') {
        key = date.toISOString().split('T')[0];
      } else {
        // Group by hour
        key = date.toISOString().slice(0, 13) + ':00:00.000Z';
      }

      if (!sentimentTrendMap.has(key)) {
        sentimentTrendMap.set(key, {
          key_as_string: key,
          key: new Date(key).getTime(),
          doc_count: 0,
          sentiments: { buckets: [] }
        });
      }

      const bucket = sentimentTrendMap.get(key);
      bucket.doc_count++;

      // Update sentiment buckets
      const sentiment = doc.sentiment || 'Neutral';
      let sentimentBucket = bucket.sentiments.buckets.find((b: any) => b.key === sentiment);
      if (!sentimentBucket) {
        sentimentBucket = { key: sentiment, doc_count: 0 };
        bucket.sentiments.buckets.push(sentimentBucket);
      }
      sentimentBucket.doc_count++;
    });

    const sentimentTrends = {
      buckets: Array.from(sentimentTrendMap.values()).sort((a, b) => a.key - b.key)
    };

    // Urgency Distribution using urgency_level (0-100)
    const urgencyGroups: any = {
      Low: { doc_count: 0, top_topics: { buckets: [] } },
      Medium: { doc_count: 0, top_topics: { buckets: [] } },
      High: { doc_count: 0, top_topics: { buckets: [] } }
    };

    docs.forEach(doc => {
      const urgency = doc.urgency_level || 0;
      let level: 'Low' | 'Medium' | 'High';

      if (urgency < 30) level = 'Low';
      else if (urgency < 70) level = 'Medium';
      else level = 'High';

      urgencyGroups[level].doc_count++;

      // Track topics
      const topic = doc.topic_classification || 'Unknown';
      const topicBuckets = urgencyGroups[level].top_topics.buckets;
      let topicBucket = topicBuckets.find((b: any) => b.key === topic);
      if (!topicBucket) {
        topicBucket = { key: topic, doc_count: 0 };
        topicBuckets.push(topicBucket);
      }
      topicBucket.doc_count++;
    });

    // Sort and limit topic buckets
    Object.values(urgencyGroups).forEach((group: any) => {
      group.top_topics.buckets = group.top_topics.buckets
        .sort((a: any, b: any) => b.doc_count - a.doc_count)
        .slice(0, 3);
    });

    const urgencyDistribution = {
      buckets: [
        { key: 'Low', ...urgencyGroups.Low },
        { key: 'Medium', ...urgencyGroups.Medium },
        { key: 'High', ...urgencyGroups.High }
      ]
    };

    // Top Engaging Posts
    const topPostsDocs = [...docs]
      .sort((a, b) => {
        const aScore = (a.like_count || 0);
        const bScore = (b.like_count || 0);
        return bScore - aScore;
      })
      .slice(0, 10);

    const topPosts = {
      hits: {
        hits: topPostsDocs.map(doc => ({
          _source: {
            post_caption: doc.post_caption,
            like_count: doc.like_count,
            sentiment: doc.sentiment,
            urgency_level: doc.urgency_level,
            affected_region: doc.affected_region,
            link_post: doc.link_post
          }
        }))
      }
    };

    // Keyword Analysis (using object field)
    const keywordCounts: any = {};
    docs.forEach(doc => {
      if (doc.object) {
        const keywords = Array.isArray(doc.object) ? doc.object : [doc.object];
        keywords.forEach((keyword: string) => {
          if (keyword && keyword !== 'Not Specified') {
            keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
          }
        });
      }
    });

    const keywords = {
      buckets: Object.entries(keywordCounts)
        .map(([key, doc_count]) => ({ key, doc_count }))
        .sort((a: any, b: any) => b.doc_count - a.doc_count)
        .slice(0, 50)
    };

    // Hashtag Analysis
    const hashtagCounts: any = {};
    docs.forEach(doc => {
      if (doc.post_hashtags) {
        const hashtags = Array.isArray(doc.post_hashtags) ? doc.post_hashtags : [doc.post_hashtags];
        hashtags.forEach((hashtag: string) => {
          if (hashtag) {
            hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
          }
        });
      }
    });

    const hashtags = {
      buckets: Object.entries(hashtagCounts)
        .map(([key, doc_count]) => ({ key, doc_count }))
        .sort((a: any, b: any) => b.doc_count - a.doc_count)
        .slice(0, 30)
    };

    // Regional Sentiment
    const regionalSentimentMap = new Map<string, any>();
    docs.forEach(doc => {
      const region = doc.affected_region || 'Unknown';
      if (!regionalSentimentMap.has(region)) {
        regionalSentimentMap.set(region, {
          key: region,
          doc_count: 0,
          sentiment_breakdown: { buckets: [] }
        });
      }

      const regionBucket = regionalSentimentMap.get(region);
      regionBucket.doc_count++;

      const sentiment = doc.sentiment || 'Neutral';
      let sentimentBucket = regionBucket.sentiment_breakdown.buckets.find((b: any) => b.key === sentiment);
      if (!sentimentBucket) {
        sentimentBucket = { key: sentiment, doc_count: 0 };
        regionBucket.sentiment_breakdown.buckets.push(sentimentBucket);
      }
      sentimentBucket.doc_count++;
    });

    const regionalSentiment = {
      buckets: Array.from(regionalSentimentMap.values())
        .sort((a, b) => b.doc_count - a.doc_count)
    };

    // Engagement Trends Over Time
    const engagementTrendMap = new Map<string, any>();
    docs.forEach(doc => {
      const date = new Date(doc.post_created_at);
      let key: string;

      if (intervalType === 'day') {
        key = date.toISOString().split('T')[0];
      } else {
        key = date.toISOString().slice(0, 13) + ':00:00.000Z';
      }

      if (!engagementTrendMap.has(key)) {
        engagementTrendMap.set(key, {
          key_as_string: key,
          key: new Date(key).getTime(),
          doc_count: 0,
          likes: [],
          avg_favorites: { value: 0 }
        });
      }

      const bucket = engagementTrendMap.get(key);
      bucket.doc_count++;
      bucket.likes.push(doc.like_count || 0);
    });

    // Calculate averages
    engagementTrendMap.forEach(bucket => {
      const sum = bucket.likes.reduce((a: number, b: number) => a + b, 0);
      bucket.avg_favorites.value = bucket.doc_count > 0 ? sum / bucket.doc_count : 0;
      delete bucket.likes; // Remove temporary array
    });

    const engagementTrends = {
      buckets: Array.from(engagementTrendMap.values()).sort((a, b) => a.key - b.key)
    };

    // Audience Distribution (same as regional)
    const audienceDistribution = {
      buckets: Array.from(regionalSentimentMap.values())
        .map(r => ({ key: r.key, doc_count: r.doc_count }))
        .sort((a, b) => b.doc_count - a.doc_count)
        .slice(0, 10)
    };

    // Critical Issues (urgency >= 70)
    const criticalDocs = docs.filter(doc => (doc.urgency_level || 0) >= 70);

    const criticalTopicMap = new Map<string, any>();
    criticalDocs.forEach(doc => {
      const topic = doc.topic_classification || 'Unknown';
      if (!criticalTopicMap.has(topic)) {
        criticalTopicMap.set(topic, {
          key: topic,
          doc_count: 0,
          by_region: { buckets: [] }
        });
      }

      const topicBucket = criticalTopicMap.get(topic);
      topicBucket.doc_count++;

      const region = doc.affected_region || 'Unknown';
      let regionBucket = topicBucket.by_region.buckets.find((b: any) => b.key === region);
      if (!regionBucket) {
        regionBucket = {
          key: region,
          doc_count: 0,
          sentiment_analysis: { buckets: [] }
        };
        topicBucket.by_region.buckets.push(regionBucket);
      }
      regionBucket.doc_count++;

      const sentiment = doc.sentiment || 'Neutral';
      let sentimentBucket = regionBucket.sentiment_analysis.buckets.find((b: any) => b.key === sentiment);
      if (!sentimentBucket) {
        sentimentBucket = { key: sentiment, doc_count: 0 };
        regionBucket.sentiment_analysis.buckets.push(sentimentBucket);
      }
      sentimentBucket.doc_count++;
    });

    // Sort regions by doc_count
    criticalTopicMap.forEach(topic => {
      topic.by_region.buckets = topic.by_region.buckets
        .sort((a: any, b: any) => b.doc_count - a.doc_count);
    });

    const criticalIssues = {
      doc_count: criticalDocs.length,
      by_topic: {
        buckets: Array.from(criticalTopicMap.values())
          .sort((a, b) => b.doc_count - a.doc_count)
          .slice(0, 5)
      }
    };

    // Process recommendations
    const recommendations = processRecommendations(criticalIssues);

    return NextResponse.json({
      timeRange,
      region,
      sentimentDistribution,
      sentimentTrends,
      urgencyDistribution,
      topPosts,
      keywords,
      hashtags,
      regionalSentiment,
      engagementTrends,
      audienceDistribution,
      recommendations
    });

  } catch (error) {
    console.error('Enhanced TikTok Analytics Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enhanced analytics data' },
      { status: 500 }
    );
  }
}

function processRecommendations(criticalIssues: any) {
  if (!criticalIssues?.by_topic?.buckets) return [];

  return criticalIssues.by_topic.buckets.map((topic: any) => {
    const topRegion = topic.by_region.buckets[0];
    const dominantSentiment = topRegion?.sentiment_analysis.buckets[0]?.key || 'neutral';

    return {
      topic: topic.key,
      region: topRegion?.key,
      sentiment: dominantSentiment,
      urgencyLevel: 'High',
      recommendation: generateRecommendation(topic.key, topRegion?.key, dominantSentiment)
    };
  });
}

function generateRecommendation(topic: string, region: string, sentiment: string) {
  const actions = {
    negative: [
      'Increase public communication',
      'Schedule community meetings',
      'Develop action plans',
      'Allocate emergency resources'
    ],
    neutral: [
      'Monitor situation closely',
      'Gather public feedback',
      'Prepare contingency plans',
      'Enhance public awareness'
    ],
    positive: [
      'Maintain current approach',
      'Share success stories',
      'Build on positive momentum',
      'Expand successful programs'
    ]
  };

  const sentimentKey = sentiment.toLowerCase() as keyof typeof actions;
  const action = actions[sentimentKey]?.[Math.floor(Math.random() * actions[sentimentKey].length)] || 'Monitor situation';

  return `${action} regarding ${topic} in ${region}.`;
}
