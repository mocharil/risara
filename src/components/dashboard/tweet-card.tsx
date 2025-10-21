"use client";

// src/components/dashboard/tweet-card.tsx
import { Card } from "@/components/ui/card";
import {
  MessageSquare,
  Heart,
  Repeat2,
  Eye,
  AlertTriangle,
  Users,
  MapPin,
  ExternalLink,
  Tag
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";

interface TweetItem {
  _source: {
    post_id: string;
    post_caption: string;
    link_post: string;
    post_media_link?: string[] | string;
    username: string;
    name: string;
    post_created_at: string;
    sentiment: string;
    topic: string;
    urgency_level: number; // 0-100
    issue: string;
    region: string;
    likes: number;
    retweets: number;
    replies: number;
    views: number;
    post_hashtags?: string[] | string;
    post_mentions?: string[] | string;
  };
}

export function TweetCard({ item }: { item: TweetItem }) {
  const {
    post_caption,
    link_post,
    post_media_link: rawMediaLink,
    username,
    name,
    post_created_at,
    sentiment,
    topic,
    urgency_level = 0, // 0-100
    issue,
    region,
    likes = 0,
    retweets = 0,
    replies = 0,
    views = 0,
    post_hashtags: rawHashtags = [],
    post_mentions: rawMentions = [],
  } = item._source;

  // Helper function to parse array fields
  const parseArrayField = (field: any): string[] => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === 'string') {
      try {
        // Handle Python-style array strings like "['url1', 'url2']"
        let cleanedField = field.trim();

        if (cleanedField.startsWith("['") && cleanedField.endsWith("']")) {
          // Replace single quotes with double quotes for JSON parsing
          cleanedField = cleanedField
            .replace(/\['/g, '["')
            .replace(/'\]/g, '"]')
            .replace(/', '/g, '", "')
            .replace(/','/g, '","');
        }

        const parsed = JSON.parse(cleanedField);
        return Array.isArray(parsed) ? parsed : [cleanedField];
      } catch {
        // If parsing fails, try to extract URLs using regex
        const urlPattern = /(https?:\/\/[^\s'"]+)/g;
        const urls = field.match(urlPattern);
        if (urls && urls.length > 0) {
          return urls;
        }
        return [field];
      }
    }
    return [];
  };

  // Parse post_media_link if it's a string
  const post_media_link = useMemo(() => parseArrayField(rawMediaLink), [rawMediaLink]);
  const post_hashtags = useMemo(() => parseArrayField(rawHashtags), [rawHashtags]);
  const post_mentions = useMemo(() => parseArrayField(rawMentions), [rawMentions]);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const getSentimentColor = (sentiment: string) => {
    const lowerSentiment = sentiment?.toLowerCase();
    const sentimentMap = {
      'positive': 'bg-green-100 text-green-800 border-green-200',
      'negative': 'bg-red-100 text-red-800 border-red-200',
      'neutral': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return sentimentMap[lowerSentiment as keyof typeof sentimentMap] || sentimentMap.neutral;
  };

  const getUrgencyColor = (level: number) => {
    // level is 0-100
    if (level >= 80) return 'bg-red-100 text-red-800 border-red-200';
    if (level >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const getMediaGridClass = (count: number) => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-2";
    if (count === 3) return "grid-cols-2";
    return "grid-cols-2";
  };

  const goToPrevious = () => {
    if (post_media_link && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (post_media_link && currentImageIndex < post_media_link.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [lightboxOpen, currentImageIndex, post_media_link]);

  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="p-3 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-start gap-2 mb-2">
          {/* Profile Image */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img
              src={(post_media_link && post_media_link.length > 0 ? post_media_link[0] : null) || "/risara.png"}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/risara.png";
              }}
            />
          </div>

          {/* User Info & Date */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">{name}</h3>
                <p className="text-sm text-gray-500">{username}</p>
              </div>
              <a
                href={link_post}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Tweet Content */}
        <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap line-clamp-3">{post_caption}</p>

        {/* Media Gallery */}
        {post_media_link && post_media_link.length > 0 && (
          <div className={cn(
            "grid gap-1 mb-3 rounded-xl overflow-hidden max-w-md",
            getMediaGridClass(post_media_link.length)
          )}>
            {post_media_link.slice(0, 4).map((imageUrl, index) => (
              <div
                key={index}
                className={cn(
                  "relative cursor-pointer overflow-hidden bg-gray-100 hover:opacity-90 transition-opacity",
                  post_media_link.length === 1 ? "aspect-video max-h-[200px]" : "aspect-video max-h-[120px]",
                  post_media_link.length === 3 && index === 0 ? "row-span-2 max-h-[244px]" : ""
                )}
                onClick={() => openLightbox(index)}
              >
                <img
                  src={imageUrl}
                  alt={`Media ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/risara.png";
                  }}
                />
                {post_media_link.length > 4 && index === 3 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">
                      +{post_media_link.length - 4}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Metrics */}
        <div className="flex items-center gap-3 mb-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3" />
            <span>{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Repeat2 className="h-3 w-3" />
            <span>{retweets.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{replies.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{views.toLocaleString()}</span>
          </div>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
          {/* Topic */}
          <Badge variant="outline" className="flex items-center gap-0.5 justify-center text-xs py-0.5 px-1.5">
            <Tag className="h-2.5 w-2.5" />
            <span className="truncate text-xs">{topic}</span>
          </Badge>

          {/* Sentiment */}
          <Badge
            variant="outline"
            className={cn("flex items-center gap-0.5 justify-center text-xs py-0.5 px-1.5", getSentimentColor(sentiment))}
          >
            <span className="text-xs">{sentiment?.toLowerCase() === 'positive' && '😊'}{sentiment?.toLowerCase() === 'negative' && '😞'}{sentiment?.toLowerCase() === 'neutral' && '😐'}</span>
            <span className="capitalize text-xs">{sentiment}</span>
          </Badge>

          {/* Urgency Level */}
          <Badge
            variant="outline"
            className={cn("flex items-center gap-0.5 justify-center text-xs py-0.5 px-1.5", getUrgencyColor(urgency_level))}
          >
            <AlertTriangle className="h-2.5 w-2.5" />
            <span className="text-xs">{urgency_level}%</span>
          </Badge>

          {/* Region */}
          <Badge variant="outline" className="flex items-center gap-0.5 justify-center text-xs py-0.5 px-1.5">
            <MapPin className="h-2.5 w-2.5" />
            <span className="truncate text-xs">{region}</span>
          </Badge>
        </div>

        {/* Additional Metadata */}
        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="truncate text-xs">{issue}</span>
          </div>
          <time className="text-xs">
            {new Date(post_created_at).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        </div>
      </Card>

      {/* Lightbox Modal */}
      {lightboxOpen && post_media_link && post_media_link.length > 0 && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-2"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full z-20">
              <span className="text-sm font-medium">
                {currentImageIndex + 1} / {post_media_link.length}
              </span>
            </div>

            {/* Previous Button */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {/* Next Button */}
            {currentImageIndex < post_media_link.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 text-white hover:text-gray-300 z-20 bg-black bg-opacity-50 rounded-full p-3 hover:bg-opacity-70 transition-all"
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}

            {/* Image */}
            <div className="relative max-w-7xl max-h-full">
              <img
                src={post_media_link[currentImageIndex]}
                alt={`Image ${currentImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}