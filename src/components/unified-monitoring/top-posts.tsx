// src/components/unified-monitoring/top-posts.tsx
'use client';

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Video, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from '@/components/ui/loading';

interface TopPost {
  id: string;
  type: 'news' | 'tiktok';
  username: string;
  content: string;
  engagement: number;
  urgency: number;
  sentiment: string;
}

interface TopPostsProps {
  data: TopPost[];
  isLoading?: boolean;
}

export function TopPosts({ data, isLoading }: TopPostsProps) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[300px] gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-gray-500 text-sm">Loading top posts...</p>
        </div>
      </Card>
    );
  }

  const getSentimentColor = (sentiment: string) => {
    const lower = sentiment.toLowerCase();
    if (lower === 'positive') return 'bg-green-100 text-green-800';
    if (lower === 'negative') return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (urgency >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-orange-600" />
        <div>
          <h3 className="text-lg font-semibold">Top Performing Posts</h3>
          <p className="text-sm text-gray-500">Highest engagement posts</p>
        </div>
      </div>

      <div className="space-y-3">
        {data.map((post, index) => (
          <div
            key={post.id}
            className="p-4 rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Rank Badge */}
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                index === 0 ? "bg-yellow-100 text-yellow-700" :
                index === 1 ? "bg-gray-100 text-gray-700" :
                index === 2 ? "bg-orange-100 text-orange-700" :
                "bg-blue-50 text-blue-600"
              )}>
                #{index + 1}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  {post.type === 'news' ? (
                    <Newspaper className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  ) : (
                    <Video className="h-4 w-4 text-pink-600 flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium truncate">{post.username}</span>
                </div>

                {/* Content */}
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                  {post.content}
                </p>

                {/* Metrics */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {post.engagement.toLocaleString()} eng.
                  </Badge>
                  <Badge className={cn("text-xs", getSentimentColor(post.sentiment))}>
                    {post.sentiment}
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", getUrgencyColor(post.urgency))}>
                    {post.urgency}% urgency
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {data.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No top posts available
        </div>
      )}
    </Card>
  );
}
