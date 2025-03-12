import { useState, useCallback } from 'react';
import { ApiResponse, ApiError } from '../types';

interface UseApiResult<TData> {
  data: TData | null;
  error: ApiError | null;
  isLoading: boolean;
  isRetrying: boolean;
  execute: (...args: any[]) => Promise<ApiResponse<TData>>;
  reset: () => void;
  retry: () => Promise<void>;
}

export function useApi<TData>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  maxRetries = 3
): UseApiResult<TData> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiFunction(...args);

        if (response.error) {
          setError(response.error);
          return response;
        }

        if (response.data) {
          setData(response.data);
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError({
          message: errorMessage,
          statusCode: 500,
          timestamp: new Date().toISOString()
        });
        return { error: {
          message: errorMessage,
          statusCode: 500,
          timestamp: new Date().toISOString()
        } };
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  const retry = useCallback(async () => {
    if (retryCount >= maxRetries) return;
    
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    
    try {
      await execute();
    } finally {
      setIsRetrying(false);
    }
  }, [execute, maxRetries, retryCount]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
    setIsRetrying(false);
    setRetryCount(0);
  }, []);

  return {
    data,
    error,
    isLoading,
    isRetrying,
    execute,
    reset,
    retry
  };
}

export function useApiWithTransform<TData, TTransformed>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  transform: (data: TData) => TTransformed,
  maxRetries = 3
): UseApiResult<TTransformed> {
  const api = useApi<TData>(apiFunction, maxRetries);

  const executeWithTransform = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      const response = await api.execute(...args);
      if (response.error) {
        return { error: response.error };
      }
      return {
        data: response.data ? transform(response.data) : undefined
      };
    },
    [api, transform]
  );

  return {
    ...api,
    execute: executeWithTransform,
    data: api.data ? transform(api.data) : null,
  };
}
