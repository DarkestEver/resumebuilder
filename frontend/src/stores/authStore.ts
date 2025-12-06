/**
 * Authentication Store (Zustand)
 * Manages user state, tokens, and authentication logic
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authApi, AuthResponse } from '@/lib/api/auth';

// User type
export interface User {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: string;
  profilePhoto?: string;
  username?: string;
  subscription: {
    plan: string;
    status: string;
  };
}

// Auth store state
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth store actions
interface AuthActions {
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithOTP: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create store with persistence
export const authStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Set user
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
          error: null,
        }),

      // Set tokens
      setTokens: (accessToken, refreshToken) =>
        set({
          accessToken,
          refreshToken,
        }),

      // Set error
      setError: (error) =>
        set({
          error,
          isLoading: false,
        }),

      // Set loading
      setLoading: (loading) =>
        set({
          isLoading: loading,
          error: null,
        }),

      // Clear error
      clearError: () =>
        set({
          error: null,
        }),

      // Login with email and password
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login({ email, password });
          const { user, tokens } = response.data;

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Login failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Register new user
      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.register({ name, email, password });
          const { user, tokens } = response.data;

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Registration failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Login with OTP
      loginWithOTP: async (email, otp) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.verifyOTP({ email, otp });
          const { user, tokens } = response.data;

          set({
            user,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'OTP verification failed. Please try again.';
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true });
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      // Refresh access token
      refreshAccessToken: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authApi.refreshToken(refreshToken);
          const { accessToken, refreshToken: newRefreshToken } = (response.data as any).tokens || response.data;

          set({
            accessToken,
            refreshToken: newRefreshToken,
          });
        } catch (error) {
          console.error('Token refresh failed:', error);
          // Logout on refresh failure
          get().logout();
          throw error;
        }
      },

      // Fetch current user
      fetchUser: async () => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.getCurrentUser();
          const user = response.data.user;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || 'Failed to fetch user data.';
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      // Reset store
      reset: () => set(initialState),
    }),
    {
      name: 'auth-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Selector hooks for convenience
export const useAuth = () => authStore((state) => state);
export const useUser = () => authStore((state) => state.user);
export const useIsAuthenticated = () => authStore((state) => state.isAuthenticated);
export const useAuthLoading = () => authStore((state) => state.isLoading);
export const useAuthError = () => authStore((state) => state.error);
