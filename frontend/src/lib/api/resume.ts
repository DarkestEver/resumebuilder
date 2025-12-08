/**
 * Resume API Client
 * Provides methods for resume management endpoints
 */

import apiClient from './auth';

// Types
export interface CreateResumeData {
  title?: string;
  templateId?: string;
  name?: string;
  slug?: string;
}

export interface UpdateResumeData {
  title?: string;
  templateId?: string;
  customizations?: any;
  data?: {
    personalInfo?: any;
    contact?: any;
    summary?: string;
    experience?: any[];
    education?: any[];
    skills?: any[];
    projects?: any[];
    certifications?: any[];
    languages?: any[];
    achievements?: any[];
  };
  visibility?: string;
  password?: string;
  expiresAt?: Date;
  slug?: string;
}

export interface Resume {
  _id?: string;
  id?: string;
  userId: string;
  profileId: string;
  title: string;
  name?: string;
  templateId: string;
  data?: {
    personalInfo?: any;
    contact?: any;
    summary?: string;
    experience?: any[];
    education?: any[];
    skills?: any[];
    projects?: any[];
    certifications?: any[];
    languages?: any[];
    achievements?: any[];
  };
  lastSyncedAt?: string;
  customizations: any;
  visibility: string;
  shortId: string;
  slug?: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumesResponse {
  success: boolean;
  data: {
    resumes: Resume[];
  };
}

export interface ResumeResponse {
  success: boolean;
  data: {
    resume: Resume;
  };
}

// Resume API Methods
export const getResumes = async (): Promise<Resume[]> => {
  const response = await apiClient.get<ResumesResponse>('/resumes');
  return response.data.data.resumes;
};

export const createResume = async (data: CreateResumeData): Promise<Resume> => {
  const response = await apiClient.post<ResumeResponse>('/resumes', {
    title: data.name || data.title,
    templateId: data.templateId,
    slug: data.slug,
  });
  return response.data.data.resume;
};

export const updateResume = async (id: string, data: Partial<UpdateResumeData>): Promise<Resume> => {
  const response = await apiClient.put<ResumeResponse>(`/resumes/${id}`, data);
  return response.data.data.resume;
};

export const deleteResume = async (id: string): Promise<void> => {
  await apiClient.delete(`/resumes/${id}`);
};

export const exportResumePDF = async (id: string): Promise<void> => {
  try {
    const response = await apiClient.get(`/resumes/${id}/export-pdf`, {
      responseType: 'blob',
    });
    
    // Check if response is actually a blob
    if (!(response.data instanceof Blob)) {
      throw new Error('Invalid PDF response from server');
    }
    
    // Check if it's an error response disguised as blob
    if (response.data.type === 'application/json') {
      const text = await response.data.text();
      const errorData = JSON.parse(text);
      throw new Error(errorData.message || 'Failed to generate PDF');
    }
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `resume-${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export PDF error:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to export PDF. Please try again.');
  }
};

export const resumeApi = {
  /**
   * Get all resumes
   */
  getAllResumes: async (): Promise<ResumesResponse> => {
    const response = await apiClient.get<ResumesResponse>('/resumes');
    return response.data;
  },

  /**
   * Get single resume
   */
  getResume: async (id: string): Promise<ResumeResponse> => {
    const response = await apiClient.get<ResumeResponse>(`/resumes/${id}`);
    return response.data;
  },

  /**
   * Create new resume
   */
  createResume: async (data: CreateResumeData): Promise<ResumeResponse> => {
    const response = await apiClient.post<ResumeResponse>('/resumes', data);
    return response.data;
  },

  /**
   * Update resume
   */
  updateResume: async (id: string, data: UpdateResumeData): Promise<ResumeResponse> => {
    const response = await apiClient.put<ResumeResponse>(`/resumes/${id}`, data);
    return response.data;
  },

  /**
   * Delete resume
   */
  deleteResume: async (id: string) => {
    const response = await apiClient.delete(`/resumes/${id}`);
    return response.data;
  },

  /**
   * Duplicate resume
   */
  duplicateResume: async (id: string): Promise<ResumeResponse> => {
    const response = await apiClient.post<ResumeResponse>(`/resumes/${id}/duplicate`);
    return response.data;
  },

  /**
   * Update resume visibility
   */
  updateVisibility: async (
    id: string,
    visibility: string,
    password?: string,
    expiresAt?: Date
  ) => {
    const response = await apiClient.put(`/resumes/${id}/visibility`, {
      visibility,
      password,
      expiresAt,
    });
    return response.data;
  },

  /**
   * Get public resume
   */
  getPublicResume: async (shortId: string) => {
    const response = await apiClient.get(`/resume/public/${shortId}`);
    return response.data;
  },

  /**
   * Generate PDF
   */
  generatePDF: async (id: string) => {
    const response = await apiClient.get(`/resumes/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Tailor resume for job
   */
  tailorResume: async (id: string, jobDescription: string) => {
    const response = await apiClient.post(`/resumes/${id}/tailor`, {
      jobDescription,
    });
    return response.data;
  },

  /**
   * Sync resume data from profile
   */
  syncFromProfile: async (id: string) => {
    const response = await apiClient.post(`/resumes/${id}/sync-from-profile`);
    return response.data;
  },

  /**
   * Export resume as PDF
   */
  exportPDF: async (id: string): Promise<void> => {
    try {
      const response = await apiClient.get(`/resumes/${id}/export-pdf`, {
        responseType: 'blob',
      });
      
      // Check if response is actually a blob
      if (!(response.data instanceof Blob)) {
        throw new Error('Invalid PDF response from server');
      }
      
      // Check if it's an error response disguised as blob
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const errorData = JSON.parse(text);
        throw new Error(errorData.message || 'Failed to generate PDF');
      }
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `resume-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export PDF error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to export PDF. Please try again.');
    }
  },
};
