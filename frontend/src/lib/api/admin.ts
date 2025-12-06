import apiClient from './auth';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  lastLogin?: string;
  isBanned: boolean;
  subscription?: {
    plan: string;
    status: string;
  };
}

export const adminApi = {
  /**
   * Get all users
   */
  getUsers: async (page = 1, limit = 20): Promise<{ users: User[]; total: number }> => {
    const response = await apiClient.get('/admin/users', { params: { page, limit } });
    return response.data;
  },

  /**
   * Search users
   */
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await apiClient.get('/admin/search-users', { params: { q: query } });
    return response.data;
  },

  /**
   * Ban user
   */
  banUser: async (userId: string, reason?: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },

  /**
   * Unban user
   */
  unbanUser: async (userId: string) => {
    const response = await apiClient.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  /**
   * Get user details
   */
  getUserDetails: async (userId: string) => {
    const response = await apiClient.get(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Get system stats
   */
  getSystemStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
};
