// src/components/analytics/VisNetworkGraph.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';

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
  }>;
  meta: {
    region: string;
    totalNodes: number;
    totalEdges: number;
  };
}

interface VisNetworkGraphProps {
  graphData: NetworkData;
  onNodeClick?: (nodeId: string, nodeLabel: string) => void;
}

const getNodeColorByType = (type: string) => {
  switch (type) {
    case 'user':
      return '#6366f1'; // Blue
    case 'hashtag':
      return '#22c55e'; // Green
    case 'mention':
      return '#ef4444'; // Red
    default:
      return '#94a3b8'; // Gray
  }
};

export const VisNetworkGraph: React.FC<VisNetworkGraphProps> = ({
  graphData,
  onNodeClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || !graphData || graphData.nodes.length === 0) {
      return;
    }

    // Clean up previous network
    if (networkRef.current) {
      networkRef.current.destroy();
    }

    // Transform data for vis-network
    const nodes = new DataSet(
      graphData.nodes.map(node => ({
        id: node.id,
        label: node.label,
        title: `${node.label} (${node.type})`, // Tooltip
        color: {
          background: getNodeColorByType(node.type),
          border: getNodeColorByType(node.type),
          highlight: {
            background: getNodeColorByType(node.type),
            border: '#000000',
          },
          hover: {
            background: getNodeColorByType(node.type),
            border: '#000000',
          }
        },
        size: Math.max(10, (node.weight || 1) * 3),
        font: {
          size: node.weight && node.weight > 7 ? 14 : 0, // Only show label for important nodes
          color: '#ffffff',
          background: 'rgba(0,0,0,0.7)',
        },
        value: node.weight || 1, // For physics
      }))
    );

    const edges = new DataSet(
      graphData.links.map((link, index) => ({
        id: `edge-${index}`,
        from: link.source,
        to: link.target,
        color: {
          color: 'rgba(200, 200, 200, 0.3)',
          highlight: 'rgba(100, 100, 100, 0.6)',
          hover: 'rgba(100, 100, 100, 0.6)',
        },
        width: 1,
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5,
        },
      }))
    );

    // Network options
    const options = {
      nodes: {
        shape: 'dot',
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.2)',
          size: 10,
          x: 2,
          y: 2,
        },
      },
      edges: {
        width: 1,
        arrows: {
          to: {
            enabled: false,
          },
        },
        smooth: {
          enabled: true,
          type: 'continuous',
          roundness: 0.5,
        },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 95,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.5,
        },
        stabilization: {
          enabled: true,
          iterations: 1000,
          updateInterval: 25,
          onlyDynamicEdges: false,
          fit: true,
        },
        maxVelocity: 50,
        minVelocity: 0.1,
        solver: 'barnesHut',
        timestep: 0.5,
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
        dragNodes: true,
        dragView: true,
        zoomView: true,
        navigationButtons: true,
        keyboard: {
          enabled: true,
          bindToWindow: false,
        },
      },
      layout: {
        improvedLayout: true,
        clusterThreshold: 150,
      },
    };

    // Create network
    const network = new Network(containerRef.current, { nodes, edges }, options);
    networkRef.current = network;

    // Event listeners
    network.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (node && onNodeClick) {
          onNodeClick(nodeId, node.label);
        }
      }
    });

    // Fit network after stabilization
    network.once('stabilizationIterationsDone', () => {
      network.fit({
        animation: {
          duration: 1000,
          easingFunction: 'easeInOutQuad',
        },
      });
    });

    // Stop physics after stabilization to improve performance
    network.on('stabilizationIterationsDone', () => {
      network.setOptions({ physics: false });
    });

  }, [graphData, onNodeClick, isClient]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading network visualization...</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{
        width: '100%',
        height: '700px',
        background: '#ffffff',
        borderRadius: '8px',
      }}
    />
  );
};

export default VisNetworkGraph;
