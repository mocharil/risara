"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Text , Hash, AtSign } from "lucide-react"

interface LocationItem {
  name: string;
  total: number;
}

interface HashtagItem {
  name: string;
  total: number;
}

interface MentionItem {
  name: string;
  total: number;
}

interface TwitterInsight {
  id: string;
  date: string;
  total_location: LocationItem[];
  total_hashtags: HashtagItem[];
  total_mentions: MentionItem[];
}

interface TrendingTopicsProps {
  activeSource: 'news' | 'tiktok';
  twitterInsight?: TwitterInsight | null;
  newsTopics?: Array<{ key: string; doc_count: number; avg_urgency?: number; max_urgency?: number }> | null;
}

type CombinedTrendItem = {
  name: string;
  total: number;
  type: 'location' | 'hashtag' | 'mention';
};

export function TrendingTopics({ activeSource, twitterInsight, newsTopics }: TrendingTopicsProps) {
  if (activeSource === 'tiktok' && twitterInsight) {
    // Combine and format all items
    const combinedItems: CombinedTrendItem[] = [
      // Add locations with "Region" prefix
      ...(twitterInsight.total_location?.map(item => ({
        name: `${item.name}`,
        total: item.total,
        type: 'location' as const
      })) || []),
      // Add hashtags (they already have # in their names)
      ...(twitterInsight.total_hashtags?.map(item => ({
        name: item.name,
        total: item.total,
        type: 'hashtag' as const
      })) || []),
      // Add mentions (they already have @ in their names)
      ...(twitterInsight.total_mentions?.map(item => ({
        name: item.name,
        total: item.total,
        type: 'mention' as const
      })) || [])
    ];

    // Sort by total and take top 10
    const topTrends = combinedItems
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Top Trending
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTrends.map((item, index) => (
              <div key={item.name} className="flex items-start gap-3">
                <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm font-semibold">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {item.type === 'location' && <Text  className="h-4 w-4 text-blue-500" />}
                    {item.type === 'hashtag' && <Hash className="h-4 w-4 text-green-500" />}
                    {item.type === 'mention' && <AtSign className="h-4 w-4 text-purple-500" />}
                    <p className="font-medium">
                      {item.name}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {item.total.toLocaleString()} posts
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper function to get urgency badge color
  const getUrgencyBadge = (urgency?: number) => {
    if (!urgency) return null;

    if (urgency >= 70) {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-red-100 text-red-700">High</span>;
    } else if (urgency >= 50) {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-700">Med</span>;
    } else {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">Low</span>;
    }
  };

  // Render news topics
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Topics
        </CardTitle>
        <p className="text-xs text-muted-foreground">Last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsTopics?.map((topic, index) => (
            <div key={topic.key || index} className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">#{topic.key}</p>
                  {getUrgencyBadge(topic.avg_urgency)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {(topic.doc_count || 0).toLocaleString()} mentions
                  {topic.avg_urgency && ` • Avg urgency: ${topic.avg_urgency}`}
                </p>
              </div>
            </div>
          ))}
          {(!newsTopics || newsTopics.length === 0) && (
            <div className="text-center py-4 text-muted-foreground">
              No trending topics available in the last 7 days
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}