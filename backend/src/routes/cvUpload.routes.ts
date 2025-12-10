import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { cvUploadController } from '../controllers/cvUploadController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directory exists
const uploadDir = 'uploads/cv';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (_req: any, file: any, cb: any) => {
  // Only allow PDF files
  const allowedMimes = ['application/pdf'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are supported'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

/**
 * POST /api/cv/upload
 * Upload and parse CV/Resume
 */
router.post(
  '/upload',
  authenticate,
  (req: Request, res: Response, next: any) => {
    upload.single('file')(req, res, (err: any): void => {
      if (err) {
        console.error('Multer error:', err);
        if (err.message === 'Unexpected end of form') {
          res.status(400).json({
            success: false,
            message: 'File upload was interrupted. Please try again.',
            error: 'Upload incomplete - ensure the file is attached and the request completes',
          });
          return;
        }
        res.status(400).json({
          success: false,
          message: err.message || 'File upload failed',
          error: err.code || 'UPLOAD_ERROR',
        });
        return;
      }
      next();
    });
  },
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      if (!req.user?.userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const { uploadTarget, uploadMode, resumeId, newResumeTitle } = req.body;

      const result = await cvUploadController.uploadAndParseCv(
        req.user.userId,
        req.file.path,
        req.file.mimetype,
        {
          uploadTarget: uploadTarget as 'profile' | 'resume',
          uploadMode: uploadMode as 'update' | 'create',
          resumeId,
          newResumeTitle,
        }
      );

      res.json({
        success: true,
        message: 'CV uploaded and parsed successfully',
        data: result,
      });
    } catch (error) {
      console.error('CV upload error:', error);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to upload CV',
      });
    }
  }
);

export default router;
