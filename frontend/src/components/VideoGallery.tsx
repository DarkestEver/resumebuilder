/**
 * Video Gallery Component - Browse videos from other users
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import apiClient from '@/lib/api/auth';

interface VideoCard {
  _id: string;
  videoUrl: string;
  duration: number;
  views: number;
  likes: number;
  uploadedAt: string;
  profileId?: {
    personalInfo?: {
      name: string;
      title: string;
    };
  };
}

type FilterType = 'popular' | 'recent';

export default function VideoGallery() {
  const [videos, setVideos] = useState<VideoCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('popular');

  useEffect(() => {
    loadVideos();
  }, [filter]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'popular' ? '/videos/trending/popular' : '/videos/trending/recent';
      const response = await apiClient.get(endpoint, {
        params: { limit: 12 },
      });

      setVideos(response.data.data.videos || []);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Profiles</h1>
        <p className="text-gray-600 mb-8">Watch professional video introductions from talented professionals</p>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setFilter('popular')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              filter === 'popular'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            🔥 Most Popular
          </button>
          <button
            onClick={() => setFilter('recent')}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
              filter === 'recent'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            📅 Most Recent
          </button>
        </div>

        {/* Videos Grid */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-gray-200 rounded-lg aspect-video"></div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No videos available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Link key={video._id} href={`/video/${video._id}`} className="group">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video mb-4">
                  {/* Placeholder Thumbnail */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <svg className="w-12 h-12 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM4 9h12M4 13h12" stroke="currentColor" fill="none" />
                    </svg>
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <svg className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold">
                    {Math.floor(video.duration / 60)}:{String(video.duration % 60).padStart(2, '0')}
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {video.profileId?.personalInfo?.name || 'Anonymous'}
                </h3>
                <p className="text-sm text-gray-600">{video.profileId?.personalInfo?.title || 'Professional'}</p>

                {/* Stats */}
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                  <span>👁️ {video.views.toLocaleString()} views</span>
                  <span>❤️ {video.likes.toLocaleString()} likes</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
