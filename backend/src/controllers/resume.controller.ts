import { Request, Response, NextFunction } from 'express';
import { Resume } from '../models/Resume.model';
import { Profile } from '../models/Profile.model';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 10);

export class ResumeController {
  /**
   * Get all user's resumes
   */
  static async getAllResumes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Check if lightweight response requested (only _id and title)
      const lightweight = req.query.fields === 'minimal';

      let resumes;
      if (lightweight) {
        // Only return _id, title, and templateId for dropdown
        resumes = await Resume.find({ 
          userId: req.user.userId,
          deletedAt: null,
        })
        .select('_id title templateId')
        .sort({ updatedAt: -1 });
      } else {
        // Return full resume documents
        resumes = await Resume.find({ 
          userId: req.user.userId,
          deletedAt: null,
        }).sort({ updatedAt: -1 });
      }

      res.json({
        success: true,
        data: { 
          resumes,
          count: resumes.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single resume by ID
   */
  static async getResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      }).populate('profileId');

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      res.json({
        success: true,
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create new resume
   */
  static async createResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Check if user has a profile
      const profile = await Profile.findOne({ userId: req.user.userId, deletedAt: null });
      if (!profile) {
        throw new AppError('Please create a profile first before creating a resume', 400);
      }

      const { title, templateId, visibility, customizations, slug } = req.body;

      // Generate short ID for public sharing
      const shortId = nanoid();

      // Copy data from profile to resume
      const resumeData: any = {
        userId: req.user.userId,
        profileId: profile._id,
        title: title || 'Untitled Resume',
        templateId: templateId || 'default',
        visibility: visibility || 'private',
        customizations: customizations || {},
        shortId,
        // Copy all profile data to resume (editable independently)
        data: {
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
        lastSyncedAt: new Date(),
      };

      // Only add slug if provided (to avoid duplicate key errors with sparse index)
      if (slug) {
        resumeData.slug = slug;
      }

      // Create resume
      const resume = await Resume.create(resumeData);

      logger.info(`Resume created: ${resume._id} for user: ${req.user.userId}`);

      res.status(201).json({
        success: true,
        message: 'Resume created successfully',
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update resume
   */
  static async updateResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Update allowed fields
      const { title, templateId, visibility, customizations, tailoredFor, slug, data } = req.body;

      if (title) resume.title = title;
      if (templateId) resume.templateId = templateId;
      if (visibility) resume.visibility = visibility;
      if (customizations) resume.customizations = customizations;
      if (tailoredFor) resume.tailoredFor = tailoredFor;
      if (data) {
        resume.data = data;
        resume.lastSyncedAt = new Date();
      }
      if (slug !== undefined) {
        // Validate slug format (alphanumeric, hyphens, underscores only)
        if (slug && !/^[a-zA-Z0-9_-]+$/.test(slug)) {
          throw new AppError('Invalid slug format. Use only letters, numbers, hyphens, and underscores.', 400);
        }
        resume.slug = slug || undefined;
      }

      await resume.save();

      logger.info(`Resume updated: ${resume._id}`);

      res.json({
        success: true,
        message: 'Resume updated successfully',
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete resume (soft delete)
   */
  static async deleteResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      resume.deletedAt = new Date();
      await resume.save();

      logger.info(`Resume deleted: ${resume._id}`);

      res.json({
        success: true,
        message: 'Resume deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Duplicate resume
   */
  static async duplicateResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const originalResume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!originalResume) {
        throw new AppError('Resume not found', 404);
      }

      // Create duplicate
      const duplicate = await Resume.create({
        userId: originalResume.userId,
        profileId: originalResume.profileId,
        title: `${originalResume.title} (Copy)`,
        templateId: originalResume.templateId,
        visibility: 'private',
        customizations: originalResume.customizations,
        shortId: nanoid(),
      });

      logger.info(`Resume duplicated: ${originalResume._id} → ${duplicate._id}`);

      res.status(201).json({
        success: true,
        message: 'Resume duplicated successfully',
        data: { resume: duplicate },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update resume visibility settings
   */
  static async updateVisibility(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      const { visibility, password, expiresAt } = req.body;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      resume.visibility = visibility;

      if (visibility === 'password' && password) {
        resume.password = password; // Should hash in production
      } else {
        resume.password = undefined;
      }

      if (visibility === 'expiring' && expiresAt) {
        resume.expiresAt = new Date(expiresAt);
      } else {
        resume.expiresAt = undefined;
      }

      await resume.save();

      res.json({
        success: true,
        message: 'Visibility updated successfully',
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resume by short ID (public access)
   */
  static async getPublicResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { shortId } = req.params;

      const resume = await Resume.findOne({ 
        shortId,
        deletedAt: null,
      }).populate('profileId');

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Check visibility
      if (resume.visibility === 'private') {
        throw new AppError('This resume is private', 403);
      }

      if (resume.visibility === 'expiring' && resume.expiresAt && resume.expiresAt < new Date()) {
        throw new AppError('This resume link has expired', 410);
      }

      if (resume.visibility === 'password') {
        const { password } = req.query;
        if (!password || password !== resume.password) {
          throw new AppError('Invalid password', 401);
        }
      }

      // Increment view count
      resume.viewCount = (resume.viewCount || 0) + 1;
      await resume.save();

      res.json({
        success: true,
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resume by slug (public access)
   */
  static async getResumeBySlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { slug } = req.params;

      const resume = await Resume.findOne({ 
        slug,
        deletedAt: null,
      }).populate('profileId');

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Check visibility
      if (resume.visibility === 'private') {
        throw new AppError('This resume is private', 403);
      }

      if (resume.visibility === 'expiring' && resume.expiresAt && resume.expiresAt < new Date()) {
        throw new AppError('This resume link has expired', 410);
      }

      if (resume.visibility === 'password') {
        const { password } = req.query;
        if (!password || password !== resume.password) {
          throw new AppError('Invalid password', 401);
        }
      }

      // Increment view count
      resume.viewCount = (resume.viewCount || 0) + 1;
      await resume.save();

      res.json({
        success: true,
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get resume by username and slug (public access)
   */
  static async getResumeByUsernameAndSlug(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, slug } = req.params;

      // First find the user by username
      const User = require('../models/User.model').User;
      const user = await User.findOne({ username });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Find resume by userId and slug
      const resume = await Resume.findOne({ 
        userId: user._id,
        slug,
        deletedAt: null,
      }).populate('profileId');

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Check visibility
      if (resume.visibility === 'private') {
        throw new AppError('This resume is private', 403);
      }

      if (resume.visibility === 'expiring' && resume.expiresAt && resume.expiresAt < new Date()) {
        throw new AppError('This resume link has expired', 410);
      }

      if (resume.visibility === 'password') {
        const { password } = req.query;
        if (!password || password !== resume.password) {
          throw new AppError('Invalid password', 401);
        }
      }

      // Increment view count
      resume.viewCount = (resume.viewCount || 0) + 1;
      await resume.save();

      res.json({
        success: true,
        data: { 
          resume,
          owner: {
            name: user.name,
            username: user.username,
          }
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Sync resume data from profile
   */
  static async syncFromProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // Get profile data - try resume's profileId first, then user's default profile
      let profile = resume.profileId ? await Profile.findById(resume.profileId) : null;
      
      if (!profile) {
        // Fallback to user's default profile
        profile = await Profile.findOne({ 
          userId: req.user.userId,
          deletedAt: null,
        }).sort({ createdAt: 1 });
      }

      if (!profile) {
        throw new AppError('No profile found. Please create a profile first.', 404);
      }

      // Update resume's profileId reference if it was using fallback
      if (!resume.profileId || resume.profileId.toString() !== profile._id.toString()) {
        resume.profileId = profile._id;
      }

      // Update resume data with profile data
      resume.data = {
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
      };
      resume.lastSyncedAt = new Date();
      await resume.save();

      logger.info(`Resume ${resume._id} synced from profile ${profile._id}`);

      res.status(200).json({
        success: true,
        message: 'Resume data synced from profile successfully',
        data: { resume },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate PDF (placeholder for Phase 7)
   */
  static async generatePDF(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      }).populate('profileId');

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // PDF generation will be implemented in Phase 7
      res.status(501).json({
        success: false,
        message: 'PDF generation coming in Phase 7',
        data: { resumeId: resume._id },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Tailor resume for job description (placeholder for Phase 6)
   */
  static async tailorResume(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { id } = req.params;
      const { jobDescription } = req.body;

      const resume = await Resume.findOne({ 
        _id: id,
        userId: req.user.userId,
        deletedAt: null,
      });

      if (!resume) {
        throw new AppError('Resume not found', 404);
      }

      // AI tailoring will be implemented in Phase 6
      res.status(501).json({
        success: false,
        message: 'Resume tailoring with AI coming in Phase 6',
        data: { 
          resumeId: resume._id,
          jobDescription,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
