import { useEffect, useEffectEvent, useState } from 'react';

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
};

export function useAsyncData<T>(loader: () => Promise<T>, deps: React.DependencyList = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const runLoader = useEffectEvent(async () => {
    try {
      setLoading(true);
      setError(null);
      const next = await loader();
      setData(next);
    } catch (loadError) {
      console.error(loadError);
      setError(loadError instanceof Error ? loadError.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    void runLoader();
  }, [runLoader, ...deps]);

  return {
    data,
    loading,
    error,
    reload: runLoader,
  };
}
