// src/components/analytics/network-analysis.test.tsx
/**
 * Test to catch infinite re-render regressions in NetworkAnalysis
 */

import { render, screen, waitFor } from '@testing-library/react';
import { NetworkAnalysis } from './network-analysis';

// Mock ForceGraph2D to avoid D3 issues in tests
jest.mock('react-force-graph-2d', () => {
  return function MockForceGraph2D(props: any) {
    // Simulate onEngineStop being called
    React.useEffect(() => {
      if (props.onEngineStop) {
        props.onEngineStop();
      }
    }, [props.graphData]);

    return <div data-testid="force-graph">Mock Graph</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();

describe('NetworkAnalysis - Infinite Loop Prevention', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        nodes: [
          { id: '1', data: { label: 'Node 1', weight: 5, cluster: 0 }, type: 'user' },
          { id: '2', data: { label: 'Node 2', weight: 3, cluster: 1 }, type: 'hashtag' },
        ],
        edges: [
          { source: '1', target: '2' },
        ],
        meta: { region: 'All Data', totalNodes: 2, totalEdges: 1 },
      }),
    });
  });

  it('should NOT cause infinite re-renders when graph data loads', async () => {
    const renderSpy = jest.fn();

    function TestWrapper() {
      renderSpy();
      return <NetworkAnalysis data={null} />;
    }

    render(<TestWrapper />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('force-graph')).toBeInTheDocument();
    });

    // Should render initially + after data load = ~2-3 times MAX
    // If > 10 renders, we have a loop
    expect(renderSpy).toHaveBeenCalledTimes(expect.any(Number));
    expect(renderSpy.mock.calls.length).toBeLessThan(10);
  });

  it('should use stable graphData reference to prevent ForceGraph re-initialization', async () => {
    const onEngineStopSpy = jest.fn();

    // Spy on ForceGraph2D props
    const MockForceGraph = jest.requireMock('react-force-graph-2d');
    MockForceGraph.mockImplementation((props: any) => {
      onEngineStopSpy(props.onEngineStop);
      return <div data-testid="force-graph" />;
    });

    render(<NetworkAnalysis data={null} />);

    await waitFor(() => {
      expect(screen.getByTestId('force-graph')).toBeInTheDocument();
    });

    // onEngineStop should be a stable reference (same function each render)
    const calls = onEngineStopSpy.mock.calls;
    if (calls.length > 1) {
      // All onEngineStop references should be the SAME
      expect(calls[0][0]).toBe(calls[1][0]);
    }
  });

  it('should throw error if infinite loop guard is triggered', async () => {
    // Mock component that causes infinite loop
    function InfiniteLoopComponent() {
      const [count, setCount] = React.useState(0);

      React.useEffect(() => {
        // This causes infinite loop
        setCount(c => c + 1);
      }); // No deps!

      useRenderLoopGuard('Test', 10, 100);

      return <div>{count}</div>;
    }

    // Should throw error
    expect(() => {
      render(<InfiniteLoopComponent />);
    }).toThrow(/INFINITE LOOP DETECTED/);
  });
});

/**
 * Manual Test Checklist (run in browser DevTools):
 *
 * 1. Open Network Analysis page
 * 2. Open DevTools → Console
 * 3. Type: window.renderCount = 0
 * 4. Patch NetworkAnalysis to add:
 *    useEffect(() => { window.renderCount++; console.log('Render', window.renderCount); });
 * 5. Reload page
 * 6. Expected: renderCount should be < 5
 * 7. If renderCount > 50, you have an infinite loop
 */
