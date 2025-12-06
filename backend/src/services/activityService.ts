/**
 * Activity Service - Manages activity tracking and notifications
 */

import { Activity, IActivity } from '../models/Activity.model';
import mongoose from 'mongoose';

export interface ActivityLog {
  userId: string;
  targetUserId?: string;
  type: 'view' | 'like' | 'share' | 'comment' | 'download' | 'message' | 'follow';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface ActivityFeed {
  _id: string;
  type: string;
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

class ActivityService {
  /**
   * Log a new activity
   */
  async logActivity(data: ActivityLog): Promise<IActivity> {
    const activity = new Activity({
      userId: new mongoose.Types.ObjectId(data.userId),
      targetUserId: data.targetUserId ? new mongoose.Types.ObjectId(data.targetUserId) : undefined,
      type: data.type,
      title: data.title,
      description: data.description,
      metadata: data.metadata || {},
    });

    return activity.save();
  }

  /**
   * Get activity feed for a user
   */
  async getUserActivityFeed(
    userId: string,
    limit: number = 20,
    skip: number = 0
  ): Promise<{
    activities: ActivityFeed[];
    total: number;
    unread: number;
  }> {
    const objectId = new mongoose.Types.ObjectId(userId);

    const [activities, total, unread] = await Promise.all([
      Activity.find({ targetUserId: objectId })
        .populate('userId', 'name email avatar')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      Activity.countDocuments({ targetUserId: objectId }),
      Activity.countDocuments({ targetUserId: objectId, read: false }),
    ]);

    const formatted: ActivityFeed[] = activities.map((activity: any) => ({
      _id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      description: activity.description,
      metadata: activity.metadata,
      read: activity.read,
      createdAt: activity.createdAt,
      user: activity.userId
        ? {
            name: activity.userId.name,
            email: activity.userId.email,
            avatar: activity.userId.avatar,
          }
        : undefined,
    }));

    return { activities: formatted, total, unread };
  }

  /**
   * Mark activity as read
   */
  async markAsRead(activityId: string): Promise<void> {
    await Activity.updateOne(
      { _id: new mongoose.Types.ObjectId(activityId) },
      { read: true }
    );
  }

  /**
   * Mark all activities as read for a user
   */
  async markAllAsRead(userId: string): Promise<void> {
    await Activity.updateMany(
      { targetUserId: new mongoose.Types.ObjectId(userId), read: false },
      { read: true }
    );
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    return Activity.countDocuments({
      targetUserId: new mongoose.Types.ObjectId(userId),
      read: false,
    });
  }

  /**
   * Get recent activity for dashboard
   */
  async getRecentActivity(userId: string, limit: number = 5): Promise<ActivityFeed[]> {
    const activities = await Activity.find({ targetUserId: new mongoose.Types.ObjectId(userId) })
      .populate('userId', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return activities.map((activity: any) => ({
      _id: activity._id.toString(),
      type: activity.type,
      title: activity.title,
      description: activity.description,
      metadata: activity.metadata,
      read: activity.read,
      createdAt: activity.createdAt,
      user: activity.userId
        ? {
            name: activity.userId.name,
            email: activity.userId.email,
            avatar: activity.userId.avatar,
          }
        : undefined,
    }));
  }

  /**
   * Delete activity
   */
  async deleteActivity(activityId: string): Promise<void> {
    await Activity.deleteOne({ _id: new mongoose.Types.ObjectId(activityId) });
  }

  /**
   * Clear all activities for a user
   */
  async clearAllActivities(userId: string): Promise<void> {
    await Activity.deleteMany({
      targetUserId: new mongoose.Types.ObjectId(userId),
    });
  }
}

export default new ActivityService();
