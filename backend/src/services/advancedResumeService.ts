/**
 * Advanced Resume Features - AI-powered enhancements
 */

import { Resume } from '../models/Resume.model';
import { Profile } from '../models/Profile.model';

interface AtsScore {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface KeywordMatch {
  found: string[];
  missing: string[];
  matchPercentage: number;
}

class AdvancedResumeService {
  /**
   * Calculate ATS (Applicant Tracking System) score
   */
  async calculateAtsScore(resumeId: string): Promise<AtsScore> {
    const resume = await Resume.findById(resumeId).populate('profileId');

    if (!resume) {
      throw new Error('Resume not found');
    }

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];
    let score = 50; // Start with 50%

    // Check for profile content
    const profile = await Profile.findById(resume.profileId);

    if (profile?.personalInfo?.title) {
      score += 10;
      strengths.push('Professional title included');
    } else {
      weaknesses.push('Missing professional title');
      suggestions.push('Add your professional title/job title');
    }

    if (profile?.experience && profile.experience.length > 0) {
      score += 15;
      strengths.push('Work experience documented');
    } else {
      weaknesses.push('No work experience listed');
    }

    if (profile?.education && profile.education.length > 0) {
      score += 10;
      strengths.push('Education details included');
    } else {
      weaknesses.push('Missing education information');
    }

    if (profile?.skills && profile.skills.length > 0) {
      score += 15;
      strengths.push('Skills section populated');
    } else {
      weaknesses.push('Skills section is empty');
      suggestions.push('Add at least 5-10 relevant skills');
    }

    // Ensure score doesn't exceed 100
    score = Math.min(score, 100);

    return {
      score,
      strengths,
      weaknesses,
      suggestions,
    };
  }

  /**
   * Match resume with job description keywords
   */
  async matchJobDescription(resumeId: string, jobDescription: string): Promise<KeywordMatch> {
    const resume = await Resume.findById(resumeId).populate('profileId');

    if (!resume) {
      throw new Error('Resume not found');
    }

    const profile = await Profile.findById(resume.profileId);
    const resumeText = this.extractResumeText(profile);

    // Extract keywords from job description
    const jobKeywords = this.extractKeywords(jobDescription);
    const resumeKeywords = this.extractKeywords(resumeText);

    const found: string[] = [];
    const missing: string[] = [];

    jobKeywords.forEach((keyword) => {
      if (resumeKeywords.includes(keyword)) {
        found.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    const matchPercentage = (found.length / jobKeywords.length) * 100;

    return {
      found,
      missing,
      matchPercentage: Math.round(matchPercentage),
    };
  }

  /**
   * Generate resume improvement suggestions
   */
  async getImprovementSuggestions(resumeId: string): Promise<string[]> {
    const atsScore = await this.calculateAtsScore(resumeId);
    const suggestions = [...atsScore.suggestions];

    // Add content-specific suggestions
    if (atsScore.score < 70) {
      suggestions.push('Your ATS score is below 70. Focus on completing all sections of your profile.');
    }

    if (atsScore.weaknesses.length > 2) {
      suggestions.push('Consider completing your profile with more detailed information to improve compatibility.');
    }

    suggestions.push('Use standard formatting and avoid special characters that ATS systems might not recognize.');
    suggestions.push('Include relevant keywords from your industry and target job descriptions.');

    return suggestions;
  }

  /**
   * Extract text from profile
   */
  private extractResumeText(profile: any): string {
    const parts: string[] = [];

    if (profile?.personalInfo?.title) parts.push(profile.personalInfo.title);
    if (profile?.personalInfo?.firstName) parts.push(profile.personalInfo.firstName);
    if (profile?.personalInfo?.lastName) parts.push(profile.personalInfo.lastName);
    if (profile?.experience) {
      profile.experience.forEach((exp: any) => {
        parts.push(exp.title, exp.company, exp.description || '');
      });
    }
    if (profile?.education) {
      profile.education.forEach((edu: any) => {
        parts.push(edu.school, edu.field || '', edu.description || '');
      });
    }
    if (profile?.skills) {
      parts.push(profile.skills.join(' '));
    }
    if (profile?.projects) {
      profile.projects.forEach((proj: any) => {
        parts.push(proj.name, proj.description || '');
      });
    }

    return parts.join(' ').toLowerCase();
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Simple keyword extraction (in production, use NLP library)
    const words = text
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3);

    // Remove duplicates and common words
    const commonWords = ['this', 'that', 'with', 'from', 'have', 'been', 'were', 'your', 'will', 'also'];
    return [...new Set(words)].filter((word) => !commonWords.includes(word));
  }

  /**
   * Get resume completeness percentage
   */
  async getCompletenessScore(resumeId: string): Promise<{
    percentage: number;
    completed: string[];
    remaining: string[];
  }> {
    const resume = await Resume.findById(resumeId).populate('profileId');

    if (!resume) {
      throw new Error('Resume not found');
    }

    const profile = await Profile.findById(resume.profileId);
    const completed: string[] = [];
    const remaining: string[] = [];

    const sections = [
      { name: 'Personal Info', hasData: profile?.personalInfo?.firstName && profile?.personalInfo?.lastName },
      { name: 'Professional Title', hasData: profile?.personalInfo?.title },
      { name: 'Experience', hasData: profile?.experience && profile.experience.length > 0 },
      { name: 'Education', hasData: profile?.education && profile.education.length > 0 },
      { name: 'Skills', hasData: profile?.skills && profile.skills.length > 0 },
      { name: 'Projects', hasData: profile?.projects && profile.projects.length > 0 },
    ];

    sections.forEach((section) => {
      if (section.hasData) {
        completed.push(section.name);
      } else {
        remaining.push(section.name);
      }
    });

    const percentage = (completed.length / sections.length) * 100;

    return {
      percentage: Math.round(percentage),
      completed,
      remaining,
    };
  }
}

export default new AdvancedResumeService();
