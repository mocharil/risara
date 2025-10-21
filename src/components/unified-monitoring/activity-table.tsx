// src/components/unified-monitoring/activity-table.tsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Newspaper, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  type: 'news' | 'tiktok';
  username: string;
  content: string;
  topic: string;
  date: string;
  region: string;
  sentiment: string;
  urgency: number;
  link?: string;
}

interface ActivityTableProps {
  activities: ActivityItem[];
  isLoading?: boolean;
}

export function ActivityTable({ activities, isLoading }: ActivityTableProps) {
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading activities...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Newspaper className="h-3 w-3" />
            <span>News</span>
          </div>
          <div className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            <span>TikTok</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Topic</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Region</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Sentiment</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Urgency</th>
              <th className="text-left py-3 px-2 text-xs font-medium text-gray-500 uppercase">Link</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-1">
                    {activity.type === 'news' ? (
                      <Newspaper className="h-4 w-4 text-blue-600" />
                    ) : (
                      <Video className="h-4 w-4 text-pink-600" />
                    )}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm font-medium text-gray-900 max-w-[120px] truncate">
                    {activity.username}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-sm text-gray-600 max-w-[300px] truncate">
                    {activity.content}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <Badge variant="outline" className="text-xs">
                    {activity.topic}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <div className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <div className="text-xs text-gray-600">
                    {activity.region}
                  </div>
                </td>
                <td className="py-3 px-2">
                  <Badge className={cn("text-xs", getSentimentColor(activity.sentiment))}>
                    {activity.sentiment}
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  <Badge variant="outline" className={cn("text-xs", getUrgencyColor(activity.urgency))}>
                    {activity.urgency}%
                  </Badge>
                </td>
                <td className="py-3 px-2">
                  {activity.link && (
                    <a
                      href={activity.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No activities found
        </div>
      )}
    </Card>
  );
}
