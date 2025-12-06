/**
 * Video Profile Model - Stores video upload metadata
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IVideoProfile extends Document {
  profileId: mongoose.Types.ObjectId;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number; // in seconds
  fileSize: number; // in bytes
  uploadedAt: Date;
  isPublic: boolean;
  views: number;
  likes: number;
  comments: string[];
}

const VideoProfileSchema = new Schema(
  {
    profileId: {
      type: Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      unique: true,
      index: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: String,
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 600, // 10 minutes max
    },
    fileSize: {
      type: Number,
      required: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'video-profiles',
  }
);

export const VideoProfile = mongoose.model<IVideoProfile>('VideoProfile', VideoProfileSchema);
