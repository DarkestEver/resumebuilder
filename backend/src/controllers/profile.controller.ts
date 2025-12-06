import { Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile.model';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class ProfileController {
  /**
   * Get user's profile
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });

      if (!profile) {
        res.json({
          success: true,
          data: { profile: null },
          message: 'No profile found. Create one to get started.',
        });
        return;
      }

      res.json({
        success: true,
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new profile
   */
  static async createProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Check if profile already exists
      const existingProfile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (existingProfile) {
        throw new AppError('Profile already exists. Use update endpoint instead.', 409);
      }

      // Create profile
      const profile = await Profile.create({
        userId: req.user.userId,
        ...req.body,
      });

      logger.info(`Profile created for user: ${req.user.userId}`);

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update profile
   */
  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (!profile) {
        throw new AppError('Profile not found. Create one first.', 404);
      }

      // Update fields
      Object.assign(profile, req.body);
      
      // Recalculate completion percentage
      profile.completionPercentage = ProfileController.calculateCompletion(profile);
      
      await profile.save();

      logger.info(`Profile updated for user: ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { profile },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete profile (soft delete)
   */
  static async deleteProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (!profile) {
        throw new AppError('Profile not found', 404);
      }

      profile.deletedAt = new Date();
      await profile.save();

      logger.info(`Profile deleted for user: ${req.user.userId}`);

      res.json({
        success: true,
        message: 'Profile deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update specific section
   */
  static async updateSection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { section } = req.params;
      const allowedSections = [
        'personalInfo',
        'contact',
        'summary',
        'experience',
        'education',
        'skills',
        'projects',
        'certifications',
        'achievements',
        'languages',
        'courses',
        'publications',
        'patents',
        'links',
        'interests',
        'videoProfile',
      ];

      if (!allowedSections.includes(section)) {
        throw new AppError(`Invalid section: ${section}`, 400);
      }

      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (!profile) {
        throw new AppError('Profile not found. Create one first.', 404);
      }

      // Update specific section
      (profile as any)[section] = req.body;
      
      // Recalculate completion
      profile.completionPercentage = ProfileController.calculateCompletion(profile);
      
      await profile.save();

      res.json({
        success: true,
        message: `${section} updated successfully`,
        data: { 
          profile,
          completionPercentage: profile.completionPercentage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Calculate profile completion percentage
   */
  private static calculateCompletion(profile: any): number {
    const sections = [
      'personalInfo',
      'contact',
      'summary',
      'experience',
      'education',
      'skills',
    ];

    let completed = 0;
    const total = sections.length;

    sections.forEach((section) => {
      const data = profile[section];
      
      if (section === 'personalInfo' && data?.fullName && data?.email) {
        completed++;
      } else if (section === 'contact' && (data?.phone || data?.email)) {
        completed++;
      } else if (section === 'summary' && data && data.length > 20) {
        completed++;
      } else if (Array.isArray(data) && data.length > 0) {
        completed++;
      }
    });

    return Math.round((completed / total) * 100);
  }

  /**
   * Get profile completion status
   */
  static async getCompletionStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (!profile) {
        res.json({
          success: true,
          data: { 
            completionPercentage: 0,
            missingSections: ['All sections'],
          },
        });
        return;
      }

      const missingSections: string[] = [];
      
      if (!profile.personalInfo?.firstName) missingSections.push('Personal Information');
      if (!profile.contact?.email) missingSections.push('Contact Information');
      if (!profile.summary) missingSections.push('Professional Summary');
      if (!profile.experience || profile.experience.length === 0) missingSections.push('Work Experience');
      if (!profile.education || profile.education.length === 0) missingSections.push('Education');
      if (!profile.skills || profile.skills.length === 0) missingSections.push('Skills');

      res.json({
        success: true,
        data: {
          completionPercentage: profile.completionPercentage,
          missingSections,
          isComplete: profile.completionPercentage === 100,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
