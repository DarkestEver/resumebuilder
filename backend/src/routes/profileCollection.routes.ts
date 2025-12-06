import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { profileCollectionController } from '../controllers/profileCollection.controller';

const router = Router();

/**
 * Profile Collection Routes
 * All routes require authentication
 */

// Get all profiles for current user
router.get('/', authenticate, profileCollectionController.getAllProfiles);

// Get default profile
router.get('/default', authenticate, profileCollectionController.getDefaultProfile);

// Get single profile by ID
router.get('/:id', authenticate, profileCollectionController.getProfileById);

// Create new profile
router.post('/', authenticate, profileCollectionController.createProfile);

// Update profile
router.put('/:id', authenticate, profileCollectionController.updateProfile);

// Delete profile (soft delete)
router.delete('/:id', authenticate, profileCollectionController.deleteProfile);

// Set profile as default
router.post('/:id/set-default', authenticate, profileCollectionController.setDefaultProfile);

// Get all resumes for a profile
router.get('/:id/resumes', authenticate, profileCollectionController.getProfileResumes);

// Duplicate profile
router.post('/:id/duplicate', authenticate, profileCollectionController.duplicateProfile);

export default router;
