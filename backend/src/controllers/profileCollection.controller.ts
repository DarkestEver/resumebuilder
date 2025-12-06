import { Request, Response } from 'express';
import { ProfileCollection } from '../models/ProfileCollection.model';
import { Resume } from '../models/Resume.model';
import mongoose from 'mongoose';

/**
 * Profile Collection Controller
 * Manages multiple profiles per user
 */

export const profileCollectionController = {
  /**
   * Get all profiles for current user
   * GET /api/profiles
   */
  getAllProfiles: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profiles = await ProfileCollection.find({
        userId,
        deletedAt: null,
      }).sort({ isDefault: -1, createdAt: -1 });

      res.json({
        success: true,
        data: profiles,
      });
    } catch (error) {
      console.error('Get all profiles error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profiles',
      });
    }
  },

  /**
   * Get single profile by ID
   * GET /api/profiles/:id
   */
  getProfileById: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile',
      });
    }
  },

  /**
   * Get default profile
   * GET /api/profiles/default
   */
  getDefaultProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      let profile = await ProfileCollection.findOne({
        userId,
        isDefault: true,
        deletedAt: null,
      });

      // If no default, get first profile
      if (!profile) {
        profile = await ProfileCollection.findOne({
          userId,
          deletedAt: null,
        }).sort({ createdAt: 1 });
      }

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'No profiles found',
        });
        return;
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error('Get default profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch default profile',
      });
    }
  },

  /**
   * Create new profile
   * POST /api/profiles
   */
  createProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const { profileName, isDefault, ...profileData } = req.body;

      // Check if this is the first profile
      const existingProfileCount = await ProfileCollection.countDocuments({
        userId,
        deletedAt: null,
      });

      const profile = new ProfileCollection({
        userId,
        profileName: profileName || 'Untitled Profile',
        isDefault: existingProfileCount === 0 ? true : isDefault || false,
        ...profileData,
      });

      await profile.save();

      res.status(201).json({
        success: true,
        message: 'Profile created successfully',
        data: profile,
      });
    } catch (error) {
      console.error('Create profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create profile',
      });
    }
  },

  /**
   * Update profile
   * PUT /api/profiles/:id
   */
  updateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      // Update fields
      Object.assign(profile, req.body);
      await profile.save();

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update profile',
      });
    }
  },

  /**
   * Delete profile (soft delete)
   * DELETE /api/profiles/:id
   */
  deleteProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      // Check if there are resumes using this profile
      const resumeCount = await Resume.countDocuments({
        profileId: id,
        deletedAt: null,
      });

      if (resumeCount > 0) {
        res.status(400).json({
          success: false,
          message: `Cannot delete profile. ${resumeCount} resume(s) are using this profile. Please delete or reassign those resumes first.`,
        });
        return;
      }

      // Soft delete
      profile.deletedAt = new Date();
      await profile.save();

      // If this was the default profile, set another as default
      if (profile.isDefault) {
        const nextProfile = await ProfileCollection.findOne({
          userId,
          deletedAt: null,
          _id: { $ne: id },
        }).sort({ createdAt: 1 });

        if (nextProfile) {
          nextProfile.isDefault = true;
          await nextProfile.save();
        }
      }

      res.json({
        success: true,
        message: 'Profile deleted successfully',
      });
    } catch (error) {
      console.error('Delete profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete profile',
      });
    }
  },

  /**
   * Set profile as default
   * POST /api/profiles/:id/set-default
   */
  setDefaultProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      // Set as default (pre-save hook will unset others)
      profile.isDefault = true;
      await profile.save();

      res.json({
        success: true,
        message: 'Default profile updated',
        data: profile,
      });
    } catch (error) {
      console.error('Set default profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to set default profile',
      });
    }
  },

  /**
   * Get all resumes for a profile
   * GET /api/profiles/:id/resumes
   */
  getProfileResumes: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const profile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!profile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      const resumes = await Resume.find({
        profileId: id,
        deletedAt: null,
      }).sort({ updatedAt: -1 });

      res.json({
        success: true,
        data: {
          profile,
          resumes,
        },
      });
    } catch (error) {
      console.error('Get profile resumes error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch profile resumes',
      });
    }
  },

  /**
   * Duplicate profile
   * POST /api/profiles/:id/duplicate
   */
  duplicateProfile: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.userId;
      const { id } = req.params;
      const { profileName } = req.body;

      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const originalProfile = await ProfileCollection.findOne({
        _id: id,
        userId,
        deletedAt: null,
      });

      if (!originalProfile) {
        res.status(404).json({
          success: false,
          message: 'Profile not found',
        });
        return;
      }

      // Create duplicate
      const duplicateData = originalProfile.toObject();
      delete duplicateData._id;
      delete duplicateData.createdAt;
      delete duplicateData.updatedAt;

      const newProfile = new ProfileCollection({
        ...duplicateData,
        profileName: profileName || `${originalProfile.profileName} (Copy)`,
        isDefault: false,
      });

      await newProfile.save();

      res.status(201).json({
        success: true,
        message: 'Profile duplicated successfully',
        data: newProfile,
      });
    } catch (error) {
      console.error('Duplicate profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to duplicate profile',
      });
    }
  },
};
