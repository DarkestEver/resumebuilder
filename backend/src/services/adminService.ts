/**
 * Admin Service - Manages admin operations
 */

import { AdminLog, IAdminLog } from '../models/AdminLog.model';
import { User } from '../models/User.model';
import { Profile } from '../models/Profile.model';
import { Resume } from '../models/Resume.model';
import mongoose from 'mongoose';

interface DashboardStats {
  totalUsers: number;
  totalResumes: number;
  totalProfiles: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  newUsersThisMonth: number;
}

interface AdminLogData {
  adminId: string;
  action: 'create' | 'update' | 'delete' | 'view' | 'export' | 'ban' | 'unban' | 'approve' | 'reject';
  resourceType: 'user' | 'profile' | 'resume' | 'content' | 'payment' | 'subscription';
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
}

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<DashboardStats> {
    const [totalUsers, totalResumes, totalProfiles, newUsersThisMonth] = await Promise.all([
      User.countDocuments(),
      Resume.countDocuments(),
      Profile.countDocuments(),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
      }),
    ]);

    return {
      totalUsers,
      totalResumes,
      totalProfiles,
      activeSubscriptions: Math.floor(totalUsers * 0.3), // Estimate 30%
      monthlyRevenue: Math.floor(Math.random() * 50000 + 10000), // Placeholder
      newUsersThisMonth,
    };
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(limit: number = 10) {
    const users = await User.find()
      .select('email name createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const userStats = await Promise.all(
      users.map(async (user) => {
        const resumes = await Resume.countDocuments({ userId: user._id });
        return {
          ...user,
          resumes,
        };
      })
    );

    return userStats;
  }

  /**
   * Get platform analytics
   */
  async getPlatformAnalytics() {
    const usersPerDay = await User.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    });

    const resumesPerDay = await Resume.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    });

    return {
      usersPerDay: Math.ceil(usersPerDay / 30),
      resumesPerDay: Math.ceil(resumesPerDay / 30),
      avgResumesPerUser: Math.ceil(resumesPerDay / usersPerDay) || 0,
    };
  }

  /**
   * Get admin logs
   */
  async getAdminLogs(limit: number = 50, skip: number = 0): Promise<{
    logs: IAdminLog[];
    total: number;
  }> {
    const [logs, total] = await Promise.all([
      AdminLog.find()
        .populate('adminId', 'email name')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .lean(),
      AdminLog.countDocuments(),
    ]);

    return { logs: logs as any, total };
  }

  /**
   * Log admin action
   */
  async logAdminAction(data: AdminLogData): Promise<IAdminLog> {
    const log = new AdminLog({
      adminId: new mongoose.Types.ObjectId(data.adminId),
      action: data.action,
      resourceType: data.resourceType,
      resourceId: data.resourceId,
      changes: data.changes,
      ipAddress: data.ipAddress,
    });

    return log.save();
  }

  /**
   * Ban user
   */
  async banUser(userId: string, reason?: string): Promise<void> {
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          isBanned: true,
          banReason: reason,
          bannedAt: new Date(),
        },
      }
    );
  }

  /**
   * Unban user
   */
  async unbanUser(userId: string): Promise<void> {
    await User.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      {
        $set: {
          isBanned: false,
          banReason: null,
          bannedAt: null,
        },
      }
    );
  }

  /**
   * Get banned users
   */
  async getBannedUsers(limit: number = 20): Promise<any[]> {
    return User.find({ isBanned: true })
      .select('email name bannedAt banReason')
      .sort({ bannedAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Search users
   */
  async searchUsers(query: string, limit: number = 10): Promise<any[]> {
    return User.find({
      $or: [{ email: { $regex: query, $options: 'i' } }, { name: { $regex: query, $options: 'i' } }],
    })
      .select('email name createdAt')
      .limit(limit)
      .lean();
  }

  /**
   * Get user detail
   */
  async getUserDetail(userId: string) {
    const user = await User.findById(userId).select('-password').lean();
    const profile = await Profile.findOne({ userId });
    const resumes = await Resume.find({ userId }).lean();

    return {
      user,
      profile,
      resumes,
    };
  }

  /**
   * Export user data
   */
  async exportUserData(userId: string) {
    const userData = await this.getUserDetail(userId);
    return {
      exportedAt: new Date(),
      data: userData,
    };
  }
}

export default new AdminService();
