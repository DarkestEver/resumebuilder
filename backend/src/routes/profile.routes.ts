import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';
import { sanitize } from '../middleware/validation.middleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(sanitize);

// Profile CRUD
router.get('/', ProfileController.getProfile);
router.post('/', ProfileController.createProfile);
router.put('/', ProfileController.updateProfile);
router.delete('/', ProfileController.deleteProfile);

// Section-specific updates
router.put('/section/:section', ProfileController.updateSection);

// Completion status
router.get('/completion', ProfileController.getCompletionStatus);

export default router;
