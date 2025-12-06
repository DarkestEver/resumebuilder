import apiClient from './auth';

export interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

export const activityApi = {
  /**
   * Get unread count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get('/activities/unread');
    return response.data.data?.unread || 0;
  },

  /**
   * Get all activities
   */
  getActivities: async (page = 1, limit = 20): Promise<{ activities: Activity[]; total: number }> => {
    const response = await apiClient.get('/activities', { params: { page, limit } });
    return response.data;
  },

  /**
   * Mark as read
   */
  markAsRead: async (activityId: string) => {
    const response = await apiClient.put(`/activities/${activityId}/read`);
    return response.data;
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    const response = await apiClient.put('/activities/read-all');
    return response.data;
  },
};
