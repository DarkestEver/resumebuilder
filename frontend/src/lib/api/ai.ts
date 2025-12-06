/**
 * AI Service API Client
 * Provides methods for AI enhancement endpoints
 */

import apiClient from './auth';

export interface ImproveContentRequest {
  content: string;
  operation: 'enhance' | 'fix-grammar' | 'expand';
}

export interface ImproveContentResponse {
  improved_content: string;
  tokens_used: number;
  credits_used: number;
  credits_remaining: number;
}

export interface GenerateBulletsResponse {
  bullet_points: string;
  tokens_used: number;
  credits_used: number;
  credits_remaining: number;
}

export interface TailorJobResponse {
  tailored_resume: string;
  tokens_used: number;
  credits_used: number;
  credits_remaining: number;
}

export interface ATSScoreResponse {
  score: number;
  feedback: string;
  keywords_found: string[];
  keywords_missing: string[];
  suggestions: string[];
  credits_used: number;
  credits_remaining: number;
}

export interface CoverLetterResponse {
  cover_letter: string;
  tokens_used: number;
  credits_used: number;
  credits_remaining: number;
}

export interface KeywordsResponse {
  technical_skills: string[];
  soft_skills: string[];
  tools_platforms: string[];
  certifications: string[];
  credits_used: number;
  credits_remaining: number;
}

// AI API Methods
export const aiApi = {
  /**
   * Improve resume content
   */
  improveContent: async (
    content: string,
    operation: 'enhance' | 'fix-grammar' | 'expand' = 'enhance'
  ): Promise<ImproveContentResponse> => {
    const response = await apiClient.post('/ai/improve-content', {
      content,
      operation,
    });
    return response.data.data;
  },

  /**
   * Generate resume bullet points
   */
  generateBulletPoints: async (jobDescription: string, numberOfPoints?: number): Promise<GenerateBulletsResponse> => {
    const response = await apiClient.post('/ai/generate-bullets', {
      jobDescription,
      numberOfPoints,
    });
    return response.data.data;
  },

  /**
   * Tailor resume for job
   */
  tailorForJob: async (resumeContent: string, jobDescription: string): Promise<TailorJobResponse> => {
    const response = await apiClient.post('/ai/tailor-job', {
      resumeContent,
      jobDescription,
    });
    return response.data.data;
  },

  /**
   * Score resume for ATS compatibility
   */
  scoreATS: async (resumeContent: string, jobDescription: string): Promise<ATSScoreResponse> => {
    const response = await apiClient.post('/ai/score-ats', {
      resumeContent,
      jobDescription,
    });
    return response.data.data;
  },

  /**
   * Generate cover letter
   */
  generateCoverLetter: async (
    resumeContent: string,
    jobDescription: string,
    companyName: string
  ): Promise<CoverLetterResponse> => {
    const response = await apiClient.post('/ai/generate-cover-letter', {
      resumeContent,
      jobDescription,
      companyName,
    });
    return response.data.data;
  },

  /**
   * Extract keywords from job description
   */
  extractKeywords: async (jobDescription: string): Promise<KeywordsResponse> => {
    const response = await apiClient.post('/ai/extract-keywords', {
      jobDescription,
    });
    return response.data.data;
  },
};
