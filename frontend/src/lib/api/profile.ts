/**
 * Profile API Client
 * Provides methods for profile management endpoints
 */

import apiClient from './auth';

// Types
export interface ProfileData {
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    photo?: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      country?: string;
      zipCode?: string;
    };
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary?: string;
  experience?: Array<{
    title?: string;
    company?: string;
    location?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    current?: boolean;
    description?: string;
    achievements?: string[];
  }>;
  education?: Array<{
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    current?: boolean;
    gpa?: string;
    achievements?: string[];
  }>;
  skills?: Array<{
    name?: string;
    category?: string;
    level?: string;
  }>;
  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    link?: string;
    startDate?: string | Date;
    endDate?: string | Date;
  }>;
  certifications?: Array<{
    name?: string;
    issuer?: string;
    date?: string | Date;
    expiryDate?: string | Date;
    credentialId?: string;
    link?: string;
  }>;
  achievements?: string[];
  languages?: Array<{
    name?: string;
    proficiency?: string;
  }>;
  courses?: Array<{
    name?: string;
    institution?: string;
    date?: string | Date;
    link?: string;
  }>;
  publications?: Array<{
    title?: string;
    publisher?: string;
    date?: string | Date;
    link?: string;
  }>;
  patents?: Array<{
    title?: string;
    patentNumber?: string;
    date?: string | Date;
    link?: string;
  }>;
  links?: {
    portfolio?: string;
    blog?: string;
    twitter?: string;
    other?: string[];
  };
  interests?: string[];
  videoProfile?: {
    url: string;
    thumbnail?: string;
    transcript?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: {
    profile: ProfileData & {
      _id: string;
      userId: string;
      completionPercentage: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface CompletionResponse {
  success: boolean;
  data: {
    completionPercentage: number;
    missingSections: string[];
  };
}

// Profile API Methods
export const profileApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get<ProfileResponse>('/profiles');
    return response.data;
  },

  /**
   * Create profile
   */
  createProfile: async (data: ProfileData): Promise<ProfileResponse> => {
    const response = await apiClient.post<ProfileResponse>('/profiles', data);
    return response.data;
  },

  /**
   * Update profile
   */
  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileResponse> => {
    const response = await apiClient.put<ProfileResponse>('/profiles', data);
    return response.data;
  },

  /**
   * Delete profile
   */
  deleteProfile: async () => {
    const response = await apiClient.delete('/profiles');
    return response.data;
  },

  /**
   * Update specific section
   */
  updateSection: async (section: string, data: any): Promise<ProfileResponse> => {
    const response = await apiClient.put<ProfileResponse>(`/profiles/section/${section}`, {
      [section]: data,
    });
    return response.data;
  },

  /**
   * Get profile completion status
   */
  getCompletion: async (): Promise<CompletionResponse> => {
    const response = await apiClient.get<CompletionResponse>('/profiles/completion');
    return response.data;
  },
};
