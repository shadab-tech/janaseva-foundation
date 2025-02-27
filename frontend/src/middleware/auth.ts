import { NextRouter } from 'next/router';
import { API_CONFIG, AUTH_CONFIG } from '@/config';
import { ROUTES } from '@/constants';

export type UserRole = 'user' | 'partner' | 'admin';

export interface User {
  _id: string;
  name: string;
  mobile: string;
  role: UserRole;
  createdAt: string;
}

interface AuthGuardOptions {
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const token = localStorage.getItem(AUTH_CONFIG.TOKEN_KEY);
  if (!token) return false;

  try {
    // Check token expiry
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = tokenData.exp * 1000; // Convert to milliseconds
    
    if (Date.now() >= expiryTime) {
      localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
      return false;
    }

    return true;
  } catch {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    return false;
  }
};

// Check if user has required role
export const hasRole = (user: User | null, allowedRoles: UserRole[]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

// Get current path for redirect
export const getCurrentPath = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.pathname}${window.location.search}`;
};

// Handle authentication guard
export const handleAuthGuard = (
  router: NextRouter,
  user: User | null,
  options: AuthGuardOptions = {}
): boolean => {
  const {
    allowedRoles,
    redirectTo = `${ROUTES.LOGIN}?redirect=${getCurrentPath()}`,
  } = options;

  // Check if authenticated
  if (!isAuthenticated()) {
    router.replace(redirectTo);
    return false;
  }

  // Check role if specified
  if (allowedRoles && (!user || !hasRole(user, allowedRoles))) {
    router.replace(ROUTES.UNAUTHORIZED);
    return false;
  }

  return true;
};

// Get user from token
export const getUserFromToken = (token: string): User | null => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      _id: payload.id,
      name: payload.name,
      mobile: payload.mobile,
      role: payload.role,
      createdAt: payload.createdAt,
    };
  } catch {
    return null;
  }
};

// Refresh token handler
export const refreshToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error('Failed to refresh token');

    const data = await response.json();
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, data.token);
    return data.token;
  } catch {
    localStorage.removeItem(AUTH_CONFIG.TOKEN_KEY);
    localStorage.removeItem(AUTH_CONFIG.REFRESH_TOKEN_KEY);
    return null;
  }
};

export default {
  isAuthenticated,
  hasRole,
  handleAuthGuard,
  getUserFromToken,
  refreshToken,
};
