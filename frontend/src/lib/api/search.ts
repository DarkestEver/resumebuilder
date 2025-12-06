/**
 * Search API Client
 */

import apiClient from './auth';

export interface SearchFilters {
  skills?: string[];
  location?: string;
  experience?: string;
  minExperience?: number;
  maxExperience?: number;
  sortBy?: 'recent' | 'popular' | 'relevance';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  _id: string;
  title: string;
  profile: {
    personalInfo?: {
      firstName?: string;
      lastName?: string;
      title?: string;
    };
    summary?: string;
  };
  skills: Array<{ name: string }>;
  experience: Array<{ title: string; company: string }>;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
}

const searchAPI = {
  /**
   * Search resumes
   */
  search: async (query: string, filters: SearchFilters) => {
    const response = await apiClient.post('/search', {
      query,
      filters,
    });
    return response.data;
  },

  /**
   * Get search suggestions
   */
  getSuggestions: async (query: string, type: 'skills' | 'locations' | 'titles' = 'skills') => {
    const response = await apiClient.get('/search/suggestions', {
      params: {
        q: query,
        type,
      },
    });
    return response.data;
  },

  /**
   * Get trending skills
   */
  getTrendingSkills: async () => {
    const response = await apiClient.get('/search/trending');
    return response.data;
  },

  /**
   * Get popular searches
   */
  getPopularSearches: async () => {
    const response = await apiClient.get('/search/popular');
    return response.data;
  },
};

export default searchAPI;
