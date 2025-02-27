import { ServiceCategory, ServiceStatus } from '@/types';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};

// Format time
export const formatTime = (time: string): string => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(new Date(`2000-01-01T${time}`));
};

// Service Categories with labels
export const SERVICE_CATEGORIES: Record<ServiceCategory, string> = {
  ambulance: 'Ambulance',
  doctor_consultation: 'Doctor Consultation',
  health_insurance: 'Health Insurance',
  medical_reimbursement: 'Medical Reimbursement',
  hospital: 'Hospital',
  diagnostic_center: 'Diagnostic Center',
  physiotherapy: 'Physiotherapy',
  pharmacy: 'Pharmacy',
};

// Service Status with labels and colors
export const SERVICE_STATUS: Record<ServiceStatus, { label: string; color: string }> = {
  active: {
    label: 'Active',
    color: 'green',
  },
  coming_soon: {
    label: 'Coming Soon',
    color: 'yellow',
  },
  inactive: {
    label: 'Inactive',
    color: 'gray',
  },
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

// Get initials from name
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Validate mobile number
export const isValidMobile = (mobile: string): boolean => {
  return /^[0-9]{10}$/.test(mobile);
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
};

// Generate time slots
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number
): string[] => {
  const slots: string[] = [];
  const start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  while (start < end) {
    slots.push(start.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));
    start.setMinutes(start.getMinutes() + intervalMinutes);
  }

  return slots;
};

// Calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

// Local storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_MOBILE: 'Please enter a valid 10-digit mobile number',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  INVALID_OTP: 'Please enter a valid 6-digit OTP',
  SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
  NO_INTERNET: 'No internet connection. Please check your network.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
  BOOKING_CONFIRMED: 'Booking confirmed successfully',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',
} as const;
