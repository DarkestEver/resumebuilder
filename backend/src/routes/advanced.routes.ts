/**
 * Advanced Features Routes - Analytics and optimization
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import advancedResumeService from '../services/advancedResumeService';

const router = Router();

/**
 * GET /api/advanced/:resumeId/ats-score
 * Calculate ATS score for a resume
 */
router.get('/:resumeId/ats-score', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const atsScore = await advancedResumeService.calculateAtsScore(resumeId);

    res.json({
      success: true,
      data: atsScore,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate ATS score',
    });
  }
});

/**
 * POST /api/advanced/:resumeId/match-job
 * Match resume with job description
 */
router.post('/:resumeId/match-job', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;
    const { jobDescription } = req.body;

    if (!jobDescription) {
      res.status(400).json({
        success: false,
        error: 'Job description required',
      });
      return;
    }

    const match = await advancedResumeService.matchJobDescription(resumeId, jobDescription);

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to match job description',
    });
  }
});

/**
 * GET /api/advanced/:resumeId/suggestions
 * Get improvement suggestions
 */
router.get('/:resumeId/suggestions', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const suggestions = await advancedResumeService.getImprovementSuggestions(resumeId);

    res.json({
      success: true,
      data: { suggestions },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get suggestions',
    });
  }
});

/**
 * GET /api/advanced/:resumeId/completeness
 * Get resume completeness score
 */
router.get('/:resumeId/completeness', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { resumeId } = req.params;

    const completeness = await advancedResumeService.getCompletenessScore(resumeId);

    res.json({
      success: true,
      data: completeness,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate completeness',
    });
  }
});

export default router;
