import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.model';
import { Profile } from '../models/Profile.model';
import { Resume } from '../models/Resume.model';
import { PasswordUtils } from '../utils/password.utils';
import { emailService } from '../services/email.service';
import { AppError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';

export class UserController {
  /**
   * Get current user
   */
  static async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Get profile if exists
      const profile = await Profile.findOne({ userId: user._id });

      // Get resume count
      const resumeCount = await Resume.countDocuments({ userId: user._id });

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            username: user.username,
            phone: user.phone,
            profilePhoto: user.profilePhoto,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            role: user.role,
            subscription: user.subscription,
            aiCredits: user.aiCredits,
            twoFactorEnabled: user.twoFactorEnabled,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
          },
          profile: profile ? {
            id: profile._id,
            completionPercentage: profile.completionPercentage,
          } : null,
          stats: {
            resumeCount,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update user profile
   */
  static async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { name, phone, profilePhoto } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Update fields
      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (profilePhoto) user.profilePhoto = profilePhoto;

      await user.save();

      logger.info(`User profile updated: ${user.email}`);

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            profilePhoto: user.profilePhoto,
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify current password
      const isValid = await PasswordUtils.compare(currentPassword, user.password || '');
      if (!isValid) {
        throw new AppError('Current password is incorrect', 401);
      }

      // Validate new password
      const { valid, errors } = PasswordUtils.validateStrength(newPassword);
      if (!valid) {
        throw new AppError(errors.join(', '), 400);
      }

      // Hash and update password
      user.password = await PasswordUtils.hash(newPassword);
      await user.save();

      // Send confirmation email
      await emailService.sendPasswordChangedEmail(user.email, user.name);

      logger.info(`Password changed: ${user.email}`);

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete account (soft delete)
   */
  static async deleteAccount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Soft delete
      user.deletedAt = new Date();
      await user.save();

      // Also soft delete related data
      await Profile.updateOne({ userId: user._id }, { deletedAt: new Date() });
      await Resume.updateMany({ userId: user._id }, { deletedAt: new Date() });

      // Send deletion confirmation
      await emailService.sendAccountDeletionEmail(user.email, user.name);

      logger.info(`Account deleted: ${user.email}`);

      res.json({
        success: true,
        message: 'Account deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const userId = req.user.userId;

      // Get counts
      const [resumeCount, publicResumeCount, totalViews, totalDownloads] = await Promise.all([
        Resume.countDocuments({ userId, deletedAt: null }),
        Resume.countDocuments({ userId, visibility: 'public', deletedAt: null }),
        Resume.aggregate([
          { $match: { userId, deletedAt: null } },
          { $group: { _id: null, total: { $sum: '$viewCount' } } },
        ]),
        Resume.aggregate([
          { $match: { userId, deletedAt: null } },
          { $group: { _id: null, total: { $sum: '$downloadCount' } } },
        ]),
      ]);

      // Get profile completion
      const profile = await Profile.findOne({ userId });

      res.json({
        success: true,
        data: {
          resumeCount,
          publicResumeCount,
          totalViews: totalViews[0]?.total || 0,
          totalDownloads: totalDownloads[0]?.total || 0,
          profileCompletion: profile?.completionPercentage || 0,
          subscription: {
            plan: req.user.role || 'free',
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update email (requires verification)
   */
  static async updateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      const { newEmail, password } = req.body;

      const user = await User.findById(req.user.userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Verify password
      const isValid = await PasswordUtils.compare(password, user.password || '');
      if (!isValid) {
        throw new AppError('Password is incorrect', 401);
      }

      // Check if new email is already taken
      const existingUser = await User.findOne({ email: newEmail.toLowerCase() });
      if (existingUser) {
        throw new AppError('Email already in use', 409);
      }

      // Update email and mark as unverified
      user.email = newEmail.toLowerCase();
      user.emailVerified = false;
      user.emailVerifiedAt = undefined as any;
      await user.save();

      // Send verification email to new address
      const TokenService = require('../services/token.service').TokenService;
      const verificationToken = TokenService.generateEmailVerificationToken(newEmail);
      await emailService.sendVerificationEmail(newEmail, verificationToken);

      logger.info(`Email updated: ${req.user.email} → ${newEmail}`);

      res.json({
        success: true,
        message: 'Email updated. Please verify your new email address.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Upload profile photo
   */
  static async uploadProfilePhoto(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AppError('Not authenticated', 401);
      }

      // Check if file was uploaded
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const file = req.file;
      const userId = req.user.userId;

      // Validate file type
      const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new AppError('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed', 400);
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new AppError('File size exceeds 5MB limit', 400);
      }

      // Log file info for debugging
      logger.info(`Uploading photo - Type: ${file.mimetype}, Size: ${file.size} bytes, Saved as: ${file.filename}`);

      // Delete old photo file if exists
      const existingUser = await User.findById(userId).select('profilePhoto');
      if (existingUser?.profilePhoto && !existingUser.profilePhoto.startsWith('data:')) {
        const oldPhotoPath = existingUser.profilePhoto.replace('/uploads/', '');
        const fs = require('fs');
        const path = require('path');
        const fullPath = path.join(__dirname, '../../', oldPhotoPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
          logger.info(`Deleted old photo: ${oldPhotoPath}`);
        }
      }

      // Store file path (relative URL)
      const photoUrl = `/uploads/photos/${file.filename}`;

      // Update user's profile photo
      const user = await User.findByIdAndUpdate(
        userId,
        { 
          profilePhoto: photoUrl,
          updatedAt: new Date()
        },
        { new: true }
      ).select('-password');

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Also update profile if exists
      await Profile.findOneAndUpdate(
        { userId },
        { 
          'personalInfo.photo': photoUrl,
          updatedAt: new Date()
        }
      );

      logger.info(`Profile photo uploaded for user: ${userId}`);

      res.status(200).json({
        success: true,
        message: 'Profile photo uploaded successfully',
        data: {
          photoUrl,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profilePhoto: user.profilePhoto
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
