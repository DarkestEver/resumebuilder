import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * AI Service for Resume Enhancement
 * Uses OpenAI GPT-4 for content generation and optimization
 */

interface AIResponse {
  content: string;
  tokens_used: number;
  model: string;
}

/**
 * Improve resume content using AI
 */
export async function improveContent(content: string, operation: 'enhance' | 'fix-grammar' | 'expand'): Promise<AIResponse> {
  try {
    const prompts = {
      enhance:
        'Improve the following resume content to be more impactful and professional. Keep it concise:\n\n',
      'fix-grammar': 'Fix grammar and improve the clarity of the following text:\n\n',
      expand: 'Expand the following resume content with more details and impact:\n\n',
    };

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert resume writer. Provide concise, impactful improvements to resume content.',
          },
          {
            role: 'user',
            content: prompts[operation] + content,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens_used: response.data.usage.total_tokens,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    logger.error('AI content improvement error:', error);
    throw new Error('Failed to improve content with AI');
  }
}

/**
 * Generate resume bullet points from job description
 */
export async function generateBulletPoints(jobDescription: string, numberOfPoints: number = 5): Promise<AIResponse> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Generate impactful bullet points for resumes.',
          },
          {
            role: 'user',
            content: `Based on this job description, generate ${numberOfPoints} impactful resume bullet points that showcase relevant skills and achievements:\n\n${jobDescription}`,
          },
        ],
        max_tokens: 400,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens_used: response.data.usage.total_tokens,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    logger.error('AI bullet point generation error:', error);
    throw new Error('Failed to generate bullet points');
  }
}

/**
 * Tailor resume for specific job description
 */
export async function tailorForJob(resumeContent: string, jobDescription: string): Promise<AIResponse> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume writer. Tailor resumes to match job descriptions without changing facts.',
          },
          {
            role: 'user',
            content: `Tailor this resume to better match this job description. Emphasize relevant keywords and skills:\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens_used: response.data.usage.total_tokens,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    logger.error('AI resume tailoring error:', error);
    throw new Error('Failed to tailor resume');
  }
}

/**
 * Score resume for ATS compatibility
 */
export async function scoreATS(resumeContent: string, jobDescription: string): Promise<{
  score: number;
  feedback: string;
  keywords_found: string[];
  keywords_missing: string[];
  suggestions: string[];
}> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an ATS (Applicant Tracking System) expert. Analyze resumes for ATS compatibility.',
          },
          {
            role: 'user',
            content: `Analyze this resume for ATS compatibility with this job description. Provide a score (0-100), feedback, keywords found and missing, and suggestions:\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}\n\nRespond in JSON format with keys: score, feedback, keywords_found, keywords_missing, suggestions`,
          },
        ],
        max_tokens: 500,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

    return {
      score: parsed.score || 0,
      feedback: parsed.feedback || '',
      keywords_found: parsed.keywords_found || [],
      keywords_missing: parsed.keywords_missing || [],
      suggestions: parsed.suggestions || [],
    };
  } catch (error) {
    logger.error('ATS scoring error:', error);
    throw new Error('Failed to score ATS compatibility');
  }
}

/**
 * Generate cover letter from resume and job description
 */
export async function generateCoverLetter(
  resumeContent: string,
  jobDescription: string,
  companyName: string
): Promise<AIResponse> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cover letter writer. Generate professional, compelling cover letters.',
          },
          {
            role: 'user',
            content: `Generate a professional cover letter for this job:\n\nCompany: ${companyName}\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}`,
          },
        ],
        max_tokens: 600,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
      tokens_used: response.data.usage.total_tokens,
      model: 'gpt-3.5-turbo',
    };
  } catch (error) {
    logger.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
}

/**
 * Extract keywords from job description
 */
export async function extractKeywords(jobDescription: string): Promise<{
  technical_skills: string[];
  soft_skills: string[];
  tools_platforms: string[];
  certifications: string[];
}> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert at extracting keywords from job descriptions. Categorize keywords into technical skills, soft skills, tools/platforms, and certifications.',
          },
          {
            role: 'user',
            content: `Extract and categorize keywords from this job description:\n\n${jobDescription}\n\nRespond in JSON format with keys: technical_skills, soft_skills, tools_platforms, certifications`,
          },
        ],
        max_tokens: 400,
        temperature: 0.5,
      },
      {
        headers: {
          Authorization: `Bearer ${config.ai.openai.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {
      technical_skills: [],
      soft_skills: [],
      tools_platforms: [],
      certifications: [],
    };
  } catch (error) {
    logger.error('Keyword extraction error:', error);
    throw new Error('Failed to extract keywords');
  }
}
