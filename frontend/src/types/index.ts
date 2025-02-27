// User related types
export interface User {
  _id: string;
  name: string;
  mobile: string;
  role: 'user' | 'partner' | 'admin';
  createdAt: string;
}

export interface UserLoginData {
  mobile: string;
  password: string;
}

export interface UserRegisterData {
  name: string;
  mobile: string;
  password: string;
}

// Service related types
export interface Service {
  _id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  status: ServiceStatus;
  imageUrl: string;
  price: number;
  provider: User;
  location: Location;
  availabilityHours: AvailabilityHours;
  createdAt: string;
}

export type ServiceCategory =
  | 'ambulance'
  | 'doctor_consultation'
  | 'health_insurance'
  | 'medical_reimbursement'
  | 'hospital'
  | 'diagnostic_center'
  | 'physiotherapy'
  | 'pharmacy';

export type ServiceStatus = 'active' | 'coming_soon' | 'inactive';

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface AvailabilityHours {
  monday: TimeSlot;
  tuesday: TimeSlot;
  wednesday: TimeSlot;
  thursday: TimeSlot;
  friday: TimeSlot;
  saturday: TimeSlot;
  sunday: TimeSlot;
}

export interface TimeSlot {
  open: string;
  close: string;
}

// Booking related types
export interface Booking {
  _id: string;
  user: User;
  service: Service;
  status: BookingStatus;
  bookingDate: string;
  timeSlot: string;
  price: number;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  specialRequirements?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface CreateBookingData {
  serviceId: string;
  bookingDate: string;
  timeSlot: string;
  specialRequirements?: string;
}

export interface UpdateBookingStatusData {
  status: BookingStatus;
  cancellationReason?: string;
}

export interface UpdatePaymentStatusData {
  paymentStatus: PaymentStatus;
  paymentId: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Search types
export interface ServiceSearchParams {
  lat: number;
  lng: number;
  distance?: number; // in meters
  category?: ServiceCategory;
  status?: ServiceStatus;
}

// Form Error types
export interface FormErrors {
  [key: string]: string;
}
