export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'user';
}

export interface Booking {
  id: string;
  serviceId: string;
  userId: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}
