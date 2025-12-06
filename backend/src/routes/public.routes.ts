import { Router, Request, Response } from 'express';
import { Resume } from '../models/Resume.model';
import { Profile } from '../models/Profile.model';
import { User } from '../models/User.model';
import { Analytics } from '../models/Analytics.model';
import { logger } from '../utils/logger';

const router = Router();

/**
 * GET /api/public/r/:shortId
 * Get public resume by short ID
 * Tracks view analytics
 */
router.get('/r/:shortId', async (req: Request, res: Response) => {
  try {
    const { shortId } = req.params;

    // Find resume by shortId
    const resume = await Resume.findOne({ shortId, visibility: { $in: ['public', 'password'] } });
    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    // Check if resume is password protected
    if (resume.visibility === 'password') {
      const { password } = req.query;
      if (!password || password !== resume.password) {
        res.status(403).json({
          success: false,
          message: 'Password required',
          passwordRequired: true,
        });
        return;
      }
    }

    // Check if resume is expired
    if (resume.visibility === 'expiring' && resume.expiresAt && new Date() > resume.expiresAt) {
      res.status(410).json({
        success: false,
        message: 'Resume link has expired',
      });
      return;
    }

    // Get profile and user data
    const profile = await Profile.findById(resume.profileId);
    const user = await User.findById(resume.userId);

    if (!profile || !user) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }

    // Track analytics (async - don't block response)
    trackResumeView(resume._id as any, resume.userId as any, req)
      .catch((err) => logger.error('Analytics tracking error:', err));

    res.json({
      success: true,
      data: {
        resume: {
          id: resume._id,
          name: resume.title,
          templateId: resume.templateId,
          customizations: resume.customizations,
          visibility: resume.visibility,
          shortId: resume.shortId,
          viewCount: resume.viewCount,
          downloadCount: resume.downloadCount,
        },
        profile: {
          personalInfo: profile.personalInfo,
          contact: profile.contact,
          summary: profile.summary,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          projects: profile.projects,
          certifications: profile.certifications,
          languages: profile.languages,
          achievements: profile.achievements,
        },
        user: {
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
        },
      },
    });
  } catch (error) {
    logger.error('Public resume fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
    });
  }
});

/**
 * GET /api/public/profile/:username
 * Get public profile by username
 */
router.get('/profile/:username', async (req: Request, res: Response) => {
  try {
    const { username } = req.params;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Get profile
    const profile = await Profile.findOne({ userId: user._id });
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }

    // Get public resumes
    const resumes = await Resume.find({
      userId: user._id,
      visibility: 'public',
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          username: user.username,
          profilePhoto: user.profilePhoto 
            ? user.profilePhoto.startsWith('http') 
              ? user.profilePhoto 
              : `${req.protocol}://${req.get('host')}${user.profilePhoto}`
            : undefined,
          createdAt: user.createdAt,
        },
        profile: {
          personalInfo: profile.personalInfo,
          contact: profile.contact,
          summary: profile.summary,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          projects: profile.projects,
          certifications: profile.certifications,
          languages: profile.languages,
          achievements: profile.achievements,
        },
        resumes: resumes.map((r) => ({
          id: r._id,
          name: r.title,
          shortId: r.shortId,
          slug: r.slug,
          templateId: r.templateId,
          viewCount: r.viewCount,
          downloadCount: r.downloadCount,
          createdAt: r.createdAt,
        })),
      },
    });
  } catch (error) {
    logger.error('Public profile fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
    });
  }
});

/**
 * GET /api/public/profile/:username/:slug
 * Get specific public resume by username and custom slug
 */
router.get('/profile/:username/:slug', async (req: Request, res: Response) => {
  try {
    const { username, slug } = req.params;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    // Find resume by userId and slug
    const resume = await Resume.findOne({ 
      userId: user._id, 
      slug,
      visibility: { $in: ['public', 'password'] }
    });
    
    if (!resume) {
      res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
      return;
    }

    // Check if resume is password protected
    if (resume.visibility === 'password') {
      const { password } = req.query;
      if (!password || password !== resume.password) {
        res.status(403).json({
          success: false,
          message: 'Password required',
          passwordRequired: true,
        });
        return;
      }
    }

    // Check if resume is expired
    if (resume.visibility === 'expiring' && resume.expiresAt && new Date() > resume.expiresAt) {
      res.status(410).json({
        success: false,
        message: 'Resume link has expired',
      });
      return;
    }

    // Get profile data
    const profile = await Profile.findById(resume.profileId);
    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found',
      });
      return;
    }

    // Track analytics (async - don't block response)
    trackResumeView(resume._id as any, resume.userId as any, req)
      .catch((err) => logger.error('Analytics tracking error:', err));

    res.json({
      success: true,
      data: {
        resume: {
          id: resume._id,
          name: resume.title,
          templateId: resume.templateId,
          customizations: resume.customizations,
          visibility: resume.visibility,
          shortId: resume.shortId,
          slug: resume.slug,
          viewCount: resume.viewCount,
          downloadCount: resume.downloadCount,
        },
        profile: {
          personalInfo: profile.personalInfo,
          contact: profile.contact,
          summary: profile.summary,
          experience: profile.experience,
          education: profile.education,
          skills: profile.skills,
          projects: profile.projects,
          certifications: profile.certifications,
          languages: profile.languages,
          achievements: profile.achievements,
        },
        user: {
          name: user.name,
          email: user.email,
          username: user.username,
          profilePhoto: user.profilePhoto,
        },
      },
    });
  } catch (error) {
    logger.error('Public resume by slug fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
    });
  }
});

/**
 * GET /api/analytics/:resumeId
 * Get analytics for a resume (authenticated user only)
 */
router.get('/:resumeId', async (req: Request, res: Response) => {
  try {
    const { resumeId } = req.params;
    const userId = (req as any).user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Verify ownership
    const resume = await Resume.findById(resumeId);
    if (!resume || resume.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    // Get analytics
    const analytics = await Analytics.findOne({ resumeId });
    if (!analytics) {
      res.status(404).json({
        success: false,
        message: 'No analytics available',
      });
      return;
    }

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    logger.error('Analytics fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
});

/**
 * Helper function to track resume views
 */
async function trackResumeView(resumeId: any, userId: any, req: Request) {
  try {
    // Update resume view count
    await Resume.findByIdAndUpdate(
      resumeId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    // Get or create analytics document
    let analytics = await Analytics.findOne({ resumeId, userId });
    if (!analytics) {
      analytics = new Analytics({
        resumeId,
        userId,
      });
    }

    // Update view counts
    analytics.views.total += 1;
    analytics.views.lastUpdated = new Date();

    // Update daily/weekly/monthly views
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (analytics.views.lastUpdated >= startOfDay) {
      analytics.views.today += 1;
    } else {
      analytics.views.today = 1;
    }

    if (analytics.views.lastUpdated >= startOfWeek) {
      analytics.views.thisWeek += 1;
    } else {
      analytics.views.thisWeek = 1;
    }

    if (analytics.views.lastUpdated >= startOfMonth) {
      analytics.views.thisMonth += 1;
    } else {
      analytics.views.thisMonth = 1;
    }

    // Track device type
    const userAgent = req.get('user-agent') || '';
    if (/mobile|android|iphone|ipod/i.test(userAgent)) {
      analytics.devices.mobile += 1;
    } else if (/tablet|ipad/i.test(userAgent)) {
      analytics.devices.tablet += 1;
    } else {
      analytics.devices.desktop += 1;
    }

    // Track referrer
    const referrer = req.get('referer') || 'direct';
    const referrerSource = new URL(referrer).hostname || 'direct';
    const existingReferrer = analytics.referrers.find((r) => r.source === referrerSource);
    if (existingReferrer) {
      existingReferrer.count += 1;
    } else {
      analytics.referrers.push({ source: referrerSource, count: 1 });
    }

    await analytics.save();
  } catch (error) {
    logger.error('Failed to track view:', error);
  }
}

export default router;
