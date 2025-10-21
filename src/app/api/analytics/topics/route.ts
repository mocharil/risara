// src/app/api/analytics/topics/route.ts
// Menjadi:


import { NextResponse } from 'next/server';
import type {
  AggregationsTermsAggregateBase,
  AggregationsAvgAggregate,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { client } from '@/lib/elasticsearch'
import { enhancedChatLogs } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

interface SentimentDistributionAggregation extends AggregationsTermsAggregateBase {
  buckets: Array<{
    key: string;
    doc_count: number;
  }>;
}

interface TopicBucket {
  key: string;
  doc_count: number;
  avg_urgency: AggregationsAvgAggregate;
  sentiment_distribution: SentimentDistributionAggregation;
}

interface TopicsAggregation extends AggregationsTermsAggregateBase {
  buckets: TopicBucket[];
}

interface CustomResponse {
  aggregations: {
    topics: TopicsAggregation;
  };
}

type ElasticsearchResponse = SearchResponse<unknown> & CustomResponse;

function calculateSentiment(sentimentBuckets: Array<{ key: string; doc_count: number }>): string {
  const scores = { Positive: 100, Neutral: 50, Negative: 0 };
  let totalScore = 0;
  let totalCount = 0;

  sentimentBuckets.forEach((bucket) => {
    const sentimentScore = scores[bucket.key as keyof typeof scores] ?? 0;
    totalScore += sentimentScore * bucket.doc_count;
    totalCount += bucket.doc_count;
  });

  return totalCount > 0 ? (totalScore / totalCount).toFixed(2) : '0';
}

export async function GET() {
  try {
    // Use dummy data if enabled
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for analytics topics');

      // Filter last 7 days
      const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentLogs = enhancedChatLogs.filter(log => new Date(log.timestamp) >= last7Days);

      // Aggregate by topic
      const topicMap = new Map();

      recentLogs.forEach(log => {
        const topic = log.classification_topic;
        if (!topicMap.has(topic)) {
          topicMap.set(topic, {
            count: 0,
            urgencies: [],
            sentiments: { Positive: 0, Neutral: 0, Negative: 0 }
          });
        }

        const data = topicMap.get(topic);
        data.count += 1;
        data.urgencies.push(log.urgency_level);
        data.sentiments[log.sentiment as keyof typeof data.sentiments] += 1;
      });

      // Transform to expected format
      const topics = Array.from(topicMap.entries()).map(([name, data]) => {
        const avgUrgency = data.urgencies.reduce((a: number, b: number) => a + b, 0) / data.urgencies.length;

        // Calculate sentiment score
        const scores = { Positive: 100, Neutral: 50, Negative: 0 };
        const totalScore = data.sentiments.Positive * scores.Positive +
                          data.sentiments.Neutral * scores.Neutral +
                          data.sentiments.Negative * scores.Negative;
        const sentimentScore = totalScore / data.count;

        return {
          name,
          count: data.count,
          urgency: Math.round(avgUrgency),
          sentiment: sentimentScore.toFixed(2),
        };
      }).sort((a, b) => b.count - a.count).slice(0, 9);

      return NextResponse.json({ topics });
    }

    console.log('Connecting to Elasticsearch...');

    const searchResponse = await client.search<ElasticsearchResponse>({
      index: 'chat_interactions',
      size: 0,
      body: {
        query: {
          range: {
            timestamp: {
              gte: 'now-7d/d',
            },
          },
        },
        aggs: {
          topics: {
            terms: {
              field: 'topic_classification.keyword',
              size: 9,
            },
            aggs: {
              avg_urgency: {
                avg: {
                  field: 'urgency_level',
                },
              },
              sentiment_distribution: {
                terms: {
                  field: 'sentiment.keyword',
                },
              },
            },
          },
        },
      },
    });

    const aggregations = searchResponse.aggregations;

    // Assert the type of `topics` explicitly
    const topicsAgg = aggregations?.topics as TopicsAggregation;
    if (!topicsAgg?.buckets || topicsAgg.buckets.length === 0) {
      console.log('No topics found in aggregations');
      return NextResponse.json({ topics: [] });
    }

    const topics = topicsAgg.buckets.map((bucket) => ({
      name: bucket.key,
      count: bucket.doc_count,
      urgency: Math.round(bucket.avg_urgency?.value ?? 0),
      sentiment: calculateSentiment(bucket.sentiment_distribution?.buckets || []),
    }));

    return NextResponse.json({ topics });
  } catch (error) {
    console.error('Error fetching topics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch topic data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}