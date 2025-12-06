/**
 * Admin Log Model - Tracks admin actions for audit
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId?: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AdminLogSchema = new Schema(
  {
    adminId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: ['create', 'update', 'delete', 'view', 'export', 'ban', 'unban', 'approve', 'reject'],
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      enum: ['user', 'profile', 'resume', 'content', 'payment', 'subscription'],
      index: true,
    },
    resourceId: String,
    changes: {
      type: Schema.Types.Mixed,
    },
    ipAddress: String,
  },
  {
    timestamps: true,
    collection: 'admin-logs',
  }
);

AdminLogSchema.index({ adminId: 1, createdAt: -1 });
AdminLogSchema.index({ action: 1, resourceType: 1 });

export const AdminLog = mongoose.model<IAdminLog>('AdminLog', AdminLogSchema);
