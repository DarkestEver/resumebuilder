/**
 * Video Player Component - Displays profile video
 */

'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api/auth';

interface VideoPlayerProps {
  profileId: string;
  isOwner?: boolean;
  onPrivacyChange?: (isPublic: boolean) => void;
}

interface VideoData {
  _id: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  uploadedAt: string;
  isPublic: boolean;
}

export default function VideoPlayer({ profileId, isOwner = false, onPrivacyChange }: VideoPlayerProps) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (profileId) {
      loadVideo();
    } else {
      setLoading(false);
      setError('No profile ID provided');
    }
  }, [profileId]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get(`/videos/${profileId}`);
      
      if (response.data.success && response.data.data) {
        setVideo(response.data.data);

        // Record view
        if (response.data.data._id) {
          await apiClient.post(`/videos/${response.data.data._id}/view`).catch(() => {
            // Silently fail view tracking
          });
        }
      } else {
        setVideo(null);
      }
    } catch (error: any) {
      console.error('Failed to load video:', error);
      // Don't show error for 404 (no video uploaded yet)
      if (error?.response?.status !== 404) {
        setError('Failed to load video');
      }
      setVideo(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyToggle = async () => {
    if (!video || !isOwner) return;

    try {
      const newIsPublic = !video.isPublic;
      await apiClient.put(`/videos/${video._id}`, { isPublic: newIsPublic });
      
      setVideo({ ...video, isPublic: newIsPublic });
      onPrivacyChange?.(newIsPublic);
    } catch (error) {
      console.error('Failed to update privacy:', error);
    }
  };

  const handleLike = async () => {
    if (!video) return;

    try {
      await apiClient.post(`/videos/${video._id}/like`, { unlike: liked });
      setLiked(!liked);

      // Refresh video data
      const response = await apiClient.get(`/videos/${profileId}`);
      setVideo(response.data.data);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleDelete = async () => {
    if (!video || !isOwner) return;

    if (!window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      await apiClient.delete(`/videos/${video._id}`, {
        data: { filePath: video.videoUrl }
      });
      
      // Reload to show empty state
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete video:', error);
      setError('Failed to delete video');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading video...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
        <div className="text-center p-6">
          <p className="text-red-600 font-medium mb-2">⚠️ Error</p>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full aspect-video bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
        <div className="text-center p-6">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium">No video uploaded yet</p>
          {isOwner && (
            <p className="text-gray-400 text-sm mt-2">Upload a video to get started</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={`http://localhost:5000${video.videoUrl.startsWith('/uploads') ? video.videoUrl : '/uploads/videos/' + video.videoUrl.split('/').pop()}`}
          controls
          className="w-full h-full"
          controlsList="nodownload"
          crossOrigin="anonymous"
        />
      </div>

      {/* Video Info */}
      <div className="mt-4 space-y-4">
        {/* Privacy Toggle (Owner Only) */}
        {isOwner && (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <p className="font-semibold text-gray-900">Video Visibility</p>
                <p className="text-sm text-gray-600">
                  {video.isPublic ? 'Public - Visible on your profile' : 'Private - Only you can see this'}
                </p>
              </div>
              <button
                onClick={handlePrivacyToggle}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  video.isPublic ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    video.isPublic ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Delete Button */}
            <button
              onClick={handleDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-200 hover:border-red-300 transition-colors font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Video
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-600">Duration</p>
            <p className="font-semibold text-gray-900">{Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}</p>
          </div>
          <div>
            <p className="text-gray-600">Views</p>
            <p className="font-semibold text-gray-900">{video.views.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Likes</p>
            <p className="font-semibold text-gray-900">{video.likes.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-600">Uploaded</p>
            <p className="font-semibold text-gray-900">{new Date(video.uploadedAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        {!isOwner && (
          <div className="flex gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded border transition-colors ${
                liked
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-red-200 hover:text-red-600'
              }`}
            >
              ❤️ {liked ? 'Liked' : 'Like'}
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded border border-gray-200 text-gray-700 hover:bg-gray-50">
              📤 Share
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
