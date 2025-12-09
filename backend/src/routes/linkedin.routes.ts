import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { LinkedInService } from '../services/linkedin.service';
import { logger } from '../utils/logger';
import { Profile } from '../models/Profile.model';

const router = Router();

/**
 * GET /api/linkedin/auth-url
 * Get LinkedIn OAuth authorization URL
 */
router.get('/auth-url', authenticate, (req: Request, res: Response) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.FRONTEND_URL}/profile?linkedin=callback`;
  const state = req.user?.userId || 'state';
  const scope = 'r_liteprofile r_emailaddress w_member_social';

  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&state=${state}&scope=${encodeURIComponent(scope)}`;

  res.json({
    success: true,
    data: { authUrl },
  });
});

/**
 * POST /api/linkedin/sync
 * Sync profile data from LinkedIn
 */
router.post('/sync', authenticate, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const userId = req.user?.userId;

    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      });
      return;
    }

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }

    // Exchange code for access token
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI || `${process.env.FRONTEND_URL}/profile?linkedin=callback`;
    const accessToken = await LinkedInService.exchangeCodeForToken(code, redirectUri);

    // Fetch LinkedIn profile data
    const linkedInData = await LinkedInService.getProfile(accessToken);

    // Transform to our profile format
    const profileData = LinkedInService.transformToProfile(linkedInData);

    // Find or create profile
    let profile = await Profile.findOne({ userId });

    if (profile) {
      // Merge with existing profile (LinkedIn data takes precedence)
      profile.personalInfo = {
        ...profile.personalInfo,
        ...profileData.personalInfo,
      };
      profile.contact = {
        ...profile.contact,
        ...profileData.contact,
      };
      profile.summary = profileData.summary || profile.summary;
      
      // Add new experiences (avoid duplicates)
      if (profileData.experience.length > 0) {
        const existingTitles = new Set(profile.experience.map((e: any) => `${e.role}-${e.company}`));
        const newExperiences = profileData.experience.filter(
          (e) => !existingTitles.has(`${e.role}-${e.company}`)
        );
        profile.experience = [...newExperiences, ...profile.experience];
      }

      // Add new education (avoid duplicates)
      if (profileData.education.length > 0) {
        const existingEdu = new Set(profile.education.map((e: any) => `${e.institution}-${e.degree}`));
        const newEducation = profileData.education.filter(
          (e) => !existingEdu.has(`${e.institution}-${e.degree}`)
        );
        profile.education = [...newEducation, ...profile.education];
      }

      // Add new skills (avoid duplicates)
      if (profileData.skills.length > 0) {
        const existingSkills = new Set(profile.skills.map((s: any) => s.name.toLowerCase()));
        const newSkills = profileData.skills.filter(
          (s) => !existingSkills.has(s.name.toLowerCase())
        );
        profile.skills = [...newSkills, ...profile.skills];
      }

      await profile.save();
    } else {
      // Create new profile
      profile = await Profile.create({
        userId,
        ...profileData,
      });
    }

    logger.info(`LinkedIn profile synced for user: ${userId}`);

    res.json({
      success: true,
      message: 'LinkedIn profile synced successfully',
      data: { profile },
    });
  } catch (error: any) {
    logger.error('LinkedIn sync error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to sync LinkedIn profile',
    });
  }
});

export default router;
