import {
  User,
  Service,
  Booking,
  UserLoginData,
  UserRegisterData,
  CreateBookingData,
  UpdateBookingStatusData,
  UpdatePaymentStatusData,
  ServiceSearchParams,
  ApiResponse,
  PaginatedResponse,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiService {
  private static getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
      };
    }

    return { data: data as T };
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  static async post<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  static async put<T>(endpoint: string, data?: unknown): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: data ? JSON.stringify(data) : undefined,
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return await this.handleResponse<T>(response);
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Network error occurred',
      };
    }
  }
}

// Auth API endpoints
export const authApi = {
  login: (data: UserLoginData) => 
    ApiService.post<{ token: string; user: User }>('/auth/login', data),
  
  register: (data: UserRegisterData) =>
    ApiService.post<{ token: string; user: User }>('/auth/register', data),
  
  getProfile: () => 
    ApiService.get<User>('/auth/profile'),
  
  updateProfile: (data: Partial<UserRegisterData>) =>
    ApiService.put<User>('/auth/profile', data),
};

// Services API endpoints
export const servicesApi = {
  getAll: (params?: { category?: string; status?: string }) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : '';
    return ApiService.get<PaginatedResponse<Service>>(`/services${queryString}`);
  },
  
  getById: (id: string) => 
    ApiService.get<Service>(`/services/${id}`),
  
  create: (data: Partial<Service>) => 
    ApiService.post<Service>('/services', data),
  
  update: (id: string, data: Partial<Service>) => 
    ApiService.put<Service>(`/services/${id}`, data),
  
  delete: (id: string) => 
    ApiService.delete<{ message: string }>(`/services/${id}`),
  
  search: (params: ServiceSearchParams) => {
    const searchParams = new URLSearchParams();
    if (params.lat) searchParams.append('lat', params.lat.toString());
    if (params.lng) searchParams.append('lng', params.lng.toString());
    if (params.distance) searchParams.append('distance', params.distance.toString());
    if (params.category) searchParams.append('category', params.category);
    if (params.status) searchParams.append('status', params.status);
    
    return ApiService.get<Service[]>(`/services/search?${searchParams.toString()}`);
  },
};

// Bookings API endpoints
export const bookingsApi = {
  create: (data: CreateBookingData) => 
    ApiService.post<Booking>('/bookings', data),
  
  getUserBookings: () => 
    ApiService.get<PaginatedResponse<Booking>>('/bookings'),
  
  getProviderBookings: () => 
    ApiService.get<PaginatedResponse<Booking>>('/bookings/provider'),
  
  getById: (id: string) => 
    ApiService.get<Booking>(`/bookings/${id}`),
  
  updateStatus: (id: string, data: UpdateBookingStatusData) =>
    ApiService.put<Booking>(`/bookings/${id}`, data),
  
  updatePayment: (id: string, data: UpdatePaymentStatusData) =>
    ApiService.put<Booking>(`/bookings/${id}/payment`, data),
};

export default ApiService;
