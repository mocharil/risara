// src/app/api/social-monitoring/topic-matrix/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTikTokCollection, getNewsCollection } from '@/lib/mongodb';
import { enhancedNewsArticles, enhancedTikTokPosts } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: NextRequest) {
  try {
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for topic matrix');

      // Calculate topic matrix from dummy data
      const allData = [...enhancedNewsArticles, ...enhancedTikTokPosts];

      const topicMap = new Map();

      allData.forEach((item: any) => {
        const topic = item.topic_classification;
        if (!topic) return;

        if (!topicMap.has(topic)) {
          topicMap.set(topic, {
            urgencies: [],
            frequencies: 0,
            engagements: [],
            sentiments: [],
          });
        }

        const data = topicMap.get(topic);
        data.urgencies.push(item.urgency_level || 0);
        data.frequencies += 1;
        data.engagements.push(item.like_count || item.engagement_rate || 0);
        data.sentiments.push(item.sentiment || 'Neutral');
      });

      // Transform to bubble data
      const bubbleData = Array.from(topicMap.entries()).map(([topic, data]) => {
        const avgUrgency = data.urgencies.reduce((a: number, b: number) => a + b, 0) / data.urgencies.length;
        const avgEngagement = data.engagements.reduce((a: number, b: number) => a + b, 0) / data.engagements.length;

        // Calculate dominant sentiment
        const sentimentCounts: any = {};
        data.sentiments.forEach((s: string) => {
          sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
        });
        const dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
          sentimentCounts[a] > sentimentCounts[b] ? a : b
        , 'Neutral');

        return {
          topic,
          urgency: Math.round(avgUrgency),
          frequency: data.frequencies,
          engagement: Math.round(avgEngagement),
          sentiment: dominantSentiment,
          platforms: ['News', 'TikTok'],
          quadrant: getQuadrant(avgUrgency, data.frequencies, topicMap.size)
        };
      });

      // Calculate stats
      const stats = {
        totalTopics: bubbleData.length,
        avgUrgency: Math.round(bubbleData.reduce((sum, item) => sum + item.urgency, 0) / bubbleData.length),
        avgFrequency: Math.round(bubbleData.reduce((sum, item) => sum + item.frequency, 0) / bubbleData.length),
        criticalTopics: bubbleData.filter(item => item.urgency >= 80).length,
        highPriorityTopics: bubbleData.filter(item => item.urgency >= 61 && item.urgency < 80).length
      };

      return NextResponse.json({
        success: true,
        data: {
          bubbles: bubbleData,
          stats,
          thresholds: {
            urgency: {
              high: 70,
              medium: 50
            },
            frequency: {
              high: Math.ceil(stats.avgFrequency * 1.5),
              medium: Math.ceil(stats.avgFrequency)
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    const tiktokCollection = await getTikTokCollection();
    const newsCollection = await getNewsCollection();

    // Aggregate topic data from TikTok
    const tiktokPipeline = [
      {
        $group: {
          _id: '$topic_classification',
          avgUrgency: { $avg: '$urgency_level' },
          count: { $sum: 1 },
          avgLikes: { $avg: '$like_count' },
          sentiments: { $push: '$sentiment' }
        }
      },
      {
        $project: {
          topic: '$_id',
          urgency: '$avgUrgency',
          frequency: '$count',
          engagement: '$avgLikes',
          sentiments: '$sentiments',
          platform: { $literal: 'TikTok' }
        }
      }
    ];

    // Aggregate topic data from News
    const newsPipeline = [
      {
        $group: {
          _id: '$topic_classification',
          avgUrgency: { $avg: '$urgency_level' },
          count: { $sum: 1 },
          avgEngagement: { $avg: '$engagement_rate' },
          sentiments: { $push: '$sentiment' }
        }
      },
      {
        $project: {
          topic: '$_id',
          urgency: '$avgUrgency',
          frequency: '$count',
          engagement: '$avgEngagement',
          sentiments: '$sentiments',
          platform: { $literal: 'News' }
        }
      }
    ];

    const [tiktokTopics, newsTopics] = await Promise.all([
      tiktokCollection.aggregate(tiktokPipeline).toArray(),
      newsCollection.aggregate(newsPipeline).toArray()
    ]);

    // Combine and calculate dominant sentiment
    const combinedTopicsMap = new Map();

    [...tiktokTopics, ...newsTopics].forEach((item: any) => {
      const key = item.topic;

      // Calculate dominant sentiment
      const sentimentCounts: any = {};
      item.sentiments.forEach((s: string) => {
        sentimentCounts[s] = (sentimentCounts[s] || 0) + 1;
      });
      const dominantSentiment = Object.keys(sentimentCounts).reduce((a, b) =>
        sentimentCounts[a] > sentimentCounts[b] ? a : b
      , 'neutral');

      if (combinedTopicsMap.has(key)) {
        const existing = combinedTopicsMap.get(key);
        const totalFrequency = existing.frequency + item.frequency;

        combinedTopicsMap.set(key, {
          topic: key,
          urgency: (existing.urgency * existing.frequency + item.urgency * item.frequency) / totalFrequency,
          frequency: totalFrequency,
          engagement: (existing.engagement * existing.frequency + item.engagement * item.frequency) / totalFrequency,
          sentiment: dominantSentiment,
          platforms: [...existing.platforms, item.platform]
        });
      } else {
        combinedTopicsMap.set(key, {
          topic: key,
          urgency: item.urgency,
          frequency: item.frequency,
          engagement: item.engagement,
          sentiment: dominantSentiment,
          platforms: [item.platform]
        });
      }
    });

    const bubbleData = Array.from(combinedTopicsMap.values())
      .filter(item => item.topic) // Remove null/undefined topics
      .map(item => ({
        ...item,
        // Determine quadrant for coloring
        quadrant: getQuadrant(item.urgency, item.frequency, combinedTopicsMap.size)
      }));

    // Calculate statistics
    const stats = {
      totalTopics: bubbleData.length,
      avgUrgency: bubbleData.reduce((sum, item) => sum + item.urgency, 0) / bubbleData.length,
      avgFrequency: bubbleData.reduce((sum, item) => sum + item.frequency, 0) / bubbleData.length,
      criticalTopics: bubbleData.filter(item => item.urgency >= 80).length,
      highPriorityTopics: bubbleData.filter(item => item.urgency >= 61 && item.urgency < 80).length
    };

    return NextResponse.json({
      success: true,
      data: {
        bubbles: bubbleData,
        stats,
        thresholds: {
          urgency: {
            high: 70,
            medium: 50
          },
          frequency: {
            high: Math.ceil(stats.avgFrequency * 1.5),
            medium: Math.ceil(stats.avgFrequency)
          }
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching topic matrix:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch topic matrix',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to determine quadrant
function getQuadrant(urgency: number, frequency: number, totalTopics: number): string {
  const urgencyThreshold = 60;
  const frequencyThreshold = totalTopics > 0 ? Math.max(2, totalTopics / 4) : 2;

  if (urgency >= urgencyThreshold && frequency >= frequencyThreshold) {
    return 'critical'; // High urgency + High frequency = TOP PRIORITY
  } else if (urgency >= urgencyThreshold && frequency < frequencyThreshold) {
    return 'monitor'; // High urgency + Low frequency = MONITOR
  } else if (urgency < urgencyThreshold && frequency >= frequencyThreshold) {
    return 'trending'; // Low urgency + High frequency = TRENDING
  } else {
    return 'routine'; // Low urgency + Low frequency = ROUTINE
  }
}
