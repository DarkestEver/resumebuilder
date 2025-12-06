/**
 * Video Upload Routes - API endpoints for video management
 */

import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate } from '../middleware/auth.middleware';
import videoUploadService from '../services/videoUploadService';
import { Profile } from '../models/Profile.model';

const router = Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/webm'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

/**
 * POST /api/videos/upload
 * Upload a video for user's profile
 */
router.post('/upload', authenticate, upload.single('video'), async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: 'No video file provided',
      });
      return;
    }

    // Get user's profile
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      res.status(404).json({
        success: false,
        error: 'Profile not found',
      });
      return;
    }

    // Validate video
    const validation = videoUploadService.validateVideoFile(file.originalname, file.size);
    if (!validation.valid) {
      res.status(400).json({
        success: false,
        error: validation.error,
      });
      return;
    }

    // Save video metadata
    const videoProfile = await videoUploadService.uploadVideo({
      profileId: profile._id.toString(),
      filePath: file.path,
      fileName: file.filename,
      fileSize: file.size,
    });

    res.json({
      success: true,
      data: {
        videoId: videoProfile._id,
        videoUrl: videoProfile.videoUrl,
        duration: videoProfile.duration,
        uploadedAt: videoProfile.uploadedAt,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Video upload failed',
    });
  }
});

/**
 * GET /api/videos/:profileId
 * Get video profile for a user
 */
router.get('/:profileId', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { profileId } = _req.params;

    const videoProfile = await videoUploadService.getVideoProfile(profileId);
    if (!videoProfile) {
      res.status(404).json({
        success: false,
        error: 'Video not found',
      });
      return;
    }

    res.json({
      success: true,
      data: videoProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch video',
    });
  }
});

/**
 * PUT /api/videos/:videoId
 * Update video metadata
 */
router.put('/:videoId', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const updates = req.body;

    const updatedVideo = await videoUploadService.updateVideo(videoId, updates);

    if (!updatedVideo) {
      res.status(404).json({
        success: false,
        error: 'Video not found',
      });
      return;
    }

    res.json({
      success: true,
      data: updatedVideo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update video',
    });
  }
});

/**
 * DELETE /api/videos/:videoId
 * Delete video
 */
router.delete('/:videoId', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = req.params;
    const filePath = req.body.filePath;

    if (!filePath) {
      res.status(400).json({
        success: false,
        error: 'File path required',
      });
      return;
    }

    await videoUploadService.deleteVideo(videoId, filePath);

    res.json({
      success: true,
      message: 'Video deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete video',
    });
  }
});

/**
 * POST /api/videos/:videoId/view
 * Increment view count
 */
router.post('/:videoId/view', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = _req.params;

    await videoUploadService.incrementViews(videoId);

    res.json({
      success: true,
      message: 'View recorded',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to record view',
    });
  }
});

/**
 * POST /api/videos/:videoId/like
 * Toggle like
 */
router.post('/:videoId/like', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { videoId } = _req.params;
    const { unlike } = _req.body;

    await videoUploadService.toggleLike(videoId, !unlike);

    res.json({
      success: true,
      message: unlike ? 'Like removed' : 'Video liked',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to toggle like',
    });
  }
});

/**
 * GET /api/videos/trending/popular
 * Get popular videos
 */
router.get('/trending/popular', async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(_req.query.limit) || 10, 50);

    const videos = await videoUploadService.getPopularVideos(limit);

    res.json({
      success: true,
      data: { videos },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular videos',
    });
  }
});

/**
 * GET /api/videos/trending/recent
 * Get recent videos
 */
router.get('/trending/recent', async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(_req.query.limit) || 10, 50);

    const videos = await videoUploadService.getRecentVideos(limit);

    res.json({
      success: true,
      data: { videos },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent videos',
    });
  }
});

export default router;
