import { Router } from 'express';
import { ResumeController } from '../controllers/resume.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';
import { sanitize, validate, schemas } from '../middleware/validation.middleware';

const router = Router();

// Public routes (no auth required)
router.get('/public/:shortId', optionalAuth, ResumeController.getPublicResume);
router.get('/public/:username/:slug', optionalAuth, ResumeController.getResumeByUsernameAndSlug);
router.get('/slug/:slug', optionalAuth, ResumeController.getResumeBySlug);

// Protected routes
router.use(authenticate);
router.use(sanitize);

// Resume CRUD
router.get('/', ResumeController.getAllResumes);
router.get('/:id', ResumeController.getResume);

router.post(
  '/',
  validate(schemas.createResume),
  ResumeController.createResume
);

router.put(
  '/:id',
  validate(schemas.updateResume),
  ResumeController.updateResume
);

router.delete('/:id', ResumeController.deleteResume);

// Additional operations
router.post('/:id/duplicate', ResumeController.duplicateResume);
router.put('/:id/visibility', ResumeController.updateVisibility);

// PDF generation (Phase 7)
router.get('/:id/pdf', ResumeController.generatePDF);

// AI tailoring (Phase 6)
router.post(
  '/:id/tailor',
  validate(schemas.tailorResume),
  ResumeController.tailorResume
);

export default router;
