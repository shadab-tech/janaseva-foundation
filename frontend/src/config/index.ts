// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'janaseva_token',
  REFRESH_TOKEN_KEY: 'janaseva_refresh_token',
  TOKEN_EXPIRY: 30 * 24 * 60 * 60 * 1000, // 30 days
  REFRESH_TOKEN_EXPIRY: 90 * 24 * 60 * 60 * 1000, // 90 days
};

// Service Categories
export const SERVICE_CATEGORIES = {
  AMBULANCE: 'ambulance',
  DOCTOR_CONSULTATION: 'doctor_consultation',
  HEALTH_INSURANCE: 'health_insurance',
  MEDICAL_REIMBURSEMENT: 'medical_reimbursement',
  HOSPITAL: 'hospital',
  DIAGNOSTIC_CENTER: 'diagnostic_center',
  PHYSIOTHERAPY: 'physiotherapy',
  PHARMACY: 'pharmacy',
} as const;

// Service Status
export const SERVICE_STATUS = {
  ACTIVE: 'active',
  COMING_SOON: 'coming_soon',
  INACTIVE: 'inactive',
} as const;

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

// User Roles
export const USER_ROLES = {
  USER: 'user',
  PARTNER: 'partner',
  ADMIN: 'admin',
} as const;

// Pagination Configuration
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
};

// Date and Time Configuration
export const DATE_CONFIG = {
  DEFAULT_DATE_FORMAT: 'DD MMM YYYY',
  DEFAULT_TIME_FORMAT: 'hh:mm A',
  DEFAULT_DATETIME_FORMAT: 'DD MMM YYYY, hh:mm A',
  BOOKING_TIME_SLOT_INTERVAL: 30, // minutes
};

// Validation Configuration
export const VALIDATION_CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  MAX_PASSWORD_LENGTH: 50,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 50,
  MOBILE_REGEX: /^[0-9]{10}$/,
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PINCODE_REGEX: /^[0-9]{6}$/,
};

// File Upload Configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 5,
};

// Toast Configuration
export const TOAST_CONFIG = {
  DEFAULT_DURATION: 3000,
  SUCCESS_DURATION: 3000,
  ERROR_DURATION: 5000,
  WARNING_DURATION: 4000,
  INFO_DURATION: 3000,
};

// Cache Configuration
export const CACHE_CONFIG = {
  DEFAULT_CACHE_TIME: 5 * 60 * 1000, // 5 minutes
  USER_CACHE_TIME: 30 * 60 * 1000, // 30 minutes
  SERVICE_CACHE_TIME: 10 * 60 * 1000, // 10 minutes
};

// SEO Configuration
export const SEO_CONFIG = {
  DEFAULT_TITLE: 'Janaseva Foundation - Healthcare Services',
  DEFAULT_DESCRIPTION: 'Access quality healthcare services including ambulance, doctor consultations, and medical assistance.',
  DEFAULT_KEYWORDS: ['healthcare', 'ambulance', 'medical services', 'doctor consultation', 'medical assistance', 'emergency services'],
  SITE_NAME: 'Janaseva Foundation',
  TWITTER_HANDLE: '@janasevafoundation',
};

// Contact Information
export const CONTACT_INFO = {
  PHONE: '+91 1234567890',
  EMAIL: 'contact@janasevafoundation.org',
  ADDRESS: '123, Healthcare Street, Mumbai, India',
  SOCIAL_MEDIA: {
    FACEBOOK: 'https://facebook.com/janasevafoundation',
    TWITTER: 'https://twitter.com/janasevafoundation',
    INSTAGRAM: 'https://instagram.com/janasevafoundation',
    LINKEDIN: 'https://linkedin.com/company/janasevafoundation',
  },
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again later.',
  NETWORK: 'Network error. Please check your internet connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  VALIDATION: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
};

export default {
  API_CONFIG,
  AUTH_CONFIG,
  SERVICE_CATEGORIES,
  SERVICE_STATUS,
  BOOKING_STATUS,
  PAYMENT_STATUS,
  USER_ROLES,
  PAGINATION_CONFIG,
  DATE_CONFIG,
  VALIDATION_CONFIG,
  UPLOAD_CONFIG,
  TOAST_CONFIG,
  CACHE_CONFIG,
  SEO_CONFIG,
  CONTACT_INFO,
  ERROR_MESSAGES,
};
