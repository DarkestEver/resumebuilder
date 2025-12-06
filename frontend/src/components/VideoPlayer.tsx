/**
 * Video Player Component - Displays profile video
 */

'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api/auth';

interface VideoPlayerProps {
  profileId: string;
  isOwner?: boolean;
}

interface VideoData {
  _id: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  uploadedAt: string;
}

export default function VideoPlayer({ profileId, isOwner = false }: VideoPlayerProps) {
  const [video, setVideo] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    loadVideo();
  }, [profileId]);

  const loadVideo = async () => {
    try {
      const response = await apiClient.get(`/videos/${profileId}`);
      setVideo(response.data.data);

      // Record view
      if (response.data.data._id) {
        await apiClient.post(`/videos/${response.data.data._id}/view`);
      }
    } catch (error) {
      console.error('Failed to load video:', error);
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="w-full aspect-video bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500">Loading video...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full aspect-video bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-300">
        <p className="text-gray-500">No video uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Video Player */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          src={video.videoUrl}
          controls
          className="w-full h-full"
          controlsList="nodownload"
        />
      </div>

      {/* Video Info */}
      <div className="mt-4 space-y-4">
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
