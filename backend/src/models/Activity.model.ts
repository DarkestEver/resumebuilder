/**
 * Activity Model - Tracks user actions and profile engagement
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  targetUserId?: mongoose.Types.ObjectId;
  type: 'view' | 'like' | 'share' | 'comment' | 'download' | 'message' | 'follow';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    targetUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    type: {
      type: String,
      enum: ['view', 'like', 'share', 'comment', 'download', 'message', 'follow'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'activities',
  }
);

// Index for efficient queries
ActivitySchema.index({ userId: 1, createdAt: -1 });
ActivitySchema.index({ targetUserId: 1, createdAt: -1 });
ActivitySchema.index({ userId: 1, read: 1 });

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema);
