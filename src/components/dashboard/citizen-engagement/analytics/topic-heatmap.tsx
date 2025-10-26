// src/components/dashboard/citizen-engagement/analytics/topic-heatmap.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, AlertTriangle, BarChart3 } from "lucide-react";
import { useState } from "react";

interface Topic {
  name: string;
  count: number;
  urgency: number;
  details: string;
}

interface TopicHeatmapProps {
  topics: Topic[];
}

const topicImages: { [key: string]: string } = {
  "Infrastructure and Transportation": "/infrastructure_and_transportation.png",
  "Environment and Disaster": "/environment_and_disaster.png",
  "Public Health": "/public_health.png",
  "Education and Culture": "/education_and_culture.png",
  "City Planning and Housing": "/city_planning_and_housing.png",
  "Technology and Innovation": "/technology_and_innovation.png",
  "Safety and Crime": "/safety_and_crime.png",
  "Social and Economy": "/social_and_economy.png",
  "Tourism and Entertainment": "/tourism_and_entertainment.png",
  "Ecology and Green Spaces": "/ecology_and_green_spaces.png",
  "Government and Public Policy": "/government_and_public_policy.png"
};

export function TopicHeatmap({ topics }: TopicHeatmapProps) {
  const [hoveredTopic, setHoveredTopic] = useState<string | null>(null);

  // Sort topics by count primarily, and urgency secondarily
  const sortedTopics = [...topics].sort((a, b) => {
    if (b.count === a.count) {
      return b.urgency - a.urgency;
    }
    return b.count - a.count;
  });

  // Calculate statistics
  const totalPosts = sortedTopics.reduce((sum, topic) => sum + topic.count, 0);
  const maxCount = Math.max(...sortedTopics.map(t => t.count), 1);
  const avgUrgency = sortedTopics.reduce((sum, t) => sum + t.urgency, 0) / sortedTopics.length;
  const highUrgencyTopics = sortedTopics.filter(t => t.urgency > 70).length;

  const getUrgencyColor = (urgency: number) => {
    if (urgency > 70) return { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' };
    if (urgency > 40) return { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' };
    return { bg: '#d1fae5', border: '#10b981', text: '#065f46' };
  };

  const getUrgencyLabel = (urgency: number) => {
    if (urgency > 70) return 'High';
    if (urgency > 40) return 'Medium';
    return 'Low';
  };

  return (
    <Card className="shadow-lg rounded-xl border border-gray-200 bg-white overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50 pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">Popular Topics</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Most discussed topics by citizens</p>
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <MessageSquare className="h-4 w-4 text-blue-600" />
              <span className="text-xs font-medium text-gray-600">Total Posts</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalPosts.toLocaleString()}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-xs font-medium text-gray-600">Avg Urgency</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{avgUrgency.toFixed(0)}%</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-red-600" />
              <span className="text-xs font-medium text-gray-600">High Priority</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{highUrgencyTopics}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          {sortedTopics.map((topic, index) => {
            const percentage = (topic.count / maxCount) * 100;
            const colors = getUrgencyColor(topic.urgency);
            const imageUrl = topicImages[topic.name] || "/default_topic.png";
            const isHovered = hoveredTopic === topic.name;

            return (
              <motion.div
                key={topic.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                onMouseEnter={() => setHoveredTopic(topic.name)}
                onMouseLeave={() => setHoveredTopic(null)}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isHovered ? 'scale-[1.02]' : ''
                }`}
              >
                {/* Rank Badge */}
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' :
                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-white' :
                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-white' :
                    'bg-gradient-to-br from-blue-100 to-blue-200 text-blue-800'
                  }`}>
                    {index + 1}
                  </div>
                </div>

                <div
                  className={`ml-6 rounded-xl p-4 transition-all duration-300 ${
                    isHovered
                      ? 'shadow-xl bg-gradient-to-r from-purple-50 to-blue-50'
                      : 'shadow-md bg-white hover:shadow-lg'
                  }`}
                  style={{
                    borderLeft: `4px solid ${colors.border}`,
                  }}
                >
                  <div className="flex items-start gap-4">
                    {/* Topic Image */}
                    <div className="flex-shrink-0">
                      <div className={`w-16 h-16 rounded-lg overflow-hidden ring-2 transition-all duration-300 ${
                        isHovered ? 'ring-purple-400 ring-offset-2' : 'ring-gray-200'
                      }`}>
                        <img
                          src={imageUrl}
                          alt={topic.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{topic.name}</h3>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="font-semibold text-gray-700">{topic.count} posts</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{((topic.count / totalPosts) * 100).toFixed(1)}% of total</span>
                          </div>
                        </div>

                        {/* Urgency Badge */}
                        <div
                          className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            border: `1px solid ${colors.border}`,
                          }}
                        >
                          {getUrgencyLabel(topic.urgency)} ({topic.urgency}%)
                        </div>
                      </div>

                      {/* Horizontal Bar Chart */}
                      <div className="mt-3">
                        <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
                          {/* Background grid lines */}
                          <div className="absolute inset-0 flex">
                            {[20, 40, 60, 80].map(mark => (
                              <div
                                key={mark}
                                className="border-r border-gray-200"
                                style={{ marginLeft: `${mark}%` }}
                              />
                            ))}
                          </div>

                          {/* Animated bar */}
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.05, ease: "easeOut" }}
                            className="absolute top-0 left-0 h-full rounded-full shadow-inner"
                            style={{
                              background: `linear-gradient(90deg, ${colors.border}, ${colors.border}dd)`,
                            }}
                          >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                          </motion.div>

                          {/* Percentage label */}
                          {percentage > 15 && (
                            <div className="absolute inset-0 flex items-center justify-end pr-3">
                              <span className="text-xs font-bold text-white drop-shadow-md">
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Scale markers */}
                        <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                          <span>0</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                      </div>

                      {/* Details on hover */}
                      {isHovered && topic.details && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <p className="text-sm text-gray-700">{topic.details}</p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sortedTopics.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No topics data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
