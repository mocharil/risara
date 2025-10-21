// src/app/api/social-monitoring/urgency/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTikTokCollection, getNewsCollection } from '@/lib/mongodb';
import { enhancedNewsArticles, enhancedTikTokPosts } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: NextRequest) {
  try {
    if (USE_DUMMY_DATA) {
      console.log('🎭 Using enhanced dummy data for urgency dashboard');

      const allData = [...enhancedNewsArticles, ...enhancedTikTokPosts];

      // Calculate overall urgency distribution
      const critical = allData.filter(d => d.urgency_level >= 80).length;
      const high = allData.filter(d => d.urgency_level >= 61 && d.urgency_level < 80).length;
      const medium = allData.filter(d => d.urgency_level >= 31 && d.urgency_level < 61).length;
      const low = allData.filter(d => d.urgency_level < 31).length;
      const avgUrgency = allData.reduce((sum, d) => sum + d.urgency_level, 0) / allData.length;

      // By topic
      const topicMap = new Map();
      allData.forEach(d => {
        const topic = d.topic_classification;
        if (!topicMap.has(topic)) {
          topicMap.set(topic, { urgencies: [], count: 0 });
        }
        topicMap.get(topic).urgencies.push(d.urgency_level);
        topicMap.get(topic).count += 1;
      });

      const byTopic = Array.from(topicMap.entries())
        .map(([topic, data]) => ({
          topic,
          avgUrgency: data.urgencies.reduce((a: number, b: number) => a + b, 0) / data.urgencies.length,
          count: data.count
        }))
        .sort((a, b) => b.avgUrgency - a.avgUrgency)
        .slice(0, 10);

      // By sentiment
      const sentimentMap = new Map();
      allData.forEach(d => {
        const sentiment = d.sentiment || 'Neutral';
        if (!sentimentMap.has(sentiment)) {
          sentimentMap.set(sentiment, { urgencies: [], count: 0 });
        }
        sentimentMap.get(sentiment).urgencies.push(d.urgency_level);
        sentimentMap.get(sentiment).count += 1;
      });

      const bySentiment = Array.from(sentimentMap.entries()).map(([sentiment, data]) => ({
        sentiment,
        avgUrgency: data.urgencies.reduce((a: number, b: number) => a + b, 0) / data.urgencies.length,
        count: data.count
      }));

      return NextResponse.json({
        success: true,
        data: {
          overall: {
            avgUrgency: Math.round(avgUrgency),
            critical,
            high,
            medium,
            low
          },
          byTopic,
          bySentiment,
          breakdown: {
            tiktok: {
              avgUrgency: Math.round(enhancedTikTokPosts.reduce((sum, d) => sum + d.urgency_level, 0) / enhancedTikTokPosts.length),
              critical: enhancedTikTokPosts.filter(d => d.urgency_level >= 80).length,
              high: enhancedTikTokPosts.filter(d => d.urgency_level >= 61 && d.urgency_level < 80).length,
              medium: enhancedTikTokPosts.filter(d => d.urgency_level >= 31 && d.urgency_level < 61).length,
              low: enhancedTikTokPosts.filter(d => d.urgency_level < 31).length,
            },
            news: {
              avgUrgency: Math.round(enhancedNewsArticles.reduce((sum, d) => sum + d.urgency_level, 0) / enhancedNewsArticles.length),
              critical: enhancedNewsArticles.filter(d => d.urgency_level >= 80).length,
              high: enhancedNewsArticles.filter(d => d.urgency_level >= 61 && d.urgency_level < 80).length,
              medium: enhancedNewsArticles.filter(d => d.urgency_level >= 31 && d.urgency_level < 61).length,
              low: enhancedNewsArticles.filter(d => d.urgency_level < 31).length,
            }
          }
        },
        timestamp: new Date().toISOString()
      });
    }

    const tiktokCollection = await getTikTokCollection();
    const newsCollection = await getNewsCollection();

    // Aggregate urgency data from both TikTok and News
    const [tiktokData, newsData] = await Promise.all([
      tiktokCollection.aggregate([
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  avgUrgency: { $avg: "$urgency_level" },
                  critical: {
                    $sum: {
                      $cond: [{ $gte: ["$urgency_level", 80] }, 1, 0]
                    }
                  },
                  high: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ["$urgency_level", 61] },
                            { $lt: ["$urgency_level", 80] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  },
                  medium: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ["$urgency_level", 31] },
                            { $lt: ["$urgency_level", 61] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  },
                  low: {
                    $sum: {
                      $cond: [{ $lt: ["$urgency_level", 31] }, 1, 0]
                    }
                  },
                }
              }
            ],
            byTopic: [
              {
                $group: {
                  _id: "$topic_classification",
                  avgUrgency: { $avg: "$urgency_level" },
                  count: { $sum: 1 }
                }
              },
              { $sort: { avgUrgency: -1 } },
              { $limit: 10 }
            ],
            bySentiment: [
              {
                $group: {
                  _id: "$sentiment",
                  avgUrgency: { $avg: "$urgency_level" },
                  count: { $sum: 1 }
                }
              }
            ]
          }
        }
      ]).toArray(),
      newsCollection.aggregate([
        {
          $facet: {
            overall: [
              {
                $group: {
                  _id: null,
                  avgUrgency: { $avg: "$urgency_level" },
                  critical: {
                    $sum: {
                      $cond: [{ $gte: ["$urgency_level", 80] }, 1, 0]
                    }
                  },
                  high: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ["$urgency_level", 61] },
                            { $lt: ["$urgency_level", 80] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  },
                  medium: {
                    $sum: {
                      $cond: [
                        {
                          $and: [
                            { $gte: ["$urgency_level", 31] },
                            { $lt: ["$urgency_level", 61] }
                          ]
                        },
                        1,
                        0
                      ]
                    }
                  },
                  low: {
                    $sum: {
                      $cond: [{ $lt: ["$urgency_level", 31] }, 1, 0]
                    }
                  },
                }
              }
            ],
            byTopic: [
              {
                $group: {
                  _id: "$topic_classification",
                  avgUrgency: { $avg: "$urgency_level" },
                  count: { $sum: 1 }
                }
              },
              { $sort: { avgUrgency: -1 } },
              { $limit: 10 }
            ],
            bySentiment: [
              {
                $group: {
                  _id: "$sentiment",
                  avgUrgency: { $avg: "$urgency_level" },
                  count: { $sum: 1 }
                }
              }
            ]
          }
        }
      ]).toArray()
    ]);

    // Combine results
    const tiktokOverall = tiktokData[0]?.overall[0] || { avgUrgency: 0, critical: 0, high: 0, medium: 0, low: 0 };
    const newsOverall = newsData[0]?.overall[0] || { avgUrgency: 0, critical: 0, high: 0, medium: 0, low: 0 };

    const totalPosts = tiktokOverall.critical + tiktokOverall.high + tiktokOverall.medium + tiktokOverall.low +
                      newsOverall.critical + newsOverall.high + newsOverall.medium + newsOverall.low;

    const combinedOverall = {
      avgUrgency: totalPosts > 0
        ? ((tiktokOverall.avgUrgency || 0) * (tiktokOverall.critical + tiktokOverall.high + tiktokOverall.medium + tiktokOverall.low) +
           (newsOverall.avgUrgency || 0) * (newsOverall.critical + newsOverall.high + newsOverall.medium + newsOverall.low)) / totalPosts
        : 0,
      critical: tiktokOverall.critical + newsOverall.critical,
      high: tiktokOverall.high + newsOverall.high,
      medium: tiktokOverall.medium + newsOverall.medium,
      low: tiktokOverall.low + newsOverall.low
    };

    // Combine topics from both sources
    const topicMap = new Map();

    [...(tiktokData[0]?.byTopic || []), ...(newsData[0]?.byTopic || [])].forEach((topic: any) => {
      const key = topic._id;
      if (topicMap.has(key)) {
        const existing = topicMap.get(key);
        topicMap.set(key, {
          topic: key,
          avgUrgency: (existing.avgUrgency * existing.count + topic.avgUrgency * topic.count) / (existing.count + topic.count),
          count: existing.count + topic.count
        });
      } else {
        topicMap.set(key, {
          topic: key,
          avgUrgency: topic.avgUrgency,
          count: topic.count
        });
      }
    });

    const combinedTopics = Array.from(topicMap.values())
      .sort((a, b) => b.avgUrgency - a.avgUrgency)
      .slice(0, 10);

    // Combine sentiment data
    const sentimentMap = new Map();

    [...(tiktokData[0]?.bySentiment || []), ...(newsData[0]?.bySentiment || [])].forEach((sentiment: any) => {
      const key = sentiment._id;
      if (sentimentMap.has(key)) {
        const existing = sentimentMap.get(key);
        sentimentMap.set(key, {
          sentiment: key,
          avgUrgency: (existing.avgUrgency * existing.count + sentiment.avgUrgency * sentiment.count) / (existing.count + sentiment.count),
          count: existing.count + sentiment.count
        });
      } else {
        sentimentMap.set(key, {
          sentiment: key,
          avgUrgency: sentiment.avgUrgency,
          count: sentiment.count
        });
      }
    });

    const combinedSentiment = Array.from(sentimentMap.values());

    return NextResponse.json({
      success: true,
      data: {
        overall: combinedOverall,
        byTopic: combinedTopics,
        bySentiment: combinedSentiment,
        breakdown: {
          tiktok: tiktokOverall,
          news: newsOverall
        }
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching urgency data:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch urgency data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
