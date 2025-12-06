/**
 * Activity Routes - REST API for activities and notifications
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import activityService from '../services/activityService';

const router = Router();

/**
 * GET /api/activities/feed
 * Get activity feed for authenticated user
 */
router.get('/feed', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const userId = _req.user!.userId;
    const limit = Math.min(Number(_req.query.limit) || 20, 100);
    const skip = Number(_req.query.skip) || 0;

    const result = await activityService.getUserActivityFeed(userId, limit, skip);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch activity feed',
    });
  }
});

/**
 * GET /api/activities/unread
 * Get unread count for authenticated user
 */
router.get('/unread', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const userId = _req.user!.userId;
    const unread = await activityService.getUnreadCount(userId);

    res.json({
      success: true,
      data: { unread },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unread count',
    });
  }
});

/**
 * GET /api/activities/recent
 * Get recent activities for dashboard
 */
router.get('/recent', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const userId = _req.user!.userId;
    const limit = Math.min(Number(_req.query.limit) || 5, 50);

    const activities = await activityService.getRecentActivity(userId, limit);

    res.json({
      success: true,
      data: { activities },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent activities',
    });
  }
});

/**
 * PUT /api/activities/:id/read
 * Mark activity as read
 */
router.put('/:id/read', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await activityService.markAsRead(id);

    res.json({
      success: true,
      message: 'Activity marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update activity',
    });
  }
});

/**
 * PUT /api/activities/read-all
 * Mark all activities as read for user
 */
router.put('/read-all', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const userId = _req.user!.userId;

    await activityService.markAllAsRead(userId);

    res.json({
      success: true,
      message: 'All activities marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update activities',
    });
  }
});

/**
 * DELETE /api/activities/:id
 * Delete a specific activity
 */
router.delete('/:id', authenticate, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await activityService.deleteActivity(id);

    res.json({
      success: true,
      message: 'Activity deleted',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete activity',
    });
  }
});

/**
 * DELETE /api/activities
 * Clear all activities for user
 */
router.delete('/', authenticate, async (_req: Request, res: Response): Promise<void> => {
  try {
    const userId = _req.user!.userId;

    await activityService.clearAllActivities(userId);

    res.json({
      success: true,
      message: 'All activities cleared',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to clear activities',
    });
  }
});

export default router;
