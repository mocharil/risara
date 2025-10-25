// src/utils/react-guards.ts
/**
 * React Re-Render Guards & Utilities
 * Prevent infinite loops and unnecessary re-renders
 */

import { useRef, useEffect } from 'react';

/**
 * Guard against infinite re-render loops
 * Throws error if component re-renders more than maxRenders in timeWindow
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRenderLoopGuard('MyComponent', 50, 1000);
 *   // ... rest of component
 * }
 * ```
 */
export function useRenderLoopGuard(
  componentName: string,
  maxRenders: number = 50,
  timeWindow: number = 1000 // ms
) {
  const renderCount = useRef(0);
  const windowStart = useRef(Date.now());

  renderCount.current++;

  const now = Date.now();
  if (now - windowStart.current > timeWindow) {
    // Reset window
    renderCount.current = 1;
    windowStart.current = now;
  } else if (renderCount.current > maxRenders) {
    const error = new Error(
      `🚨 INFINITE LOOP DETECTED in ${componentName}!\n` +
      `Rendered ${renderCount.current} times in ${now - windowStart.current}ms.\n` +
      `Check useEffect dependencies and ensure props/state don't create new objects every render.`
    );
    console.error(error);
    throw error;
  }

  if (process.env.NODE_ENV === 'development') {
    if (renderCount.current > maxRenders / 2) {
      console.warn(
        `⚠️  ${componentName} has rendered ${renderCount.current} times in ${now - windowStart.current}ms. ` +
        `This might indicate a performance issue.`
      );
    }
  }
}

/**
 * Log when dependencies change in useEffect/useCallback/useMemo
 *
 * @example
 * ```tsx
 * const value = useMemo(() => {
 *   logDepsChange('myMemo', { graphData, selectedRegion });
 *   return expensiveComputation();
 * }, [graphData, selectedRegion]);
 * ```
 */
export function logDepsChange(name: string, deps: Record<string, any>) {
  const prevDeps = useRef<Record<string, any>>({});

  useEffect(() => {
    const changed: string[] = [];
    Object.keys(deps).forEach(key => {
      if (deps[key] !== prevDeps.current[key]) {
        changed.push(key);
      }
    });

    if (changed.length > 0) {
      console.log(`📊 [${name}] Dependencies changed:`, changed);
      changed.forEach(key => {
        console.log(`  - ${key}:`, {
          old: prevDeps.current[key],
          new: deps[key],
          refEqual: prevDeps.current[key] === deps[key]
        });
      });
    }

    prevDeps.current = { ...deps };
  });
}

/**
 * Stable object reference - prevents new object creation every render
 * Use for props passed to memoized components or useEffect deps
 *
 * @example
 * ```tsx
 * const stableData = useStableObject({ nodes, links, meta });
 * // stableData reference only changes when actual data changes
 * ```
 */
export function useStableObject<T extends object>(obj: T): T {
  const ref = useRef<T>(obj);
  const isEqual = shallowEqual(ref.current, obj);

  if (!isEqual) {
    ref.current = obj;
  }

  return ref.current;
}

function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return false;
  if (obj1 === null || obj2 === null) return false;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every(key => obj1[key] === obj2[key]);
}

/**
 * Performance monitor - track component render times
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useRenderPerformance('MyComponent');
 *   // ...
 * }
 * ```
 */
export function useRenderPerformance(componentName: string, warnThreshold = 16) {
  const startTime = useRef(performance.now());

  useEffect(() => {
    const renderTime = performance.now() - startTime.current;

    if (renderTime > warnThreshold) {
      console.warn(
        `⏱️  ${componentName} took ${renderTime.toFixed(2)}ms to render ` +
        `(threshold: ${warnThreshold}ms)`
      );
    }

    startTime.current = performance.now();
  });
}
