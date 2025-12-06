import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate, schemas, sanitize } from '../middleware/validation.middleware';
import { uploadSinglePhoto } from '../middleware/upload.middleware';

const router = Router();

// Apply authentication to all routes
router.use(authenticate);
router.use(sanitize);

// User profile routes
router.get('/me', UserController.getCurrentUser);

router.put(
  '/me',
  validate(schemas.updateProfile),
  UserController.updateUser
);

router.put(
  '/password',
  validate(schemas.changePassword),
  UserController.changePassword
);

router.put(
  '/email',
  validate(schemas.updateEmail),
  UserController.updateEmail
);

router.delete('/me', UserController.deleteAccount);

// Statistics
router.get('/stats', UserController.getUserStats);

// Profile photo upload
router.post('/photo', uploadSinglePhoto, UserController.uploadProfilePhoto);

export default router;
