import { useState, useCallback } from 'react';
import { ApiResponse } from '@/types';

interface UseApiResult<TData, TError = string> {
  data: TData | null;
  error: TError | null;
  isLoading: boolean;
  execute: (...args: any[]) => Promise<ApiResponse<TData>>;
  reset: () => void;
}

export function useApi<TData, TError = string>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>
): UseApiResult<TData, TError> {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await apiFunction(...args);

        if (response.error) {
          setError(response.error as TError);
          return response;
        }

        if (response.data) {
          setData(response.data);
        }

        return response;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage as TError);
        return { error: errorMessage };
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    data,
    error,
    isLoading,
    execute,
    reset,
  };
}

// Example usage with automatic loading state for components
export function useApiWithLoading<TData, TError = string>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  immediate = false,
  ...immediateArgs: Parameters<typeof apiFunction>
): UseApiResult<TData, TError> {
  const api = useApi<TData, TError>(apiFunction);

  useState(() => {
    if (immediate) {
      api.execute(...immediateArgs);
    }
  });

  return api;
}

// Example usage with automatic error handling
export function useApiWithErrorHandling<TData, TError = string>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  onError?: (error: TError) => void
): UseApiResult<TData, TError> {
  const api = useApi<TData, TError>(apiFunction);

  const executeWithErrorHandling = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      const response = await api.execute(...args);
      if (response.error && onError) {
        onError(response.error as TError);
      }
      return response;
    },
    [api, onError]
  );

  return {
    ...api,
    execute: executeWithErrorHandling,
  };
}

// Example usage with automatic data transformation
export function useApiWithTransform<TData, TTransformed, TError = string>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  transform: (data: TData) => TTransformed
): UseApiResult<TTransformed, TError> {
  const [transformedData, setTransformedData] = useState<TTransformed | null>(null);
  const api = useApi<TData, TError>(apiFunction);

  const executeWithTransform = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      const response = await api.execute(...args);
      if (response.data) {
        setTransformedData(transform(response.data));
      }
      return response;
    },
    [api, transform]
  );

  return {
    ...api,
    data: transformedData,
    execute: executeWithTransform,
  };
}

// Example usage with automatic retry
export function useApiWithRetry<TData, TError = string>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<TData>>,
  maxRetries = 3,
  retryDelay = 1000
): UseApiResult<TData, TError> {
  const api = useApi<TData, TError>(apiFunction);

  const executeWithRetry = useCallback(
    async (...args: Parameters<typeof apiFunction>) => {
      let retries = 0;
      let lastError: ApiResponse<TData> | null = null;

      while (retries < maxRetries) {
        const response = await api.execute(...args);
        
        if (!response.error) {
          return response;
        }

        lastError = response;
        retries++;

        if (retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
      }

      return lastError || { error: 'Max retries exceeded' };
    },
    [api, maxRetries, retryDelay]
  );

  return {
    ...api,
    execute: executeWithRetry,
  };
}
