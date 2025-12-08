import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
  improveContent,
  generateBulletPoints,
  tailorForJob,
  scoreATS,
  generateCoverLetter,
  extractKeywords,
} from '../services/aiService';
import { User } from '../models/User.model';
import { logger } from '../utils/logger';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for PDF uploads (AI scoring)
const uploadDir = 'uploads/temp';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'pdf-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (_req: any, file: any, cb: any) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// AI Credits tracking (basic implementation)
const AI_OPERATIONS_COST = {
  improve_content: 100,
  generate_bullets: 150,
  tailor_job: 200,
  score_ats: 150,
  generate_cover: 250,
  extract_keywords: 100,
};

/**
 * POST /api/ai/improve-content
 * Improve resume content
 */
router.post('/improve-content', authenticate, async (req: Request, res: Response) => {
  try {
    const { content, operation = 'enhance' } = req.body;
    const userId = req.user?.userId;

    if (!content) {
      res.status(400).json({
        success: false,
        message: 'Content is required',
      });
      return;
    }

    // Check user plan and AI credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.improve_content;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
        creditsNeeded: creditCost,
        creditsAvailable: user.aiCredits,
      });
      return;
    }

    // Call AI service
    const result = await improveContent(content, operation);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        improved_content: result.content,
        tokens_used: result.tokens_used,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('Content improvement error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to improve content',
    });
  }
});

/**
 * POST /api/ai/generate-bullets
 * Generate resume bullet points
 */
router.post('/generate-bullets', authenticate, async (req: Request, res: Response) => {
  try {
    const { jobDescription, numberOfPoints = 5 } = req.body;
    const userId = req.user?.userId;

    if (!jobDescription) {
      res.status(400).json({
        success: false,
        message: 'Job description is required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.generate_bullets;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Generate bullet points
    const result = await generateBulletPoints(jobDescription, numberOfPoints);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        bullet_points: result.content,
        tokens_used: result.tokens_used,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('Bullet generation error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate bullet points',
    });
  }
});

/**
 * POST /api/ai/tailor-job
 * Tailor resume for specific job
 */
router.post('/tailor-job', authenticate, async (req: Request, res: Response) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    const userId = req.user?.userId;

    if (!resumeContent || !jobDescription) {
      res.status(400).json({
        success: false,
        message: 'Resume content and job description are required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.tailor_job;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Tailor resume
    const result = await tailorForJob(resumeContent, jobDescription);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        tailored_resume: result.content,
        tokens_used: result.tokens_used,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('Resume tailoring error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to tailor resume',
    });
  }
});

/**
 * POST /api/ai/score-ats
 * Score resume for ATS compatibility
 */
router.post('/score-ats', authenticate, async (req: Request, res: Response) => {
  try {
    const { resumeContent, jobDescription } = req.body;
    const userId = req.user?.userId;

    if (!resumeContent || !jobDescription) {
      res.status(400).json({
        success: false,
        message: 'Resume content and job description are required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.score_ats;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Score ATS
    const result = await scoreATS(resumeContent, jobDescription);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        ...result,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('ATS scoring error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to score ATS',
    });
  }
});

/**
 * POST /api/ai/score-resume-pdf
 * Upload and score PDF resume for ATS compatibility
 */
router.post('/score-resume-pdf', authenticate, upload.single('pdf'), async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    // Check if file was uploaded
    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'PDF file is required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.score_ats;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Extract text from PDF with multiple fallback strategies
    let resumeText = '';
    const fileBuffer = fs.readFileSync(req.file.path);
    
    try {
      // Strategy 1: Try pdf-parse first (works for most PDFs)
      const pdf = require('pdf-parse');
      const data = await pdf(fileBuffer);
      resumeText = data.text;
      console.log('PDF parsed successfully with pdf-parse');
    } catch (pdfParseError: any) {
      console.warn('pdf-parse failed:', pdfParseError.message);
      
      // Strategy 2: Try pdf2json as fallback
      try {
        const PDFParser = require('pdf2json');
        const pdfParser = new PDFParser();
        
        await new Promise((resolve, reject) => {
          pdfParser.on('pdfParser_dataError', (errData: any) => reject(errData.parserError));
          pdfParser.on('pdfParser_dataReady', (pdfData: any) => {
            // Extract text from parsed data
            const text = pdfData.Pages.map((page: any) =>
              page.Texts.map((textItem: any) =>
                textItem.R.map((r: any) => decodeURIComponent(r.T)).join(' ')
              ).join(' ')
            ).join('\n');
            resumeText = text;
            resolve(text);
          });
          pdfParser.parseBuffer(fileBuffer);
        });
        console.log('PDF parsed successfully with pdf2json');
      } catch (pdf2jsonError: any) {
        console.error('All PDF parsing strategies failed:', pdf2jsonError.message);
        // Clean up temp file before throwing error
        fs.unlinkSync(req.file.path);
        res.status(400).json({
          success: false,
          message: 'Unable to parse PDF file. The file may be corrupted, password-protected, or use an unsupported format. Please try re-exporting your resume as a standard PDF.',
          error: pdfParseError.message,
        });
        return;
      }
    }

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    if (!resumeText || resumeText.trim().length < 100) {
      res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text.',
      });
      return;
    }

    // Score the resume with comprehensive analysis
    const result = await scoreATSComprehensive(resumeText);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        ...result,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('PDF ATS scoring error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to score PDF resume',
    });
  }
});

/**
 * Comprehensive ATS scoring function
 * Uses active AI provider configured in .env (currently: Gemini)
 * 
 * To switch providers, change AI_PRIMARY_PROVIDER in .env to:
 * - 'gemini' (Google Gemini - active, cost-effective)
 * - 'openai' (OpenAI GPT models)
 * - 'anthropic' (Anthropic Claude models)
 */
async function scoreATSComprehensive(resumeText: string) {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  const { config } = require('../config');

  const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility. Provide a comprehensive score and detailed feedback.

Resume Content:
${resumeText}

Provide analysis in the following JSON format:
{
  "overallScore": <number 0-100>,
  "formatScore": <number 0-100>,
  "contentScore": <number 0-100>,
  "keywordScore": <number 0-100>,
  "structureScore": <number 0-100>,
  "sections": [
    { "name": "Contact Information", "score": <number>, "feedback": "<feedback>" },
    { "name": "Professional Summary", "score": <number>, "feedback": "<feedback>" },
    { "name": "Work Experience", "score": <number>, "feedback": "<feedback>" },
    { "name": "Education", "score": <number>, "feedback": "<feedback>" },
    { "name": "Skills", "score": <number>, "feedback": "<feedback>" }
  ],
  "strengths": ["<strength 1>", "<strength 2>", ...],
  "weaknesses": ["<weakness 1>", "<weakness 2>", ...],
  "recommendations": ["<recommendation 1>", "<recommendation 2>", ...],
  "keywords": {
    "found": ["<keyword 1>", "<keyword 2>", ...],
    "missing": ["<missing keyword 1>", "<missing keyword 2>", ...]
  }
}

Scoring Criteria:
- formatScore: Clean structure, no tables/images, single column, standard fonts
- contentScore: Strong action verbs, quantified achievements, relevant experience
- keywordScore: Industry keywords, skills, technologies, certifications
- structureScore: Clear sections, proper order, consistent formatting, bullet points

Provide 5-7 strengths, 3-5 weaknesses, and 5-8 actionable recommendations.`;

  const provider = config.ai.primaryProvider;

  // ============================================================================
  // GOOGLE GEMINI (ACTIVE PROVIDER)
  // ============================================================================
  if (provider === 'gemini') {
    const genAI = new GoogleGenerativeAI(config.ai.gemini.apiKey);
    const model = genAI.getGenerativeModel({
      model: config.ai.gemini.model,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 2000,
        responseMimeType: 'application/json',
      },
    });

    const systemInstruction = 'You are an ATS resume expert. Analyze resumes and provide comprehensive scoring and feedback in JSON format.';
    const fullPrompt = `${systemInstruction}\n\n${prompt}`;
    
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    return JSON.parse(response.text());
  }

  // ============================================================================
  // OPENAI (Inactive - To activate: set AI_PRIMARY_PROVIDER=openai in .env)
  // ============================================================================
  else if (provider === 'openai') {
    const openai = require('../config/openai');
    const response = await openai.chat.completions.create({
      model: config.ai.openai.model,
      messages: [
        {
          role: 'system',
          content: 'You are an ATS resume expert. Analyze resumes and provide comprehensive scoring and feedback in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content);
  }

  // ============================================================================
  // ANTHROPIC CLAUDE (Inactive - To activate: set AI_PRIMARY_PROVIDER=anthropic in .env)
  // ============================================================================
  else if (provider === 'anthropic') {
    const axios = require('axios');
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: config.ai.anthropic.model,
        max_tokens: 2000,
        temperature: 0.3,
        system: 'You are an ATS resume expert. Analyze resumes and provide comprehensive scoring and feedback in JSON format.',
        messages: [
          { role: 'user', content: prompt },
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

    return JSON.parse(response.data.content[0].text);
  }

  throw new Error(`Unsupported AI provider: ${provider}`);
}

/**
 * POST /api/ai/generate-cover-letter
 * Generate cover letter
 */
router.post('/generate-cover-letter', authenticate, async (req: Request, res: Response) => {
  try {
    const { resumeContent, jobDescription, companyName } = req.body;
    const userId = req.user?.userId;

    if (!resumeContent || !jobDescription || !companyName) {
      res.status(400).json({
        success: false,
        message: 'Resume content, job description, and company name are required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.generate_cover;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Generate cover letter
    const result = await generateCoverLetter(resumeContent, jobDescription, companyName);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        cover_letter: result.content,
        tokens_used: result.tokens_used,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('Cover letter generation error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to generate cover letter',
    });
  }
});

/**
 * POST /api/ai/extract-keywords
 * Extract keywords from job description
 */
router.post('/extract-keywords', authenticate, async (req: Request, res: Response) => {
  try {
    const { jobDescription } = req.body;
    const userId = req.user?.userId;

    if (!jobDescription) {
      res.status(400).json({
        success: false,
        message: 'Job description is required',
      });
      return;
    }

    // Check credits
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    const creditCost = AI_OPERATIONS_COST.extract_keywords;
    
    // DEVELOPMENT MODE: Skip credit check
    if (process.env.NODE_ENV !== 'development' && user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Extract keywords
    const result = await extractKeywords(jobDescription);

    // Deduct credits (skip in development)
    if (process.env.NODE_ENV !== 'development') {
      user.aiCredits -= creditCost;
      await user.save();
    }

    res.json({
      success: true,
      data: {
        ...result,
        credits_used: creditCost,
        credits_remaining: user.aiCredits,
      },
    });
  } catch (error) {
    logger.error('Keyword extraction error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to extract keywords',
    });
  }
});

export default router;
