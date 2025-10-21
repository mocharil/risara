// src/hooks/use-social-monitoring.ts
import { useState, useEffect, useCallback } from 'react';

interface UseDataFetchOptions {
  endpoint: string;
  params?: Record<string, string | number>;
  autoFetch?: boolean;
}

export function useDataFetch<T>(options: UseDataFetchOptions) {
  const { endpoint, params = {}, autoFetch = true } = options;
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();

      const url = queryString ? `${endpoint}?${queryString}` : endpoint;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result.data || result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

// Hook for Urgency Dashboard
export function useUrgencyData() {
  return useDataFetch({
    endpoint: '/api/social-monitoring/urgency'
  });
}

// Hook for Executive Summary
export function useExecutiveSummary(date?: string) {
  return useDataFetch({
    endpoint: '/api/social-monitoring/executive-summary',
    params: date ? { date } : {}
  });
}

// Hook for Crisis Timeline
export function useCrisisTimeline(filters?: {
  minUrgency?: number;
  topic?: string;
  platform?: string;
  limit?: number;
}) {
  const [currentFilters, setCurrentFilters] = useState(filters || {});

  const result = useDataFetch({
    endpoint: '/api/social-monitoring/crisis-timeline',
    params: {
      minUrgency: currentFilters.minUrgency || 70,
      topic: currentFilters.topic || 'all',
      platform: currentFilters.platform || 'all',
      limit: currentFilters.limit || 50
    }
  });

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { ...result, updateFilters };
}

// Hook for Topic Matrix
export function useTopicMatrix() {
  return useDataFetch({
    endpoint: '/api/social-monitoring/topic-matrix'
  });
}

// Hook for Problem-Solution Matrix
export function useProblemSolution(filters?: {
  minUrgency?: number;
  topic?: string;
  limit?: number;
}) {
  const [currentFilters, setCurrentFilters] = useState(filters || {});

  const result = useDataFetch({
    endpoint: '/api/social-monitoring/problem-solution',
    params: {
      minUrgency: currentFilters.minUrgency || 0,
      topic: currentFilters.topic || 'all',
      limit: currentFilters.limit || 20
    }
  });

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { ...result, updateFilters };
}

// Hook for Keywords
export function useKeywords(filters?: {
  limit?: number;
  source?: string;
}) {
  const [currentFilters, setCurrentFilters] = useState(filters || {});

  const result = useDataFetch({
    endpoint: '/api/social-monitoring/keywords',
    params: {
      limit: currentFilters.limit || 50,
      source: currentFilters.source || 'all'
    }
  });

  const updateFilters = useCallback((newFilters: typeof filters) => {
    setCurrentFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { ...result, updateFilters };
}
