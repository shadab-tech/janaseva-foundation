import { API_CONFIG, AUTH_CONFIG } from '@/config';

// Error messages
const API_ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  NETWORK: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Please login to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
} as const;

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Type definitions
interface RequestOptions extends RequestInit {
  timeout?: number;
  baseURL?: string;
  params?: Record<string, string>;
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

// Request timeout handler
const timeoutPromise = (timeout: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new ApiError(API_ERROR_MESSAGES.TIMEOUT, 408));
    }, timeout);
  });
};

// Add authorization header
const addAuthHeader = (headers: HeadersInit): HeadersInit => {
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return headers;
};

// Handle API response
const handleResponse = async <T>(response: Response): Promise<T> => {
  const contentType = response.headers.get('content-type');
  const isJson = contentType?.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new ApiError(
      data.message || API_ERROR_MESSAGES.GENERIC,
      response.status,
      data
    );

    // Handle specific error cases
    switch (response.status) {
      case 401:
        // Clear auth token and redirect to login
        localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
        window.location.href = `/login?redirect=${window.location.pathname}`;
        break;
      case 403:
        window.location.href = '/unauthorized';
        break;
    }

    throw error;
  }

  return data;
};

// Retry failed requests
const retryRequest = async <T>(
  fn: () => Promise<T>,
  retries: number = API_CONFIG.RETRY_ATTEMPTS,
  delay: number = API_CONFIG.RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || (error instanceof ApiError && error.status === 401)) {
      throw error;
    }
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

// Build URL with query parameters
const buildUrl = (
  endpoint: string,
  baseURL: string,
  params?: Record<string, string>
): string => {
  const url = new URL(
    endpoint.startsWith('http') ? endpoint : `${baseURL}${endpoint}`
  );

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Add timestamp to prevent caching
  url.searchParams.append('_t', Date.now().toString());

  return url.toString();
};

// Main fetch wrapper
const fetchApi = async <T>(
  endpoint: string,
  method: HttpMethod,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    timeout = API_CONFIG.TIMEOUT,
    baseURL = API_CONFIG.BASE_URL,
    params,
    headers = {},
    ...fetchOptions
  } = options;

  const url = buildUrl(endpoint, baseURL, params);
  
  const requestHeaders = addAuthHeader({
    'Content-Type': 'application/json',
    ...headers,
  });

  const fetchPromise = fetch(url, {
    ...fetchOptions,
    method,
    headers: requestHeaders,
  }).then(response => handleResponse<T>(response));

  return Promise.race([
    fetchPromise,
    timeoutPromise(timeout),
  ]).catch(error => {
    if (error.name === 'TypeError') {
      throw new ApiError(API_ERROR_MESSAGES.NETWORK, 0);
    }
    throw error;
  });
};

// HTTP method wrappers
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    retryRequest(() => fetchApi<T>(endpoint, 'GET', options)),

  post: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, 'POST', {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, 'PUT', {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown, options?: RequestOptions) =>
    fetchApi<T>(endpoint, 'PATCH', {
      ...options,
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    fetchApi<T>(endpoint, 'DELETE', options),
};

// Error handler
export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    // Log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        message: error.message,
        status: error.status,
        data: error.data,
      });
    }
  }
  throw error;
};

export default api;
