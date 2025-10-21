// src/app/api/unified-monitoring/route.ts
import { NextResponse } from 'next/server';
import { getNewsCollection, getTikTokCollection } from '@/lib/mongodb';
import { enhancedNewsArticles, enhancedTikTokPosts } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const page = parseInt(searchParams.get('page') || '1');
    const itemsPerPage = parseInt(searchParams.get('itemsPerPage') || '20');

    // Set default date range (last 30 days)
    const endDate = dateTo ? new Date(dateTo) : new Date();
    const startDate = dateFrom ? new Date(dateFrom) : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    let allNews: any[];
    let allTikTok: any[];

    if (USE_DUMMY_DATA) {
      // Use enhanced dummy data with date filtering
      console.log('🎭 Using enhanced dummy data for unified monitoring');

      allNews = enhancedNewsArticles.filter(doc => {
        const docDate = new Date(doc.post_created_at);
        return docDate >= startDate && docDate <= endDate;
      });

      allTikTok = enhancedTikTokPosts.filter(doc => {
        const docDate = new Date(doc.post_created_at);
        return docDate >= startDate && docDate <= endDate;
      });
    } else {
      const newsCollection = await getNewsCollection();
      const tiktokCollection = await getTikTokCollection();

      // Date filter
      const dateFilter = {
        post_created_at: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      };

      // Fetch all data for metrics (no pagination)
      [allNews, allTikTok] = await Promise.all([
        newsCollection.find(dateFilter).toArray(),
        tiktokCollection.find(dateFilter).toArray()
      ]);
    }

    // Calculate unified metrics
    const totalPosts = allNews.length + allTikTok.length;

    // Total engagement (likes from TikTok + engagement_rate from News)
    const tiktokEngagement = allTikTok.reduce((sum, doc) => sum + (doc.like_count || 0), 0);
    const newsEngagement = allNews.reduce((sum, doc) => sum + (doc.engagement_rate || 0), 0);
    const totalEngagement = tiktokEngagement + newsEngagement;

    // Average likes per post
    const avgLikesPerPost = allTikTok.length > 0
      ? tiktokEngagement / allTikTok.length
      : 0;

    // Average urgency level
    const allDocs = [...allNews, ...allTikTok];
    const avgUrgency = allDocs.length > 0
      ? allDocs.reduce((sum, doc) => sum + (doc.urgency_level || 0), 0) / allDocs.length
      : 0;

    // High priority posts (urgency >= 80)
    const highPriorityCount = allDocs.filter(doc => (doc.urgency_level || 0) >= 80).length;

    // Critical negative (high urgency + negative sentiment)
    const criticalNegativeCount = allDocs.filter(doc =>
      (doc.urgency_level || 0) >= 80 && doc.sentiment?.toLowerCase() === 'negative'
    ).length;

    // Most critical region (region with most high urgency posts)
    const criticalRegionCounts: any = {};
    allDocs.filter(doc => (doc.urgency_level || 0) >= 80).forEach(doc => {
      const region = doc.affected_region || 'Unknown';
      criticalRegionCounts[region] = (criticalRegionCounts[region] || 0) + 1;
    });
    const mostCriticalRegion = Object.entries(criticalRegionCounts)
      .sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Critical topics count
    const criticalTopics = new Set(
      allDocs
        .filter(doc => (doc.urgency_level || 0) >= 80)
        .map(doc => doc.topic_classification)
    );
    const criticalTopicsCount = criticalTopics.size;

    // Average daily posts
    const daysDiff = Math.max(1, Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const avgDailyPosts = totalPosts / daysDiff;

    // Regional coverage
    const regions = new Set(allDocs.map(doc => doc.affected_region).filter(Boolean));
    const regionalCoverage = regions.size;

    // Growth over time (grouped by day)
    const growthMap = new Map<string, any>();
    allDocs.forEach(doc => {
      const date = new Date(doc.post_created_at).toISOString().split('T')[0];
      if (!growthMap.has(date)) {
        growthMap.set(date, {
          date,
          news: 0,
          tiktok: 0,
          total: 0
        });
      }
      const dayData = growthMap.get(date);
      if ('title' in doc) {
        // News post
        dayData.news++;
      } else {
        // TikTok post
        dayData.tiktok++;
      }
      dayData.total++;
    });

    const growthData = Array.from(growthMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Today's activity (posts per hour for today)
    const today = new Date().toISOString().split('T')[0];
    const todayPosts = allDocs.filter(doc =>
      doc.post_created_at.startsWith(today)
    );

    const hourlyActivity = Array.from({ length: 24 }, (_, hour) => {
      const count = todayPosts.filter(doc => {
        const postHour = new Date(doc.post_created_at).getHours();
        return postHour === hour;
      }).length;
      return { hour, count };
    });

    // Topic distribution for today
    const topicCounts: any = {};
    todayPosts.forEach(doc => {
      const topic = doc.topic_classification || 'Unknown';
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });

    const topicActivity = Object.entries(topicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 10);

    // Filter urgent docs once (urgency >= 70)
    const urgentDocs = allDocs.filter(doc => (doc.urgency_level || 0) >= 70);

    // Sentiment distribution (URGENT ONLY)
    const sentimentCounts: any = {};
    urgentDocs.forEach(doc => {
      const sentiment = doc.sentiment || 'Neutral';
      sentimentCounts[sentiment] = (sentimentCounts[sentiment] || 0) + 1;
    });

    const sentimentDistribution = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
      sentiment,
      count,
      percentage: urgentDocs.length > 0 ? ((count as number) / urgentDocs.length) * 100 : 0
    }));

    // Topic distribution (URGENT ONLY)
    const allTopicCounts: any = {};
    urgentDocs.forEach(doc => {
      const topic = doc.topic_classification || 'Unknown';
      allTopicCounts[topic] = (allTopicCounts[topic] || 0) + 1;
    });

    const topicDistribution = Object.entries(allTopicCounts)
      .map(([topic, count]) => ({ topic, count }))
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 8);

    // Priority Issues with urgency (for bar chart with coloring)
    const topicUrgencyMap: any = {};
    urgentDocs.forEach(doc => {
      const topic = doc.topic_classification || 'Unknown';
      if (!topicUrgencyMap[topic]) {
        topicUrgencyMap[topic] = { count: 0, totalUrgency: 0 };
      }
      topicUrgencyMap[topic].count++;
      topicUrgencyMap[topic].totalUrgency += (doc.urgency_level || 0);
    });

    const priorityIssues = Object.entries(topicUrgencyMap)
      .map(([topic, data]: [string, any]) => ({
        topic,
        count: data.count,
        urgency: Math.round(data.totalUrgency / data.count)
      }))
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, 8);

    // Citizen Reach (unique creators/users)
    const uniqueCreators = new Set(
      allDocs.map(doc => doc.creator || doc.username).filter(Boolean)
    );
    const citizenReach = uniqueCreators.size;

    // Department Mentions (check mentions field or content for gov departments)
    const departmentKeywords = ['dinas', 'kelurahan', 'kecamatan', 'pemda', 'pemprov', 'gubernur', 'walikota', 'camat', 'lurah'];
    const departmentMentions = allDocs.filter(doc => {
      const content = (doc.title || doc.post_caption || '').toLowerCase();
      const mentions = (doc.mentions || []).join(' ').toLowerCase();
      const combined = content + ' ' + mentions;
      return departmentKeywords.some(keyword => combined.includes(keyword));
    });
    const departmentMentionsCount = departmentMentions.length;

    // Active Discussions (posts with high engagement - like_count > 100 or engagement_rate > 50)
    const activeDiscussions = allDocs.filter(doc =>
      (doc.like_count || 0) > 100 || (doc.engagement_rate || 0) > 50
    ).length;

    // Public Sentiment percentage (positive posts / total posts)
    const positivePosts = allDocs.filter(doc => doc.sentiment?.toLowerCase() === 'positive').length;
    const publicSentiment = allDocs.length > 0
      ? Math.round((positivePosts / allDocs.length) * 100)
      : 0;

    // Regional distribution (URGENT ONLY - urgency >= 70)
    const regionalCounts: any = {};
    urgentDocs.forEach(doc => {
      const region = doc.affected_region || 'Unknown';
      regionalCounts[region] = (regionalCounts[region] || 0) + 1;
    });

    const regionalDistribution = Object.entries(regionalCounts)
      .map(([region, count]) => ({ region, count }))
      .sort((a: any, b: any) => b.count - a.count);

    // Urgency distribution
    const urgencyDistribution = {
      high: allDocs.filter(doc => (doc.urgency_level || 0) >= 80).length,
      medium: allDocs.filter(doc => (doc.urgency_level || 0) >= 50 && (doc.urgency_level || 0) < 80).length,
      low: allDocs.filter(doc => (doc.urgency_level || 0) < 50).length
    };

    // Engagement trends by sentiment
    const sentimentTrends = new Map<string, any>();
    allDocs.forEach(doc => {
      const date = new Date(doc.post_created_at).toISOString().split('T')[0];
      const sentiment = doc.sentiment || 'Neutral';

      if (!sentimentTrends.has(date)) {
        sentimentTrends.set(date, {
          date,
          Positive: 0,
          Negative: 0,
          Neutral: 0
        });
      }

      const dayData = sentimentTrends.get(date);
      dayData[sentiment] = (dayData[sentiment] || 0) + 1;
    });

    const sentimentTrendsData = Array.from(sentimentTrends.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Top critical posts (high urgency, prioritize negative sentiment)
    const topPosts = [...allDocs]
      .filter(doc => (doc.urgency_level || 0) >= 70) // Only urgent posts
      .sort((a, b) => {
        // Sort by: 1) Urgency level (desc), 2) Negative sentiment first, 3) Engagement
        const aUrgency = a.urgency_level || 0;
        const bUrgency = b.urgency_level || 0;
        if (aUrgency !== bUrgency) return bUrgency - aUrgency;

        // Prioritize negative sentiment
        const aNegative = a.sentiment?.toLowerCase() === 'negative' ? 1 : 0;
        const bNegative = b.sentiment?.toLowerCase() === 'negative' ? 1 : 0;
        if (aNegative !== bNegative) return bNegative - aNegative;

        // Then by engagement
        const aScore = (a.like_count || 0) + (a.engagement_rate || 0);
        const bScore = (b.like_count || 0) + (b.engagement_rate || 0);
        return bScore - aScore;
      })
      .slice(0, 10) // Show top 10 critical posts
      .map(doc => ({
        id: doc._id,
        type: 'title' in doc ? 'news' : 'tiktok',
        username: doc.creator || doc.username || 'Unknown',
        content: doc.title || doc.post_caption,
        engagement: (doc.like_count || 0) + (doc.engagement_rate || 0),
        urgency: doc.urgency_level || 0,
        sentiment: doc.sentiment || 'Neutral'
      }));

    // Fetch paginated recent activity (URGENT ONLY - urgency >= 70)
    const skip = (page - 1) * itemsPerPage;

    let recentNews: any[];
    let recentTikTok: any[];

    if (USE_DUMMY_DATA) {
      // Filter and sort dummy data
      recentNews = allNews
        .filter(doc => (doc.urgency_level || 0) >= 70)
        .sort((a, b) => {
          if (a.urgency_level !== b.urgency_level) return b.urgency_level - a.urgency_level;
          return new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime();
        })
        .slice(0, itemsPerPage);

      recentTikTok = allTikTok
        .filter(doc => (doc.urgency_level || 0) >= 70)
        .sort((a, b) => {
          if (a.urgency_level !== b.urgency_level) return b.urgency_level - a.urgency_level;
          return new Date(b.post_created_at).getTime() - new Date(a.post_created_at).getTime();
        })
        .slice(0, itemsPerPage);
    } else {
      const newsCollection = await getNewsCollection();
      const tiktokCollection = await getTikTokCollection();

      const dateFilter = {
        post_created_at: {
          $gte: startDate.toISOString(),
          $lte: endDate.toISOString()
        }
      };

      const urgentFilter = {
        ...dateFilter,
        urgency_level: { $gte: 70 }
      };

      // Combine and sort by urgency + date
      [recentNews, recentTikTok] = await Promise.all([
        newsCollection
          .find(urgentFilter)
          .sort({ urgency_level: -1, post_created_at: -1 })
          .limit(itemsPerPage)
          .toArray(),
        tiktokCollection
          .find(urgentFilter)
          .sort({ urgency_level: -1, post_created_at: -1 })
          .limit(itemsPerPage)
          .toArray()
      ]);
    }

    // Format activity data
    const activityData = [
      ...recentNews.map(doc => ({
        id: doc._id,
        type: 'news' as const,
        username: doc.creator || doc.username || 'Unknown',
        content: doc.title || doc.post_caption,
        topic: doc.topic_classification || 'Unknown',
        date: doc.post_created_at,
        region: doc.affected_region || 'Unknown',
        sentiment: doc.sentiment || 'Neutral',
        urgency: doc.urgency_level || 0,
        link: doc.link_post
      })),
      ...recentTikTok.map(doc => ({
        id: doc._id,
        type: 'tiktok' as const,
        username: doc.username || 'Unknown',
        content: doc.post_caption,
        topic: doc.topic_classification || 'Unknown',
        date: doc.post_created_at,
        region: doc.affected_region || 'Unknown',
        sentiment: doc.sentiment || 'Neutral',
        urgency: doc.urgency_level || 0,
        link: doc.link_post
      }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(skip, skip + itemsPerPage);

    // Calculate percentage changes (comparing to previous period)
    const previousStartDate = new Date(startDate.getTime() - (endDate.getTime() - startDate.getTime()));

    let prevTotal: number;

    if (USE_DUMMY_DATA) {
      const prevNews = enhancedNewsArticles.filter(doc => {
        const docDate = new Date(doc.post_created_at);
        return docDate >= previousStartDate && docDate < startDate;
      }).length;

      const prevTikTok = enhancedTikTokPosts.filter(doc => {
        const docDate = new Date(doc.post_created_at);
        return docDate >= previousStartDate && docDate < startDate;
      }).length;

      prevTotal = prevNews + prevTikTok;
    } else {
      const newsCollection = await getNewsCollection();
      const tiktokCollection = await getTikTokCollection();

      const previousDateFilter = {
        post_created_at: {
          $gte: previousStartDate.toISOString(),
          $lt: startDate.toISOString()
        }
      };

      const [prevNews, prevTikTok] = await Promise.all([
        newsCollection.countDocuments(previousDateFilter),
        tiktokCollection.countDocuments(previousDateFilter)
      ]);

      prevTotal = prevNews + prevTikTok;
    }

    const engagementChange = prevTotal > 0 ? ((totalPosts - prevTotal) / prevTotal) * 100 : 0;

    return NextResponse.json({
      metrics: {
        totalEngagement,
        totalPosts,
        avgLikesPerPost: Math.round(avgLikesPerPost),
        avgUrgency: Math.round(avgUrgency),
        highPriorityCount,
        criticalNegativeCount,
        mostCriticalRegion,
        criticalTopicsCount,
        avgDailyPosts: Math.round(avgDailyPosts),
        regionalCoverage,
        citizenReach,
        departmentMentionsCount,
        activeDiscussions,
        publicSentiment,
        changes: {
          engagement: engagementChange.toFixed(1)
        }
      },
      growthData,
      sentimentDistribution,
      topicDistribution,
      priorityIssues,
      regionalDistribution,
      urgencyDistribution,
      sentimentTrends: sentimentTrendsData,
      topPosts,
      todayActivity: {
        hourly: hourlyActivity,
        byTopic: topicActivity,
        totalToday: todayPosts.length
      },
      recentActivity: activityData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(urgentDocs.length / itemsPerPage),
        itemsPerPage,
        totalItems: urgentDocs.length
      },
      dateRange: {
        from: startDate.toISOString(),
        to: endDate.toISOString()
      }
    });

  } catch (error: any) {
    console.error('Unified monitoring API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch unified monitoring data',
        details: error.message
      },
      { status: 500 }
    );
  }
}
