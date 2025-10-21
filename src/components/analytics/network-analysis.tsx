// src/components/analytics/network-analysis.tsx
'use client';

import { X } from 'lucide-react';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide, forceManyBody } from 'd3-force';
import { Card, CardContent } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AnalyticsData } from '@/types/analytics';

// Types
interface NetworkData {
  nodes: Array<{
    id: string;
    label: string;
    type: string;
    weight?: number;
    cluster?: number;
  }>;
  links: Array<{
    source: string;
    target: string;
    value?: number;
  }>;
  meta: {
    region: string;
    totalNodes: number;
    totalEdges: number;
  };
}

interface Tweet {
  username: string;
  full_text: string;
  date: string;
  topic_classification: string;
  sentiment: string;
  urgency_level: number;
  target_audience: string[];
  link_post?: string;
  mentions: string[];
  hastags: string[];
  relation_type: 'author' | 'mentioned' | 'hashtag' | 'unknown';
}

interface Summary {
  main_issue: string;
  problem: string;
  suggestion: string;
  urgency_score: string;
}

interface NetworkAnalysisProps {
  data?: AnalyticsData | null;
}

// Constants and Helpers
const initialGraphData: NetworkData = {
  nodes: [],
  links: [],
  meta: { region: '', totalNodes: 0, totalEdges: 0 },
};

const regions = [
  "All Data",
  "DKI Jakarta",
  "East Jakarta",
  "Central Jakarta",
  "North Jakarta",
  "West Jakarta",
  "South Jakarta"
];

const getNodeColorByType = (type: string) => {
  switch (type) {
    case 'user':
      return '#6366f1';
    case 'hashtag':
      return '#22c55e';
    case 'mention':
      return '#ef4444';
    default:
      return '#94a3b8';
  }
};

const formatPostsForSummary = (posts: Tweet[]) => {
  return posts.map(post => ({
    full_text: post.full_text,
    contextual_content: `Post ini dari ${post.username} dengan topik ${post.topic_classification} dan sentiment ${post.sentiment}`
  }));
};

// Helper function to render formatted text with bold and lists
const renderFormattedText = (text: string) => {
  if (!text) return null;

  // Split text into lines and process each line
  const lines = text.split('\n').filter(line => line.trim());

  return (
    <div className="space-y-2.5">
      {lines.map((line, lineIndex) => {
        const trimmedLine = line.trim();

        // Check if it's a numbered list item (1. 2. 3. etc.)
        const numberMatch = trimmedLine.match(/^(\d+)\.\s+(.+)$/);

        if (numberMatch) {
          const number = numberMatch[1];
          const content = numberMatch[2];

          // Parse bold text within the content (**text**)
          const parts = [];
          let lastIndex = 0;
          const boldRegex = /\*\*([^*]+)\*\*/g;
          let match;

          while ((match = boldRegex.exec(content)) !== null) {
            // Add text before the bold part
            if (match.index > lastIndex) {
              parts.push({
                type: 'text',
                content: content.substring(lastIndex, match.index)
              });
            }
            // Add bold part
            parts.push({
              type: 'bold',
              content: match[1]
            });
            lastIndex = match.index + match[0].length;
          }

          // Add remaining text after the last bold part
          if (lastIndex < content.length) {
            parts.push({
              type: 'text',
              content: content.substring(lastIndex)
            });
          }

          return (
            <div key={lineIndex} className="flex gap-2.5 items-start pl-1">
              <span className="font-bold text-gray-900 flex-shrink-0 mt-0.5">{number}.</span>
              <div className="flex-1 text-sm text-gray-700">
                {parts.map((part, partIndex) => {
                  if (part.type === 'bold') {
                    return (
                      <strong key={partIndex} className="font-bold text-gray-900">
                        {part.content}
                      </strong>
                    );
                  }
                  return <span key={partIndex}>{part.content}</span>;
                })}
              </div>
            </div>
          );
        }

        // Regular paragraph with bold support
        const parts = [];
        let lastIndex = 0;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let match;

        while ((match = boldRegex.exec(trimmedLine)) !== null) {
          // Add text before the bold part
          if (match.index > lastIndex) {
            parts.push({
              type: 'text',
              content: trimmedLine.substring(lastIndex, match.index)
            });
          }
          // Add bold part
          parts.push({
            type: 'bold',
            content: match[1]
          });
          lastIndex = match.index + match[0].length;
        }

        // Add remaining text after the last bold part
        if (lastIndex < trimmedLine.length) {
          parts.push({
            type: 'text',
            content: trimmedLine.substring(lastIndex)
          });
        }

        // If no parts were created, just return the plain text
        if (parts.length === 0) {
          return (
            <p key={lineIndex} className="text-sm text-gray-700">
              {trimmedLine}
            </p>
          );
        }

        return (
          <p key={lineIndex} className="text-sm text-gray-700">
            {parts.map((part, partIndex) => {
              if (part.type === 'bold') {
                return (
                  <strong key={partIndex} className="font-bold text-gray-900">
                    {part.content}
                  </strong>
                );
              }
              return <span key={partIndex}>{part.content}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
};
export function NetworkAnalysis({ data }: NetworkAnalysisProps) {
  // State declarations
  const [graphData, setGraphData] = useState<NetworkData>(initialGraphData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("All Data");
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [nodeDetails, setNodeDetails] = useState<Tweet[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  
  const forceRef = useRef<any>(null);
  const fetchInProgress = useRef(false);
  const forceInitialized = useRef(false);

  // Callbacks
  const getNodeColor = useCallback((node: any) => {
    return getNodeColorByType(node.type);
  }, []);

  const fetchNetworkData = useCallback(async () => {
    if (fetchInProgress.current) return;

    try {
      fetchInProgress.current = true;
      forceInitialized.current = false; // Reset force initialization flag
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/network?region=${encodeURIComponent(selectedRegion)}`);

      if (!response.ok) throw new Error('Failed to fetch network data');

      const responseData = await response.json();

      setGraphData({
        nodes: responseData.nodes.map((node: any) => ({
          id: node.id,
          label: node.data.label,
          type: node.type,
          weight: node.data.weight || 1,
          size: 8
        })),
        links: responseData.edges.map((edge: any) => ({
          source: edge.source,
          target: edge.target,
          value: 20,
          distance: 60
        })),
        meta: responseData.meta
      });
    } catch (err) {
      console.error('Error fetching network data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
      fetchInProgress.current = false;
    }
  }, [selectedRegion]);

  const onNodeClick = useCallback(async (node: any) => {
    if (!node?.label) return;

    try {
      setDetailsLoading(true);
      setSelectedNode(node.label);
      setIsDetailOpen(true);
      setSummary(null);
      setSummaryLoading(true);
      
      const response = await fetch(`/api/analytics/user-tweets?username=${encodeURIComponent(node.label)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }

      const data = await response.json();
      if (!Array.isArray(data.tweets)) {
        throw new Error('Invalid posts data format');
      }

      const sortedPosts = [...data.tweets].sort((a, b) => b.urgency_level - a.urgency_level);
      setNodeDetails(sortedPosts);

      try {
        const top20Posts = sortedPosts.slice(0, 20);
        const formattedPosts = formatPostsForSummary(top20Posts);

        const summaryResponse = (await Promise.race([
          fetch('/api/gemini/summarize', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ search_results: formattedPosts })
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 30000))
        ])) as Response;

        if (summaryResponse.ok) {
          const summaryData = await summaryResponse.json();
          if (summaryData.summary) {
            setSummary(summaryData.summary);
          }
        } else {
          console.error('Summary API returned error:', summaryResponse.status);
        }
      } catch (summaryError) {
        console.error('Error fetching summary:', summaryError);
        if (summaryError instanceof Error) {
          console.error('Summary Error details:', summaryError.message);
        }
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setNodeDetails([]);
    } finally {
      setDetailsLoading(false);
      setSummaryLoading(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedNode(null);
    setNodeDetails([]);
    setSummary(null);
  }, []);

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    // Smaller node size: 1.5x instead of 2.5x
    const size = Math.max(3, (node.weight || 1) * 1.5);
    const color = getNodeColorByType(node.type);

    // Draw node circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Add glow effect for high-weight nodes
    if (node.weight > 5) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(node.x, node.y, size + 1.5, 0, 2 * Math.PI);
      ctx.strokeStyle = color + '30';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Show label for important nodes (weight > 7 for less clutter)
    if (node.weight > 7) {
      const label = node.label;
      const fontSize = Math.min(12, 8 + node.weight / 3) / globalScale;
      ctx.font = `600 ${fontSize}px Sans-Serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.3);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
      ctx.shadowBlur = 3;
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        bckgDimensions[0],
        bckgDimensions[1]
      );
      ctx.shadowBlur = 0;

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillText(label, node.x, node.y);
    }
  }, []);

  const linkColor = useCallback(() => 'rgba(200, 200, 200, 0.3)', []); // More transparent

  const nodeLabel = useCallback((node: any) => node.label, []);

  const onEngineStop = useCallback(() => {
    if (forceRef.current) {
      forceRef.current.zoomToFit(400);
    }
  }, []);
  // Effects
  useEffect(() => {
    if (selectedRegion) {
      fetchNetworkData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion]);

  useEffect(() => {
    if (forceRef.current && graphData.nodes.length > 0 && !forceInitialized.current) {
      // Enhanced force simulation for independent clusters

      // Collision force - smaller radius for tighter clustering
      forceRef.current.d3Force('collide', forceCollide((node: any) => {
        const baseRadius = (node.weight || 1) * 2.5;
        return baseRadius;
      }).strength(0.9));

      // Charge force - STRONGER repulsion to separate clusters
      forceRef.current.d3Force('charge', forceManyBody()
        .strength((node: any) => {
          // Much stronger repulsion for cluster separation
          return -500 - (node.weight || 1) * 30;
        })
        .distanceMax(600)
      );

      // Cluster force - STRONGER pull to cluster centers with LARGER radius
      forceRef.current.d3Force('cluster', () => {
        const alpha = 0.5; // Stronger clustering force
        graphData.nodes.forEach((node: any) => {
          const cluster = node.cluster || 0;
          // Calculate cluster center with LARGER radius for better separation
          const angle = (cluster / 5) * 2 * Math.PI;
          const radius = 400; // Increased from 250 to 400
          const centerX = 600 + Math.cos(angle) * radius;
          const centerY = 400 + Math.sin(angle) * radius;

          // Pull nodes toward their cluster center
          node.vx -= (node.x - centerX) * alpha;
          node.vy -= (node.y - centerY) * alpha;
        });
      });

      // Link force - WEAKER strength for independent clusters
      forceRef.current.d3Force('link')
        .distance((link: any) => {
          const sourceNode = graphData.nodes.find((n: any) => n.id === link.source.id || n.id === link.source);
          const targetNode = graphData.nodes.find((n: any) => n.id === link.target.id || n.id === link.target);

          // Much shorter distance within cluster, very long distance between clusters
          if (sourceNode?.cluster === targetNode?.cluster) {
            return 30; // Tighter within cluster
          }
          return 200; // Much longer between clusters for independence
        })
        .strength((link: any) => {
          const sourceNode = graphData.nodes.find((n: any) => n.id === link.source.id || n.id === link.source);
          const targetNode = graphData.nodes.find((n: any) => n.id === link.target.id || n.id === link.target);

          // Weak link strength between different clusters
          if (sourceNode?.cluster === targetNode?.cluster) {
            return 0.4; // Normal strength within cluster
          }
          return 0.05; // Very weak strength between clusters
        });

      forceInitialized.current = true;
    }
  }, [graphData.nodes.length]); // FIXED: Remove graphData from dependencies

  // Render Methods
  const renderDetailsPanel = () => (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">
            {selectedNode ? `TikTok Posts related to ${selectedNode}` : 'Post Details'}
          </h3>
          <button
            onClick={closeDetails}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          {/* Summary Section */}
          {summaryLoading ? (
            <div className="mb-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <p className="text-center text-blue-700 font-medium">Generating AI summary from top 20 most urgent posts...</p>
              </div>
            </div>
          ) : summary ? (
            <div className="mb-4 p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-bold text-lg text-gray-900">AI Summary Analysis</h4>
                <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  Based on Top 20 Urgent Posts
                </span>
              </div>

              <div className="space-y-4">
                {/* Main Issue */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <h5 className="font-semibold text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    Main Issue
                  </h5>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {renderFormattedText(summary.main_issue)}
                  </div>
                </div>

                {/* Problem */}
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
                  <h5 className="font-semibold text-sm text-orange-900 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Problem Details
                  </h5>
                  <div className="text-sm text-gray-800 leading-relaxed">
                    {renderFormattedText(summary.problem)}
                  </div>
                </div>

                {/* Suggestion */}
                {summary.suggestion && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                    <h5 className="font-semibold text-sm text-green-900 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Recommended Actions
                    </h5>
                    <div className="text-sm text-gray-800 leading-relaxed">
                      {renderFormattedText(summary.suggestion)}
                    </div>
                  </div>
                )}

                {/* Urgency Score */}
                <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-semibold text-sm text-gray-900">Urgency Level:</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          parseInt(summary.urgency_score) > 75 ? 'bg-red-500' :
                          parseInt(summary.urgency_score) > 50 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${summary.urgency_score}%` }}
                      />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                      parseInt(summary.urgency_score) > 75 ? 'bg-red-100 text-red-800' :
                      parseInt(summary.urgency_score) > 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {summary.urgency_score}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : nodeDetails.length > 0 ? (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">
                  AI Summary service is temporarily unavailable. Showing posts ordered by urgency.
                </span>
              </div>
            </div>
          ) : null}

          {/* Posts List */}
          {detailsLoading ? (
            <div className="flex items-center justify-center h-[200px]">
              <Loading variant="pulse" size="sm" fullScreen={false} message="Loading posts..." />
            </div>
          ) : nodeDetails.length === 0 ? (
            <p className="text-gray-500">No posts found for {selectedNode}</p>
          ) : (
            <div className="space-y-4">
              {[...nodeDetails]
                .sort((a, b) => b.urgency_level - a.urgency_level)
                .map((tweet, index) => (
                  <Card key={index} className={`p-4 border ${index < 20 ? 'border-yellow-200 bg-yellow-50' : ''}`}>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{tweet.username}</span>
                        <div className="flex items-center gap-2">
                          {index < 20 && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              Top 20 Urgent
                            </span>
                          )}
                          <span className="text-gray-500 text-sm">
                            {new Date(tweet.date).toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm">{tweet.full_text}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className={`px-2 py-1 rounded ${
                          tweet.sentiment === 'Positive' ? 'bg-green-100' :
                          tweet.sentiment === 'Negative' ? 'bg-red-100' : 'bg-gray-100'
                        }`}>
                          {tweet.sentiment}
                        </span>
                        <span className="px-2 py-1 rounded bg-blue-100">
                          {tweet.topic_classification}
                        </span>
                        <span className="px-2 py-1 rounded bg-yellow-100">
                          Urgency: {tweet.urgency_level}
                        </span>
                        {/* <span className={`px-2 py-1 rounded ${
                          tweet.relation_type === 'author' ? 'bg-purple-100' :
                          tweet.relation_type === 'mentioned' ? 'bg-indigo-100' :
                          'bg-pink-100'
                        }`}>
                          {tweet.relation_type}
                        </span> */}
                      </div>
                      {(tweet.mentions.length > 0 || tweet.hastags.length > 0) && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          {tweet.mentions.map((mention, idx) => (
                            <span key={idx} className="text-blue-600">{mention}</span>
                          ))}
                          {tweet.hastags.map((hashtag, idx) => (
                            <span key={idx} className="text-green-600">{hashtag}</span>
                          ))}
                        </div>
                      )}
                      {tweet.link_post && (
                        <a
                          href={tweet.link_post}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          View on TikTok
                        </a>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  // Main render
  return (
    <div className={`flex gap-4 h-[800px] ${isDetailOpen ? 'pr-[0px]' : ''}`}>
      <div className="w-full">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Cluster Legend */}
                <div className="flex gap-3 items-center text-xs">
                  <span className="font-semibold">Clusters:</span>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span>Users</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span>Hashtags</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span>Mentions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Nodes: {graphData.meta.totalNodes} | Edges: {graphData.meta.totalEdges}
              </div>
            </div>

            <div className="h-[700px] bg-white">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <Loading variant="pulse" size="md" fullScreen={false} message="Loading network data..." />
                </div>
              ) : error ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-lg text-red-500">{error}</div>
                </div>
              ) : (
                <ForceGraph2D
                  ref={forceRef}
                  graphData={graphData}
                  nodeColor={getNodeColor}
                  nodeRelSize={8}
                  nodeLabel={nodeLabel}
                  linkColor={linkColor}
                  linkWidth={0.8}
                  nodeCanvasObject={nodeCanvasObject}
                  onNodeClick={onNodeClick}
                  cooldownTicks={250}
                  onEngineStop={onEngineStop}
                  enableNodeDrag={true}
                  enableZoomInteraction={true}
                  linkDirectionalParticles={2}
                  linkDirectionalParticleWidth={1.5}
                  linkDirectionalParticleSpeed={0.002}
                  d3AlphaDecay={0.015}
                  d3VelocityDecay={0.15}
                  warmupTicks={100}
                  width={1200}
                  height={700}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details Panel */}
      <div 
        className={`fixed right-0 top-12 h-full w-[400px] bg-white shadow-lg transform transition-transform duration-300 ${
          isDetailOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {renderDetailsPanel()}
      </div>
    </div>
  );
}