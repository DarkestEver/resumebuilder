/**
 * Video Upload Component - Upload and manage profile videos
 */

'use client';

import React, { useState, useRef } from 'react';
import { authStore } from '@/stores/authStore';

interface VideoUploadProps {
  onSuccess?: (videoId: string) => void;
}

export default function VideoUpload({ onSuccess }: VideoUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);

    // Validate file
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska', 'video/webm'];

    if (!allowedTypes.includes(file.type)) {
      setError('Only video files are allowed (MP4, AVI, MOV, MKV, WebM)');
      return;
    }

    if (file.size > maxSize) {
      setError('Video file must be less than 100MB');
      return;
    }

    uploadVideo(file);
  };

  const uploadVideo = (file: File) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      // Get token from auth store
      const token = authStore.getState().accessToken;

      if (!token) {
        setError('Please login to upload videos');
        setUploading(false);
        return;
      }

      const xhr = new XMLHttpRequest();

      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            setSuccess(true);
            setProgress(100);
            setTimeout(() => {
              onSuccess?.(response.data.videoId);
              setUploading(false);
            }, 1500);
          } else {
            setError(response.error || 'Video upload failed');
            setUploading(false);
          }
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || 'Failed to upload video');
          setUploading(false);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Network error during upload');
        setUploading(false);
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/videos/upload`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Upload Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          className="hidden"
        />

        {!uploading && !success ? (
          <div onClick={() => fileInputRef.current?.click()}>
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M17.657 17.657L21 21m-7-7l3.536-3.536m0 5.656L9.172 9.172a4 4 0 015.656 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5-4a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Video</h3>
            <p className="text-gray-600 mb-2">Drag and drop your video or click to browse</p>
            <p className="text-sm text-gray-500">MP4, AVI, MOV, MKV, WebM (Max 100MB)</p>
          </div>
        ) : uploading ? (
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-700 font-semibold">{progress}%</p>
            <p className="text-sm text-gray-500 mt-2">Uploading your video...</p>
          </div>
        ) : success ? (
          <div>
            <svg className="w-16 h-16 mx-auto mb-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <h3 className="text-lg font-semibold text-green-600">Upload Complete!</h3>
            <p className="text-gray-600 mt-2">Your video is ready to share</p>
          </div>
        ) : null}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <span className="font-semibold">💡 Tip:</span> Videos should be vertical or horizontal. Keep them under 10 minutes for best results.
        </p>
      </div>
    </div>
  );
}
