/**
 * User API Client
 * Provides methods for user management endpoints
 */

import apiClient from './auth';

// Types
export interface UpdateUserData {
  name?: string;
  phone?: string;
  profilePhoto?: string;
  username?: string;
}

export interface UserStatsResponse {
  success: boolean;
  data: {
    stats: {
      totalResumes: number;
      publicResumes: number;
      privateResumes: number;
      totalViews: number;
      totalDownloads: number;
      profileCompletion: number;
    };
  };
}

export interface UserResponse {
  success: boolean;
  data: {
    user: any;
    profile: any;
    resumeCount: number;
  };
}

// User API Methods
export const userApi = {
  /**
   * Get current user with profile
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/user/me');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateUser: async (data: UpdateUserData) => {
    const response = await apiClient.put('/user/me', data);
    return response.data;
  },

  /**
   * Update user profile (alias for updateUser)
   */
  updateProfile: async (data: UpdateUserData) => {
    const response = await apiClient.put('/user/me', data);
    return response.data;
  },

  /**
   * Get user stats
   */
  getUserStats: async (): Promise<UserStatsResponse> => {
    const response = await apiClient.get<UserStatsResponse>('/users/stats');
    return response.data;
  },

  /**
   * Delete user account
   */
  deleteAccount: async () => {
    const response = await apiClient.delete('/user/me');
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (oldPassword: string, newPassword: string) => {
    const response = await apiClient.put('/users/password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Change email
   */
  changeEmail: async (newEmail: string, password: string) => {
    const response = await apiClient.put('/users/email', {
      newEmail,
      password,
    });
    return response.data;
  },

  /**
   * Upload profile photo
   */
  uploadPhoto: async (formData: FormData) => {
    const response = await apiClient.post('/users/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Upload profile photo
   */
  uploadProfilePhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await apiClient.post('/user/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
