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

const router = Router();

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
    if (user.aiCredits < creditCost) {
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

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
    if (user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Generate bullet points
    const result = await generateBulletPoints(jobDescription, numberOfPoints);

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
    if (user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Tailor resume
    const result = await tailorForJob(resumeContent, jobDescription);

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
    if (user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Score ATS
    const result = await scoreATS(resumeContent, jobDescription);

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
    if (user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Generate cover letter
    const result = await generateCoverLetter(resumeContent, jobDescription, companyName);

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
    if (user.aiCredits < creditCost) {
      res.status(402).json({
        success: false,
        message: 'Insufficient AI credits',
      });
      return;
    }

    // Extract keywords
    const result = await extractKeywords(jobDescription);

    // Deduct credits
    user.aiCredits -= creditCost;
    await user.save();

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
