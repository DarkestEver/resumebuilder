/**
 * Admin Routes - Administrative endpoints
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import adminService from '../services/adminService';

const router = Router();

/**
 * GET /api/admin/stats
 * Get dashboard statistics
 */
router.get('/stats', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await adminService.getDashboardStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
});

/**
 * GET /api/admin/analytics
 * Get platform analytics
 */
router.get('/analytics', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const analytics = await adminService.getPlatformAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
    });
  }
});

/**
 * GET /api/admin/users
 * Get user list
 */
router.get('/users', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(_req.query.limit) || 20, 100);
    const users = await adminService.getUserAnalytics(limit);

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
});

/**
 * GET /api/admin/logs
 * Get admin activity logs
 */
router.get('/logs', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(_req.query.limit) || 50, 500);
    const skip = Number(_req.query.skip) || 0;

    const result = await adminService.getAdminLogs(limit, skip);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch logs',
    });
  }
});

/**
 * GET /api/admin/users/:userId
 * Get user details
 */
router.get('/users/:userId', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const userDetail = await adminService.getUserDetail(userId);

    res.json({
      success: true,
      data: userDetail,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user details',
    });
  }
});

/**
 * POST /api/admin/users/:userId/ban
 * Ban a user
 */
router.post('/users/:userId/ban', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    await adminService.banUser(userId, reason);
    await adminService.logAdminAction({
      adminId: req.user!.userId,
      action: 'ban',
      resourceType: 'user',
      resourceId: userId,
      changes: { reason },
    });

    res.json({
      success: true,
      message: 'User banned successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to ban user',
    });
  }
});

/**
 * POST /api/admin/users/:userId/unban
 * Unban a user
 */
router.post('/users/:userId/unban', authenticate, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    await adminService.unbanUser(userId);
    await adminService.logAdminAction({
      adminId: req.user!.userId,
      action: 'unban',
      resourceType: 'user',
      resourceId: userId,
    });

    res.json({
      success: true,
      message: 'User unbanned successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to unban user',
    });
  }
});

/**
 * GET /api/admin/banned-users
 * Get list of banned users
 */
router.get('/banned-users', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const limit = Math.min(Number(_req.query.limit) || 20, 100);
    const bannedUsers = await adminService.getBannedUsers(limit);

    res.json({
      success: true,
      data: { bannedUsers },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch banned users',
    });
  }
});

/**
 * GET /api/admin/search-users
 * Search for users
 */
router.get('/search-users', authenticate, requireAdmin, async (_req: Request, res: Response): Promise<void> => {
  try {
    const { q } = _req.query;
    if (!q) {
      res.status(400).json({
        success: false,
        error: 'Search query required',
      });
      return;
    }

    const users = await adminService.searchUsers(String(q));

    res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to search users',
    });
  }
});

export default router;
