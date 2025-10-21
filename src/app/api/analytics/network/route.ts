// src/app/api/analytics/network/route.ts
import { NextResponse } from 'next/server';
import type { Node, Edge } from 'reactflow';
import { getTikTokCollection } from '@/lib/mongodb';
import { enhancedTikTokPosts } from '@/lib/enhancedDummyData';

// Check if we should use dummy data
const USE_DUMMY_DATA = process.env.USE_DUMMY_DATA === 'true' || process.env.NEXT_PUBLIC_USE_DUMMY_DATA === 'true';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region') || 'Jakarta Pusat';

    let docs: any[];

    if (USE_DUMMY_DATA) {
      // Use enhanced dummy data
      console.log('🎭 Using enhanced dummy data for network analytics');

      const last17Days = new Date(Date.now() - 17 * 24 * 60 * 60 * 1000);

      docs = enhancedTikTokPosts.filter(doc => {
        const docDate = new Date(doc.post_created_at);
        const hasHashtagsOrMentions = (doc.post_hashtags && doc.post_hashtags.length > 0) ||
                                      (doc.post_mentions && doc.post_mentions.length > 0);
        const inDateRange = docDate >= last17Days;
        const matchesRegion = region === 'All Data' || doc.affected_region === region;

        return hasHashtagsOrMentions && inDateRange && matchesRegion;
      }).slice(0, 10000);
    } else {
      const collection = await getTikTokCollection();

      // Build query
      const query: any = {
        post_created_at: {
          $gte: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000).toISOString(),
          $lte: new Date().toISOString()
        },
        $or: [
          { post_hashtags: { $exists: true, $ne: null } },
          { post_mentions: { $exists: true, $ne: null } }
        ]
      };

      // Add region filter if not "All Data"
      if (region !== 'All Data') {
        query.affected_region = region;
      }

      // Fetch documents
      docs = await collection
        .find(query)
        .sort({ post_created_at: -1 })
        .limit(10000)
        .toArray();
    }

    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeMap = new Map(); // Stores nodes and connection counts
    const edgeSet = new Set(); // Prevent duplicate edges

    // Helper function to add a unique node with connection count tracking
    const addNode = (id: string, label: string, type: string) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, { label, type, connections: 0 });
      }
    };

    // Helper function to add a unique edge and update connection count for nodes
    const addEdge = (source: string, target: string, type: string) => {
      const edgeId = `${source}-${target}-${type}`;
      if (!edgeSet.has(edgeId)) {
        edges.push({
          id: edgeId,
          source,
          target,
          animated: true,
          style: {
            stroke: type === 'hashtag' ? '#22c55e' : '#ef4444'
          }
        });
        edgeSet.add(edgeId);

        // Increment connection counts for source and target nodes
        if (nodeMap.has(source)) nodeMap.get(source).connections += 1;
        if (nodeMap.has(target)) nodeMap.get(target).connections += 1;
      }
    };

    // Helper to parse array fields
    const parseArray = (field: any): string[] => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === 'string') {
        try {
          const parsed = JSON.parse(field);
          return Array.isArray(parsed) ? parsed : [field];
        } catch {
          return [field];
        }
      }
      return [];
    };

    // Process posts
    docs.forEach((doc: any) => {
      // Add user node
      const userId = `user-${doc.username}`;
      addNode(userId, doc.username, 'user');

      // Process hashtags and create edges
      const hashtags = parseArray(doc.post_hashtags);
      hashtags.forEach((hashtag: string) => {
        if (hashtag) {
          const hashtagId = `hashtag-${hashtag}`;
          addNode(hashtagId, hashtag, 'hashtag');
          addEdge(userId, hashtagId, 'hashtag');
        }
      });

      // Process mentions and create edges
      const mentions = parseArray(doc.post_mentions);
      mentions.forEach((mention: string) => {
        if (mention) {
          const mentionId = `mention-${mention}`;
          addNode(mentionId, mention, 'mention');
          addEdge(userId, mentionId, 'mention');
        }
      });
    });

    // Group nodes by topic/cluster for better visualization
    const clusterMap = new Map();
    const topicClusters = [
      'Infrastructure and Transportation',
      'Environment and Disaster',
      'Safety and Crime',
      'Government and Public Policy',
      'Social and Economy'
    ];

    // Assign clusters based on hashtag/mention content
    const assignCluster = (label: string): number => {
      const lowerLabel = label.toLowerCase();
      if (lowerLabel.includes('macet') || lowerLabel.includes('transjakarta') || lowerLabel.includes('mrt')) return 0;
      if (lowerLabel.includes('banjir') || lowerLabel.includes('polusi') || lowerLabel.includes('bpbd') || lowerLabel.includes('lingkungan')) return 1;
      if (lowerLabel.includes('penjambretan') || lowerLabel.includes('polres') || lowerLabel.includes('keamanan')) return 2;
      if (lowerLabel.includes('dukcapil') || lowerLabel.includes('imb') || lowerLabel.includes('dkijakarta')) return 3;
      if (lowerLabel.includes('harga') || lowerLabel.includes('cabai') || lowerLabel.includes('pasar') || lowerLabel.includes('umkm')) return 4;
      return Math.floor(Math.random() * 5); // Random cluster for generic nodes
    };

    // Transform nodeMap to nodes array with weights and cluster assignments
    nodeMap.forEach((value, id) => {
      const weight = Math.min(10, value.connections + 1); // Limit max weight to 10 for visualization
      const cluster = assignCluster(value.label);

      // Store cluster info
      if (!clusterMap.has(cluster)) {
        clusterMap.set(cluster, []);
      }
      clusterMap.get(cluster).push(id);

      nodes.push({
        id,
        type: value.type,
        position: {
          x: Math.random() * 1200,
          y: Math.random() * 800
        },
        data: {
          label: value.label,
          type: value.type,
          weight,
          cluster
        },
        style: {
          background: value.type === 'user' ? '#6366f1' :
                     value.type === 'hashtag' ? '#22c55e' : '#ef4444',
          color: 'white',
          padding: '5px',
          borderRadius: '3px',
          fontSize: '10px',
          width: 'auto',
          minWidth: '80px',
          maxWidth: '120px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          cursor: 'pointer'
        }
      });
    });

    return NextResponse.json({
      nodes,
      edges,
      meta: {
        region,
        totalNodes: nodes.length,
        totalEdges: edges.length
      }
    });

  } catch (error) {
    console.error('Network analysis error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch network data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
