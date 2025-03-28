import { useState, useEffect } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  staleWhileRevalidate?: boolean;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { ttl = DEFAULT_TTL, staleWhileRevalidate = true } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check cache first
        const cached = localStorage.getItem(key);
        if (cached) {
          const { data: cachedData, timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp > ttl;

          if (!isExpired) {
            setData(cachedData);
            setLoading(false);
            return;
          }

          if (staleWhileRevalidate) {
            setData(cachedData);
          }
        }

        // Fetch fresh data
        const freshData = await fetcher();
        
        // Update cache
        localStorage.setItem(key, JSON.stringify({
          data: freshData,
          timestamp: Date.now()
        }));

        setData(freshData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, ttl, staleWhileRevalidate]);

  const refresh = async () => {
    setLoading(true);
    try {
      const freshData = await fetcher();
      localStorage.setItem(key, JSON.stringify({
        data: freshData,
        timestamp: Date.now()
      }));
      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'));
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refresh };
}