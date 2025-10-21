// src/app/api/analytics/twitter/route.ts
import { NextResponse } from 'next/server';
import { getTikTokCollection } from '@/lib/mongodb';

export async function GET() {
  try {
    const currentDate = new Date();
    const lastWeekDate = new Date(currentDate);
    lastWeekDate.setDate(currentDate.getDate() - 7);

    const previousWeekDate = new Date(lastWeekDate);
    previousWeekDate.setDate(lastWeekDate.getDate() - 7);

    const collection = await getTikTokCollection();

    // Query untuk mendapatkan metrik minggu ini
    const currentWeekDocs = await collection.find({
      post_created_at: {
        $gte: lastWeekDate.toISOString(),
        $lt: currentDate.toISOString()
      }
    }).toArray();

    // Query untuk metrik minggu sebelumnya
    const previousWeekDocs = await collection.find({
      post_created_at: {
        $gte: previousWeekDate.toISOString(),
        $lt: lastWeekDate.toISOString()
      }
    }).toArray();

    // Calculate current week metrics
    const totalEngagement = currentWeekDocs.reduce((sum, doc) =>
      sum + (doc.like_count || 0), 0
    );

    const uniqueUsers = new Set(currentWeekDocs.map(doc => doc.username)).size;

    // Sentiment distribution
    const sentimentCounts = currentWeekDocs.reduce((acc: any, doc) => {
      const sentiment = doc.sentiment || 'Neutral';
      acc[sentiment] = (acc[sentiment] || 0) + 1;
      return acc;
    }, {});

    const sentimentDistribution = Object.entries(sentimentCounts).map(([key, value]) => ({
      key,
      doc_count: value
    }));

    // Critical topics using urgency_level >= 70 (equivalent to 0.7)
    const topicGroups = currentWeekDocs.reduce((acc: any, doc) => {
      const topic = doc.topic_classification || 'Unknown';
      if (!acc[topic]) {
        acc[topic] = {
          count: 0,
          highUrgencyCount: 0,
          urgencyLevels: []
        };
      }
      acc[topic].count++;
      if ((doc.urgency_level || 0) >= 70) {
        acc[topic].highUrgencyCount++;
      }
      acc[topic].urgencyLevels.push(doc.urgency_level || 0);
      return acc;
    }, {});

    const criticalTopics = Object.entries(topicGroups)
      .map(([topic, data]: [string, any]) => ({
        topic,
        count: data.count,
        high_urgency_count: data.highUrgencyCount,
        avg_urgency: data.urgencyLevels.reduce((a: number, b: number) => a + b, 0) / data.urgencyLevels.length
      }))
      .filter(t => t.high_urgency_count > 0)
      .sort((a, b) => b.high_urgency_count - a.high_urgency_count)
      .slice(0, 10);

    // Department mentions
    const deptKeywords = {
      pemprov: 'Pemprov',
      dinas: 'Dinas',
      dprd: 'DPRD',
      walikota: 'Walikota',
      gubernur: 'Gubernur',
      pemerintah: 'Pemerintah'
    };

    const currentDeptMentions: any = {};
    const previousDeptMentions: any = {};

    Object.entries(deptKeywords).forEach(([key, keyword]) => {
      currentDeptMentions[key] = currentWeekDocs.filter(doc =>
        doc.post_caption?.toLowerCase().includes(keyword.toLowerCase())
      ).length;

      previousDeptMentions[key] = previousWeekDocs.filter(doc =>
        doc.post_caption?.toLowerCase().includes(keyword.toLowerCase())
      ).length;
    });

    // Sentiment trends per day
    const sentimentTrendMap = new Map<string, any>();
    currentWeekDocs.forEach(doc => {
      const date = new Date(doc.post_created_at).toISOString().split('T')[0];
      if (!sentimentTrendMap.has(date)) {
        sentimentTrendMap.set(date, { date, positive: 0, negative: 0, neutral: 0 });
      }
      const trend = sentimentTrendMap.get(date);
      const sentiment = (doc.sentiment || 'Neutral').toLowerCase();
      if (sentiment in trend) {
        trend[sentiment]++;
      }
    });

    const sentimentTrends = Array.from(sentimentTrendMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Regional distribution using affected_region
    const regionalCounts = currentWeekDocs.reduce((acc: any, doc) => {
      const region = doc.affected_region || 'Unknown';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});

    const regionalDistribution = Object.entries(regionalCounts)
      .map(([region, count]) => ({ region, value: count }))
      .sort((a: any, b: any) => b.value - a.value)
      .slice(0, 6);

    // High urgency total
    const highUrgencyTotal = currentWeekDocs.filter(doc =>
      (doc.urgency_level || 0) >= 70
    ).length;

    // Previous week metrics
    const previousEngagement = previousWeekDocs.reduce((sum, doc) =>
      sum + (doc.like_count || 0), 0
    );

    const previousUniqueUsers = new Set(previousWeekDocs.map(doc => doc.username)).size;

    const previousHighUrgency = previousWeekDocs.filter(doc =>
      (doc.urgency_level || 0) >= 70
    ).length;

    // Helper function untuk menghitung perubahan persentase
    const calculateChange = (current: number, previous: number): string => {
      if (previous === 0) return 'N/A';
      const change = ((current - previous) / previous) * 100;
      return change.toFixed(1);
    };

    // Calculate total department mentions
    const getCurrentDeptMentions = () =>
      Object.values(currentDeptMentions).reduce((sum: number, count: any) => sum + count, 0);

    const getPreviousDeptMentions = () =>
      Object.values(previousDeptMentions).reduce((sum: number, count: any) => sum + count, 0);

    // Get total posts
    const totalTweets = await collection.countDocuments();

    // Calculate positive sentiment percentage
    const positiveTweets = currentWeekDocs.filter(doc =>
      doc.sentiment?.toLowerCase() === 'positive'
    ).length;

    const positiveSentimentPercentage = currentWeekDocs.length > 0
      ? (positiveTweets / currentWeekDocs.length) * 100
      : 0;

    // Prepare response data
    const response = {
      // Metrics utama
      publicIssuesCount: highUrgencyTotal,
      citizenReach: uniqueUsers,
      activeDiscussions: Math.round(totalEngagement),
      totalTweets: totalTweets,
      criticalTopicsCount: criticalTopics.length,
      departmentMentionsCount: getCurrentDeptMentions(),

      // Perubahan mingguan
      weeklyChanges: {
        publicIssues: calculateChange(highUrgencyTotal, previousHighUrgency),
        citizenReach: calculateChange(uniqueUsers, previousUniqueUsers),
        activeDiscussions: calculateChange(totalEngagement, previousEngagement),
        departmentMentions: calculateChange(getCurrentDeptMentions(), getPreviousDeptMentions())
      },

      // Data charts
      sentimentTrends,

      // Top issues with urgency information
      topIssues: criticalTopics.map(t => ({
        topic: t.topic,
        count: t.high_urgency_count,
        urgency: Math.round(t.avg_urgency)
      })),

      // Department metrics
      departmentMetrics: Object.entries(currentDeptMentions)
        .map(([key, count]: [string, any]) => ({
          department: key.charAt(0).toUpperCase() + key.slice(1),
          mentions: count
        }))
        .filter(dept => dept.mentions > 0)
        .sort((a, b) => b.mentions - a.mentions),

      // Regional distribution
      regionalDistribution,

      publicSentiment: positiveSentimentPercentage.toFixed(1)
    };

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Error in TikTok Analytics API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data', details: error.message },
      { status: 500 }
    );
  }
}
