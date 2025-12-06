/**
 * Video Upload Service - Handles video processing and storage
 */

import fs from 'fs';
import path from 'path';
import { VideoProfile, IVideoProfile } from '../models/VideoProfile.model';
import mongoose from 'mongoose';

interface VideoMetadata {
  profileId: string;
  filePath: string;
  fileName: string;
  fileSize: number;
}

class VideoUploadService {
  /**
   * Save video and create metadata record
   */
  async uploadVideo(metadata: VideoMetadata): Promise<IVideoProfile> {
    try {
      const fileSize = fs.statSync(metadata.filePath).size;
      const duration = await this.estimateVideoDuration(metadata.filePath);

      const videoUrl = `/videos/${metadata.profileId}/${metadata.fileName}`;

      const videoProfile = new VideoProfile({
        profileId: new mongoose.Types.ObjectId(metadata.profileId),
        videoUrl,
        duration,
        fileSize,
        isPublic: true,
      });

      return await videoProfile.save();
    } catch (error) {
      // Clean up file on error
      if (fs.existsSync(metadata.filePath)) {
        fs.unlinkSync(metadata.filePath);
      }
      throw error;
    }
  }

  /**
   * Estimate video duration (basic implementation)
   * In production, use ffprobe or similar
   */
  private async estimateVideoDuration(_filePath: string): Promise<number> {
    // Placeholder: analyze file headers or use ffprobe
    // For now, return a default value
    return 30;
  }

  /**
   * Get video profile by ID
   */
  async getVideoProfile(profileId: string): Promise<IVideoProfile | null> {
    return VideoProfile.findOne({
      profileId: new mongoose.Types.ObjectId(profileId),
    });
  }

  /**
   * Get video profile by video ID
   */
  async getVideoById(videoId: string): Promise<IVideoProfile | null> {
    return VideoProfile.findById(videoId);
  }

  /**
   * Update video metadata
   */
  async updateVideo(videoId: string, updates: Partial<IVideoProfile>): Promise<IVideoProfile | null> {
    return VideoProfile.findByIdAndUpdate(
      videoId,
      { $set: updates },
      { new: true }
    );
  }

  /**
   * Delete video
   */
  async deleteVideo(videoId: string, filePath: string): Promise<void> {
    await VideoProfile.deleteOne({ _id: new mongoose.Types.ObjectId(videoId) });

    // Delete file from storage
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Increment view count
   */
  async incrementViews(videoId: string): Promise<void> {
    await VideoProfile.updateOne(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { $inc: { views: 1 } }
    );
  }

  /**
   * Toggle like
   */
  async toggleLike(videoId: string, increment: boolean = true): Promise<void> {
    await VideoProfile.updateOne(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { $inc: { likes: increment ? 1 : -1 } }
    );
  }

  /**
   * Add comment
   */
  async addComment(videoId: string, comment: string): Promise<void> {
    await VideoProfile.updateOne(
      { _id: new mongoose.Types.ObjectId(videoId) },
      { $push: { comments: comment } }
    );
  }

  /**
   * Get popular videos
   */
  async getPopularVideos(limit: number = 10): Promise<IVideoProfile[]> {
    return VideoProfile.find({ isPublic: true })
      .sort({ views: -1 })
      .limit(limit)
      .populate('profileId', 'personalInfo');
  }

  /**
   * Get recent videos
   */
  async getRecentVideos(limit: number = 10): Promise<IVideoProfile[]> {
    return VideoProfile.find({ isPublic: true })
      .sort({ uploadedAt: -1 })
      .limit(limit)
      .populate('profileId', 'personalInfo');
  }

  /**
   * Validate video file
   */
  validateVideoFile(fileName: string, fileSize: number): { valid: boolean; error?: string } {
    const maxFileSize = 100 * 1024 * 1024; // 100MB
    const allowedExtensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm'];

    const ext = path.extname(fileName).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return {
        valid: false,
        error: `Video format not supported. Allowed: ${allowedExtensions.join(', ')}`,
      };
    }

    if (fileSize > maxFileSize) {
      return {
        valid: false,
        error: `File size exceeds 100MB limit`,
      };
    }

    return { valid: true };
  }
}

export default new VideoUploadService();
