import { useCallback, useEffect, useState } from "react";

type UseLoadReturnType<T> = {
  loading: boolean;
  data: T | null;
  error: Error | null;
  load: () => void;
};

export const useLoad = <T>(
  func: () => T | Promise<T>,
  dependencies: any[] = [] // 👈 Optional dependencies
): UseLoadReturnType<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.resolve()
      .then(() => func())
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err) => {
        setData(null);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [func, ...dependencies]); // 👈 Triggers reload when any dependency changes

  useEffect(() => {
    load();
  }, [load]); // 👈 Auto-load on mount or dependency change

  return {
    data,
    loading,
    error,
    load,
  };
};
