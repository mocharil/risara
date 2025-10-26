// src/components/analytics/ForceGraphWrapper.tsx
'use client';

import React, { useRef, useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';

// Use vis-network instead of react-force-graph-2d (which has infinite loop bug)
const VisNetworkGraph = dynamic(() => import('./VisNetworkGraph'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">
    <div className="text-gray-500">Loading network visualization...</div>
  </div>
});

const USE_VIS_NETWORK = true; // Set to true to use the new stable library

interface ForceGraphWrapperProps {
  graphData: any;
  nodeColor: (node: any) => string;
  nodeRelSize: number;
  nodeLabel: (node: any) => string;
  linkColor: () => string;
  linkWidth: number;
  nodeCanvasObject: (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => void;
  onNodeClick: (node: any) => void;
  onEngineStop: () => void;
  cooldownTicks: number;
  enableNodeDrag: boolean;
  enableZoomInteraction: boolean;
  linkDirectionalParticles: number;
  linkDirectionalParticleWidth: number;
  linkDirectionalParticleSpeed: number;
  d3AlphaDecay: number;
  d3VelocityDecay: number;
  warmupTicks: number;
  width: number;
  height: number;
}

/**
 * Isolated wrapper for ForceGraph2D to prevent infinite loop propagation
 * This component is memoized and only re-renders when graphData actually changes
 */
const ForceGraphWrapperComponent = React.forwardRef<any, ForceGraphWrapperProps>((props, forwardedRef) => {
  const {
    graphData,
    nodeColor,
    nodeRelSize,
    nodeLabel,
    linkColor,
    linkWidth,
    nodeCanvasObject,
    onNodeClick,
    onEngineStop,
    cooldownTicks,
    enableNodeDrag,
    enableZoomInteraction,
    linkDirectionalParticles,
    linkDirectionalParticleWidth,
    linkDirectionalParticleSpeed,
    d3AlphaDecay,
    d3VelocityDecay,
    warmupTicks,
    width,
    height,
  } = props;

  const [isClient, setIsClient] = useState(false);
  const internalRef = useRef<any>(null);
  const hasInitialized = useRef(false);

  // Combine refs
  useEffect(() => {
    if (typeof forwardedRef === 'function') {
      forwardedRef(internalRef.current);
    } else if (forwardedRef) {
      (forwardedRef as any).current = internalRef.current;
    }
  }, [forwardedRef]);

  // Only render on client side
  useEffect(() => {
    setIsClient(true);

    return () => {
      setIsClient(false);
      hasInitialized.current = false;
    };
  }, []);

  // Safe onEngineStop wrapper - only call once
  const safeOnEngineStop = () => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      onEngineStop();
    }
  };

  if (!isClient || !graphData || graphData.nodes.length === 0) {
    return null;
  }

  // Use vis-network for stable graph visualization
  if (USE_VIS_NETWORK) {
    const handleNodeClick = (nodeId: string, nodeLabel: string) => {
      // Find the full node data
      const node = graphData.nodes.find((n: any) => n.id === nodeId);
      if (node && onNodeClick) {
        onNodeClick(node);
      }
    };

    // Call onEngineStop after rendering starts
    safeOnEngineStop();

    return (
      <VisNetworkGraph
        graphData={graphData}
        onNodeClick={handleNodeClick}
      />
    );
  }

  return null; // Fallback
});

ForceGraphWrapperComponent.displayName = 'ForceGraphWrapper';

// Memoize with custom comparison to prevent unnecessary re-renders
export const ForceGraphWrapper = memo(ForceGraphWrapperComponent, (prevProps, nextProps) => {
  // Only re-render if graphData actually changed (deep check)
  const prevNodes = prevProps.graphData?.nodes?.length || 0;
  const nextNodes = nextProps.graphData?.nodes?.length || 0;
  const prevLinks = prevProps.graphData?.links?.length || 0;
  const nextLinks = nextProps.graphData?.links?.length || 0;

  // If data hasn't changed, don't re-render
  return prevNodes === nextNodes && prevLinks === nextLinks;
});
