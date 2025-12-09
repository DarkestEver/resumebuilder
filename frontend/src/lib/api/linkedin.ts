import apiClient from './auth';

export const linkedinApi = {
  /**
   * Get LinkedIn OAuth URL
   */
  getAuthUrl: async () => {
    const response = await apiClient.get('/linkedin/auth-url');
    return response.data;
  },

  /**
   * Sync profile from LinkedIn
   */
  syncProfile: async (code: string) => {
    const response = await apiClient.post('/linkedin/sync', { code });
    return response.data;
  },
};
