/**
 * Authentication API Client
 * Provides methods for all authentication endpoints
 */

import axios, { AxiosError } from 'axios';
import { authStore } from '@/stores/authStore';

// API Base URL from environment
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = authStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Skip token refresh for auth endpoints to prevent infinite loops
    if (originalRequest.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    // Handle 401 (Authentication) - token issues
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const errorData = error.response?.data as any;
      const errorCode = errorData?.code;
      
      // Check if it's a token-related error using error codes (reliable!)
      const isTokenError = 
        errorCode === 'TOKEN_EXPIRED' || 
        errorCode === 'TOKEN_INVALID' ||
        errorCode === 'TOKEN_MISSING';

      // If not a token error, it's something else (user not found, wrong password, etc.)
      // Don't attempt token refresh for these
      if (!isTokenError) {
        return Promise.reject(error);
      }

      try {
        const refreshToken = authStore.getState().refreshToken;
        
        if (!refreshToken) {
          // No refresh token available - can't refresh, redirect to login
          console.warn('Token expired but no refresh token available');
          authStore.setState({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false 
          });
          if (typeof window !== 'undefined') {
            window.location.href = '/login?expired=true';
          }
          return Promise.reject(error);
        }

        // Attempt to refresh token
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { tokens } = response.data.data;

        // Update tokens in store
        authStore.getState().setTokens(tokens.accessToken, tokens.refreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError: any) {
        // Refresh failed - check if it's because refresh token is invalid/expired
        const refreshErrorCode = refreshError?.response?.data?.code;
        const isRefreshTokenInvalid = 
          refreshErrorCode === 'INVALID_REFRESH_TOKEN' ||
          refreshErrorCode === 'TOKEN_EXPIRED' ||
          refreshErrorCode === 'TOKEN_INVALID' ||
          refreshError?.response?.status === 401;
        
        if (isRefreshTokenInvalid) {
          // Refresh token itself is expired/invalid - clear everything and redirect
          console.error('Refresh token invalid or expired, logging out');
          authStore.setState({ 
            user: null, 
            accessToken: null, 
            refreshToken: null, 
            isAuthenticated: false 
          });
          if (typeof window !== 'undefined') {
            window.location.href = '/login?expired=true';
          }
        } else {
          // Some other error during refresh
          console.error('Token refresh failed:', refreshError);
        }
        
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 (Authorization) - permission issues
    // Don't logout, just show the error to user
    if (error.response?.status === 403) {
      console.warn('Access forbidden:', (error.response?.data as any)?.message);
      // Let the calling code handle the error
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RequestOTPData {
  email: string;
}

export interface VerifyOTPData {
  email: string;
  otp: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateEmailData {
  newEmail: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      name: string;
      email: string;
      emailVerified: boolean;
      role: string;
      profilePhoto?: string;
      subscription: {
        plan: string;
        status: string;
      };
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Auth API Methods
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Request OTP for passwordless login
   */
  requestOTP: async (data: RequestOTPData): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/request-otp', data);
    return response.data;
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (data: VerifyOTPData): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/verify-otp', data);
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh-token', {
      refreshToken,
    });
    return response.data;
  },

  /**
   * Logout user
   */
  logout: async (): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/logout');
    return response.data;
  },

  /**
   * Request password reset email
   */
  forgotPassword: async (data: ForgotPasswordData): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/forgot-password', data);
    return response.data;
  },

  /**
   * Reset password with token
   */
  resetPassword: async (data: ResetPasswordData): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/reset-password', data);
    return response.data;
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<MessageResponse> => {
    const response = await apiClient.get<MessageResponse>(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  /**
   * Resend email verification
   */
  resendVerification: async (): Promise<MessageResponse> => {
    const response = await apiClient.post<MessageResponse>('/auth/resend-verification');
    return response.data;
  },

  /**
   * Change password (authenticated)
   */
  changePassword: async (data: ChangePasswordData): Promise<MessageResponse> => {
    const response = await apiClient.put<MessageResponse>('/user/password', data);
    return response.data;
  },

  /**
   * Update email (authenticated)
   */
  updateEmail: async (data: UpdateEmailData): Promise<MessageResponse> => {
    const response = await apiClient.put<MessageResponse>('/user/email', data);
    return response.data;
  },

  /**
   * Get current user (authenticated)
   */
  getCurrentUser: async () => {
    const response = await apiClient.get('/user/me');
    return response.data;
  },
};

export default apiClient;
