/**
 * Search Service
 * Provides search and discovery functionality
 */

import { Resume } from '../models/Resume.model';
import { Profile } from '../models/Profile.model';

interface SearchFilters {
  skills?: string[];
  location?: string;
  experience?: string;
  minExperience?: number;
  maxExperience?: number;
  templateId?: string;
  sortBy?: 'recent' | 'popular' | 'relevance';
  page?: number;
  limit?: number;
}

interface SearchResult {
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

export const searchService = {
  /**
   * Create text index on resumes for full-text search
   */
  createTextIndex: async () => {
    try {
      await Resume.collection.createIndex({ title: 'text', 'profile.summary': 'text' });
      console.log('Text index created successfully');
    } catch (error) {
      console.error('Error creating text index:', error);
    }
  },

  /**
   * Search resumes with filters
   */
  searchResumes: async (query: string, filters: SearchFilters): Promise<SearchResult[]> => {
    try {
      const {
        skills = [],
        location,
        minExperience,
        maxExperience,
        sortBy = 'recent',
        page = 1,
        limit = 10,
      } = filters;

      const skip = (page - 1) * limit;
      let searchQuery: any = {};

      // Text search
      if (query && query.trim()) {
        searchQuery.$text = { $search: query };
      }

      // Skills filter
      if (skills.length > 0) {
        searchQuery['profile.skills.name'] = { $in: skills };
      }

      // Location filter
      if (location) {
        searchQuery['profile.contact.address.city'] = new RegExp(location, 'i');
      }

      // Experience years filter
      if (minExperience !== undefined || maxExperience !== undefined) {
        const experienceDates: any = {};
        if (minExperience !== undefined) {
          experienceDates.$gte = new Date();
          experienceDates.$gte.setFullYear(experienceDates.$gte.getFullYear() - minExperience);
        }
        if (maxExperience !== undefined) {
          experienceDates.$lte = new Date();
          experienceDates.$lte.setFullYear(experienceDates.$lte.getFullYear() - maxExperience);
        }
        if (Object.keys(experienceDates).length > 0) {
          searchQuery['profile.experience.startDate'] = experienceDates;
        }
      }

      // Build sort object
      let sortOption: any = {};
      switch (sortBy) {
        case 'popular':
          sortOption = { viewCount: -1 };
          break;
        case 'relevance':
          sortOption = { score: { $meta: 'textScore' } };
          break;
        case 'recent':
        default:
          sortOption = { createdAt: -1 };
      }

      // Execute query
      const results = await Resume.find(searchQuery)
        .sort(sortOption)
        .limit(limit)
        .skip(skip)
        .populate('profileId', 'personalInfo summary skills experience contact')
        .lean();

      return results.map((resume: any) => ({
        _id: resume._id,
        title: resume.title,
        profile: resume.profileId || {},
        skills: resume.profileId?.skills || [],
        experience: resume.profileId?.experience || [],
        viewCount: resume.viewCount || 0,
        downloadCount: resume.downloadCount || 0,
        createdAt: resume.createdAt,
      })) as SearchResult[];
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },

  /**
   * Get search suggestions (autocomplete)
   */
  getSearchSuggestions: async (query: string, type: 'skills' | 'locations' | 'titles'): Promise<string[]> => {
    try {
      let suggestions: any[] = [];

      if (type === 'skills') {
        const results = await Profile.aggregate([
          { $unwind: '$skills' },
          { $match: { 'skills.name': new RegExp(query, 'i') } },
          { $group: { _id: '$skills.name', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);
        suggestions = results.map(r => r._id);
      } else if (type === 'locations') {
        const results = await Profile.aggregate([
          { $match: { 'contact.address.city': new RegExp(query, 'i') } },
          { $group: { _id: '$contact.address.city', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);
        suggestions = results.map(r => r._id).filter(r => r);
      } else if (type === 'titles') {
        const results = await Profile.aggregate([
          { $match: { 'personalInfo.title': new RegExp(query, 'i') } },
          { $group: { _id: '$personalInfo.title', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 },
        ]);
        suggestions = results.map(r => r._id).filter(r => r);
      }

      return suggestions;
    } catch (error) {
      console.error('Suggestions error:', error);
      return [];
    }
  },

  /**
   * Get popular searches
   */
  getPopularSearches: async (): Promise<string[]> => {
    try {
      // This would require tracking search queries in a separate collection
      // For now, return empty array
      return [];
    } catch (error) {
      console.error('Popular searches error:', error);
      return [];
    }
  },

  /**
   * Get trending skills
   */
  getTrendingSkills: async (): Promise<Array<{ name: string; count: number }>> => {
    try {
      const results = await Profile.aggregate([
        { $unwind: '$skills' },
        { $group: { _id: '$skills.name', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 20 },
      ]);

      return results.map(r => ({
        name: r._id,
        count: r.count,
      }));
    } catch (error) {
      console.error('Trending skills error:', error);
      return [];
    }
  },
};
