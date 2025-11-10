import { useState, useEffect } from 'react';

interface UseFetchDataOptions<T> {
  fetchFn: () => Promise<T>;
  dependencies?: unknown[];
}

interface UseFetchDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchData = <T>({ fetchFn, dependencies = [] }: UseFetchDataOptions<T>): UseFetchDataReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, isLoading, error };
};
