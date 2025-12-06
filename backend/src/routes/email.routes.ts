/**
 * Email Preferences Routes
 */

import { Router, Request, Response } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { EmailPreferences } from '../models/EmailPreferences.model';

const router = Router();

/**
 * GET /api/email/preferences
 * Get user's email preferences
 */
router.get('/preferences', authenticate, async (req: Request, res: Response) => {
  try {
    let preferences = await EmailPreferences.findOne({ userId: req.user?.userId });

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = new EmailPreferences({ userId: req.user?.userId });
      await preferences.save();
    }

    res.json({
      success: true,
      data: { preferences },
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get email preferences',
    });
  }
});

/**
 * PUT /api/email/preferences
 * Update user's email preferences
 */
router.put('/preferences', authenticate, async (req: Request, res: Response) => {
  try {
    const { emailNotifications, marketingEmails, paymentReceipts, weeklyDigest, shares, comments } = req.body;

    let preferences = await EmailPreferences.findOne({ userId: req.user?.userId });

    if (!preferences) {
      preferences = new EmailPreferences({ userId: req.user?.userId });
    }

    // Update preferences
    if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
    if (marketingEmails !== undefined) preferences.marketingEmails = marketingEmails;
    if (paymentReceipts !== undefined) preferences.paymentReceipts = paymentReceipts;
    if (weeklyDigest !== undefined) preferences.weeklyDigest = weeklyDigest;
    if (shares !== undefined) preferences.shares = shares;
    if (comments !== undefined) preferences.comments = comments;

    await preferences.save();

    res.json({
      success: true,
      message: 'Email preferences updated successfully',
      data: { preferences },
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update email preferences',
    });
  }
});

/**
 * POST /api/email/unsubscribe
 * Unsubscribe from all emails
 */
router.post('/unsubscribe', authenticate, async (req: Request, res: Response) => {
  try {
    let preferences = await EmailPreferences.findOne({ userId: req.user?.userId });

    if (!preferences) {
      preferences = new EmailPreferences({ userId: req.user?.userId });
    }

    // Unsubscribe from all except payment receipts
    preferences.emailNotifications = false;
    preferences.marketingEmails = false;
    preferences.weeklyDigest = false;
    preferences.shares = false;
    preferences.comments = false;
    // Keep payment receipts enabled for important notifications

    await preferences.save();

    res.json({
      success: true,
      message: 'Unsubscribed from emails successfully',
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe',
    });
  }
});

export default router;
