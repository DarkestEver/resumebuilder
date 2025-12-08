/**
 * Video Profile Page
 */

'use client';

import React, { useState, useEffect } from 'react';
import VideoUpload from '@/components/VideoUpload';
import VideoPlayer from '@/components/VideoPlayer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authStore } from '@/stores/authStore';
import apiClient from '@/lib/api/auth';

export default function VideoProfilePage() {
  const { user } = authStore();
  const [profileId, setProfileId] = useState<string>('');
  const [uploaded, setUploaded] = useState(false);
  const [hasExistingVideo, setHasExistingVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get('/profiles');
        
        // Profile API returns: { success: true, data: { profile: {...} } }
        const profile = response.data?.data?.profile;
        
        if (profile && profile._id) {
          const fetchedProfileId = profile._id;
          setProfileId(fetchedProfileId);
          
          // Check if video already exists
          try {
            const videoResponse = await apiClient.get(`/videos/${fetchedProfileId}`);
            if (videoResponse.data.success && videoResponse.data.data) {
              setHasExistingVideo(true);
              setUploaded(true);
            }
          } catch (err) {
            // No video exists yet, that's fine
            setHasExistingVideo(false);
          }
        } else {
          // Profile doesn't exist
          console.log('No profile found');
          setProfileId('');
        }
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setProfileId('');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profileId) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">⚠️ Profile Not Found</div>
            <p className="text-gray-600">Please complete your profile first.</p>
            <a href="/profile" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Go to Profile
            </a>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Profile</h1>
          <p className="text-gray-600 mb-12">
            Create a video introduction for your resume. It helps recruiters get to know you better!
          </p>

          {/* Video Upload Section */}
          {!uploaded ? (
            <div className="bg-white rounded-lg shadow p-8 mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload Your Video</h2>
              <VideoUpload onSuccess={() => {
                setUploaded(true);
                setHasExistingVideo(true);
              }} />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Video Profile</h2>
              <VideoPlayer profileId={profileId} isOwner={true} />
              
              <button
                onClick={() => setUploaded(false)}
                className="mt-6 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 font-semibold"
              >
                {hasExistingVideo ? 'Replace Video' : 'Upload New Video'}
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">✨ Video Tips</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Keep it 30-60 seconds</li>
                <li>✓ Dress professionally</li>
                <li>✓ Good lighting and clear audio</li>
                <li>✓ Smile and maintain eye contact</li>
                <li>✓ Speak clearly and with enthusiasm</li>
                <li>✓ Briefly introduce yourself and your skills</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎬 What to Include</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ Your name and professional title</li>
                <li>✓ Key skills and experiences</li>
                <li>✓ Your unique value proposition</li>
                <li>✓ What you're looking for</li>
                <li>✓ How to contact you</li>
                <li>✓ A positive, confident tone</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
