import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config';
import { logger } from '../utils/logger';

/**
 * =============================================================================
 * AI SERVICE - MULTI-PROVIDER SUPPORT
 * =============================================================================
 * This service supports multiple AI providers: Google Gemini, OpenAI, Anthropic
 * 
 * CURRENT ACTIVE PROVIDER: Google Gemini (gemini-1.5-flash)
 * 
 * To switch providers:
 * 1. Set AI_PRIMARY_PROVIDER in your .env file to: 'gemini', 'openai', or 'anthropic'
 * 2. Ensure the corresponding API key is set (GEMINI_API_KEY, OPENAI_API_KEY, or ANTHROPIC_API_KEY)
 * 3. Restart the server
 * 
 * The service automatically routes requests to the active provider
 * =============================================================================
 */

interface AIResponse {
  content: string;
  tokens_used: number;
  model: string;
}

// Initialize AI clients for all providers
// Note: Only the active provider (based on config.ai.primaryProvider) will be used

// GOOGLE GEMINI CLIENT (Active by default)
const geminiClient = config.ai.gemini.apiKey 
  ? new GoogleGenerativeAI(config.ai.gemini.apiKey)
  : null;

// OPENAI CLIENT (Inactive - activate by setting AI_PRIMARY_PROVIDER=openai)
// const openaiClient = ...; // Handled via direct API calls

// ANTHROPIC CLIENT (Inactive - activate by setting AI_PRIMARY_PROVIDER=anthropic)
// const anthropicClient = ...; // Handled via direct API calls

/**
 * =============================================================================
 * HELPER FUNCTION: Call AI Provider
 * =============================================================================
 * This function routes requests to the appropriate AI provider based on config
 * Supports: Gemini, OpenAI, Anthropic
 * =============================================================================
 */
async function callAI(systemPrompt: string, userPrompt: string, options: {
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
} = {}): Promise<{ content: string; tokensUsed: number; model: string }> {
  const provider = config.ai.primaryProvider;
  const temperature = options.temperature ?? 0.7;
  const maxTokens = options.maxTokens ?? 1000;

  try {
    // ============================================================================
    // GOOGLE GEMINI (ACTIVE PROVIDER)
    // ============================================================================
    if (provider === 'gemini') {
      if (!geminiClient) {
        throw new Error('Gemini API key not configured');
      }

      const model = geminiClient.getGenerativeModel({ 
        model: config.ai.gemini.model,
        generationConfig: {
          temperature: temperature,
          maxOutputTokens: maxTokens,
          ...(options.jsonMode && { responseMimeType: 'application/json' }),
        },
      });

      const prompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      
      return {
        content: response.text(),
        tokensUsed: response.usageMetadata?.totalTokenCount || 0,
        model: config.ai.gemini.model,
      };
    }

    // ============================================================================
    // OPENAI (Inactive - To activate: set AI_PRIMARY_PROVIDER=openai in .env)
    // ============================================================================
    else if (provider === 'openai') {
      if (!config.ai.openai.apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const requestBody: any = {
        model: config.ai.openai.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: maxTokens,
        temperature: temperature,
      };

      // Enable JSON mode if requested (for GPT-4 and newer)
      if (options.jsonMode) {
        requestBody.response_format = { type: 'json_object' };
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${config.ai.openai.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        tokensUsed: response.data.usage.total_tokens,
        model: config.ai.openai.model,
      };
    }

    // ============================================================================
    // ANTHROPIC CLAUDE (Inactive - To activate: set AI_PRIMARY_PROVIDER=anthropic in .env)
    // ============================================================================
    else if (provider === 'anthropic') {
      if (!config.ai.anthropic.apiKey) {
        throw new Error('Anthropic API key not configured');
      }

      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: config.ai.anthropic.model,
          max_tokens: maxTokens,
          temperature: temperature,
          system: systemPrompt,
          messages: [
            { role: 'user', content: userPrompt },
          ],
        },
        {
          headers: {
            'x-api-key': config.ai.anthropic.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.content[0].text,
        tokensUsed: response.data.usage.input_tokens + response.data.usage.output_tokens,
        model: config.ai.anthropic.model,
      };
    }

    throw new Error(`Unsupported AI provider: ${provider}`);
  } catch (error: any) {
    logger.error(`AI Provider (${provider}) Error:`, error.message);
    throw new Error(`Failed to get response from AI provider: ${error.message}`);
  }
}

/**
 * =============================================================================
 * AI SERVICE FUNCTIONS
 * =============================================================================
 * All functions below use the callAI() helper which automatically routes
 * to the configured provider (Gemini, OpenAI, or Anthropic)
 * =============================================================================
 */

/**
 * Improve resume content using AI
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function improveContent(content: string, operation: 'enhance' | 'fix-grammar' | 'expand'): Promise<AIResponse> {
  try {
    // Check if content contains resume context (multiple sections)
    const hasContext = content.includes('EXPERIENCE:') || content.includes('EDUCATION:') || content.includes('SKILLS:');
    
    let systemPrompt = 'You are an expert resume writer. Provide concise, impactful improvements to resume content.';
    let userPrompt = '';
    
    if (hasContext) {
      // When full resume context is provided, focus on generating a professional summary
      systemPrompt = 'You are an expert resume writer. Analyze the complete resume data and generate a powerful professional summary that highlights key achievements, skills, and career focus.';
      userPrompt = `Based on the following complete resume information, generate a professional summary (2-3 sentences) that captures the candidate's expertise, key achievements, and value proposition. Return ONLY the summary text, nothing else.\n\n${content}`;
    } else {
      // Regular content improvement
      const prompts = {
        enhance: 'Improve the following resume content to be more impactful and professional. Keep it concise:\n\n',
        'fix-grammar': 'Fix grammar and improve the clarity of the following text:\n\n',
        expand: 'Expand the following resume content with more details and impact:\n\n',
      };
      userPrompt = prompts[operation] + content;
    }

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: hasContext ? 300 : 500,
    });

    return {
      content: result.content,
      tokens_used: result.tokensUsed,
      model: result.model,
    };
  } catch (error) {
    logger.error('AI content improvement error:', error);
    throw new Error('Failed to improve content with AI');
  }
}

/**
 * Generate resume bullet points from job description
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function generateBulletPoints(jobDescription: string, numberOfPoints: number = 5): Promise<AIResponse> {
  try {
    const systemPrompt = 'You are an expert resume writer. Generate impactful bullet points for resumes.';
    const userPrompt = `Based on this job description, generate ${numberOfPoints} impactful resume bullet points that showcase relevant skills and achievements:\n\n${jobDescription}`;

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 400,
    });

    return {
      content: result.content,
      tokens_used: result.tokensUsed,
      model: result.model,
    };
  } catch (error) {
    logger.error('AI bullet point generation error:', error);
    throw new Error('Failed to generate bullet points');
  }
}

/**
 * Tailor resume for specific job description
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function tailorForJob(resumeContent: string, jobDescription: string): Promise<AIResponse> {
  try {
    const systemPrompt = 'You are an expert resume writer. Tailor resumes to match job descriptions without changing facts.';
    const userPrompt = `Tailor this resume to better match this job description. Emphasize relevant keywords and skills:\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}`;

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    return {
      content: result.content,
      tokens_used: result.tokensUsed,
      model: result.model,
    };
  } catch (error) {
    logger.error('AI resume tailoring error:', error);
    throw new Error('Failed to tailor resume');
  }
}

/**
 * Score resume for ATS compatibility
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function scoreATS(resumeContent: string, jobDescription: string): Promise<{
  score: number;
  feedback: string;
  keywords_found: string[];
  keywords_missing: string[];
  suggestions: string[];
}> {
  try {
    const systemPrompt = 'You are an ATS (Applicant Tracking System) expert. Analyze resumes for ATS compatibility.';
    const userPrompt = `Analyze this resume for ATS compatibility with this job description. Provide a score (0-100), feedback, keywords found and missing, and suggestions:\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}\n\nRespond in JSON format with keys: score, feedback, keywords_found, keywords_missing, suggestions`;

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 500,
      jsonMode: true,
    });

    const content = result.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

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
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function generateCoverLetter(
  resumeContent: string,
  jobDescription: string,
  companyName: string
): Promise<AIResponse> {
  try {
    const systemPrompt = 'You are an expert cover letter writer. Generate professional, compelling cover letters.';
    const userPrompt = `Generate a professional cover letter for this job:\n\nCompany: ${companyName}\n\nResume:\n${resumeContent}\n\nJob Description:\n${jobDescription}`;

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.7,
      maxTokens: 600,
    });

    return {
      content: result.content,
      tokens_used: result.tokensUsed,
      model: result.model,
    };
  } catch (error) {
    logger.error('Cover letter generation error:', error);
    throw new Error('Failed to generate cover letter');
  }
}

/**
 * Extract keywords from job description
 * Uses active provider configured in .env (currently: Gemini)
 */
export async function extractKeywords(jobDescription: string): Promise<{
  technical_skills: string[];
  soft_skills: string[];
  tools_platforms: string[];
  certifications: string[];
}> {
  try {
    const systemPrompt = 'You are an expert at extracting keywords from job descriptions. Categorize keywords into technical skills, soft skills, tools/platforms, and certifications.';
    const userPrompt = `Extract and categorize keywords from this job description:\n\n${jobDescription}\n\nRespond in JSON format with keys: technical_skills, soft_skills, tools_platforms, certifications`;

    const result = await callAI(systemPrompt, userPrompt, {
      temperature: 0.5,
      maxTokens: 400,
      jsonMode: true,
    });

    const content = result.content;
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);
  } catch (error) {
    logger.error('Keyword extraction error:', error);
    return {
      technical_skills: [],
      soft_skills: [],
      tools_platforms: [],
      certifications: [],
    };
  }
}
