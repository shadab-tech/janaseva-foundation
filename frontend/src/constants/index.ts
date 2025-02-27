import { SERVICE_CATEGORIES, SERVICE_STATUS, BOOKING_STATUS, PAYMENT_STATUS, USER_ROLES } from '@/config';

// Type definitions for enums
export type ServiceCategory = typeof SERVICE_CATEGORIES[keyof typeof SERVICE_CATEGORIES];
export type ServiceStatus = typeof SERVICE_STATUS[keyof typeof SERVICE_STATUS];
export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];
export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Service category labels and icons
export const SERVICE_CATEGORY_INFO = {
  [SERVICE_CATEGORIES.AMBULANCE]: {
    label: 'Ambulance Services',
    icon: '/icons/ambulance.svg',
    description: '24/7 emergency ambulance services with trained medical staff',
  },
  [SERVICE_CATEGORIES.DOCTOR_CONSULTATION]: {
    label: 'Doctor Consultation',
    icon: '/icons/doctor.svg',
    description: 'Online and in-person consultations with experienced doctors',
  },
  [SERVICE_CATEGORIES.HEALTH_INSURANCE]: {
    label: 'Health Insurance',
    icon: '/icons/insurance.svg',
    description: 'Comprehensive health insurance plans for individuals and families',
  },
  [SERVICE_CATEGORIES.MEDICAL_REIMBURSEMENT]: {
    label: 'Medical Reimbursement',
    icon: '/icons/reimbursement.svg',
    description: 'Easy and quick medical bill reimbursement process',
  },
  [SERVICE_CATEGORIES.HOSPITAL]: {
    label: 'Hospitals',
    icon: '/icons/hospital.svg',
    description: 'Network of trusted hospitals providing quality healthcare',
  },
  [SERVICE_CATEGORIES.DIAGNOSTIC_CENTER]: {
    label: 'Diagnostic Centers',
    icon: '/icons/diagnostic.svg',
    description: 'Advanced diagnostic facilities and medical tests',
  },
  [SERVICE_CATEGORIES.PHYSIOTHERAPY]: {
    label: 'Physiotherapy',
    icon: '/icons/physiotherapy.svg',
    description: 'Professional physiotherapy services and rehabilitation',
  },
  [SERVICE_CATEGORIES.PHARMACY]: {
    label: 'Pharmacy',
    icon: '/icons/pharmacy.svg',
    description: '24/7 pharmacy services with home delivery',
  },
};

// Service status information
export const SERVICE_STATUS_INFO = {
  [SERVICE_STATUS.ACTIVE]: {
    label: 'Active',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  [SERVICE_STATUS.COMING_SOON]: {
    label: 'Coming Soon',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  [SERVICE_STATUS.INACTIVE]: {
    label: 'Inactive',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
};

// Booking status information
export const BOOKING_STATUS_INFO = {
  [BOOKING_STATUS.PENDING]: {
    label: 'Pending',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  [BOOKING_STATUS.CONFIRMED]: {
    label: 'Confirmed',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  [BOOKING_STATUS.COMPLETED]: {
    label: 'Completed',
    color: 'blue',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
  },
  [BOOKING_STATUS.CANCELLED]: {
    label: 'Cancelled',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
};

// Payment status information
export const PAYMENT_STATUS_INFO = {
  [PAYMENT_STATUS.PENDING]: {
    label: 'Payment Pending',
    color: 'yellow',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  [PAYMENT_STATUS.COMPLETED]: {
    label: 'Paid',
    color: 'green',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  [PAYMENT_STATUS.FAILED]: {
    label: 'Payment Failed',
    color: 'red',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
  [PAYMENT_STATUS.REFUNDED]: {
    label: 'Refunded',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
};

// Role labels and permissions
export const ROLE_INFO = {
  [USER_ROLES.USER]: {
    label: 'User',
    permissions: ['view_services', 'book_services', 'view_own_bookings'],
  },
  [USER_ROLES.PARTNER]: {
    label: 'Service Partner',
    permissions: [
      'view_services',
      'manage_own_services',
      'view_service_bookings',
      'manage_service_bookings',
    ],
  },
  [USER_ROLES.ADMIN]: {
    label: 'Administrator',
    permissions: [
      'view_services',
      'manage_all_services',
      'view_all_bookings',
      'manage_all_bookings',
      'manage_users',
      'manage_partners',
    ],
  },
};

// Navigation routes
export const ROUTES = {
  HOME: '/',
  SERVICES: '/services',
  SERVICE_DETAILS: (id: string) => `/services/${id}`,
  MY_BOOKINGS: '/my-bookings',
  BOOKING_DETAILS: (id: string) => `/my-bookings/${id}`,
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PROFILE: '/profile',
  PARTNER_DASHBOARD: '/partner/dashboard',
  ADMIN_DASHBOARD: '/admin/dashboard',
  UNAUTHORIZED: '/unauthorized',
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_MOBILE: 'Please enter a valid 10-digit mobile number',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PINCODE: 'Please enter a valid 6-digit pincode',
  INVALID_NAME: 'Name must be at least 2 characters',
};

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'janaseva_token',
  REFRESH_TOKEN: 'janaseva_refresh_token',
  USER_DATA: 'janaseva_user',
  THEME: 'janaseva_theme',
  LANGUAGE: 'janaseva_language',
};

export default {
  SERVICE_CATEGORY_INFO,
  SERVICE_STATUS_INFO,
  BOOKING_STATUS_INFO,
  PAYMENT_STATUS_INFO,
  ROLE_INFO,
  ROUTES,
  VALIDATION_MESSAGES,
  STORAGE_KEYS,
};
