/**
 * CV Upload Component
 * Allows users to upload and parse their CV/resume
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';

interface CVUploadProps {
  onSuccess?: () => void;
}

interface Profile {
  _id: string;
  profileName: string;
  isDefault: boolean;
}

const CVUpload: React.FC<CVUploadProps> = ({ onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [createNewProfile, setCreateNewProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile } = profileStore();
  const { accessToken } = authStore();

  const supportedFormats = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-collections`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setProfiles(data.data);
        // Set default profile as selected
        const defaultProfile = data.data.find((p: Profile) => p.isDefault);
        if (defaultProfile) {
          setSelectedProfileId(defaultProfile._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): string | null => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !supportedFormats.includes(ext)) {
      return `Invalid format. Supported: ${supportedFormats.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return 'File size exceeds 10MB limit';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    if (!createNewProfile && !selectedProfileId) {
      setError('Please select a profile or create a new one');
      toast.error('Please select a profile');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    
    if (createNewProfile) {
      formData.append('createNew', 'true');
      formData.append('profileName', newProfileName || `Profile ${profiles.length + 1}`);
    } else {
      formData.append('profileId', selectedProfileId);
    }

    try {
      const xhr = new XMLHttpRequest();

      // Track progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success && response.data) {
            // Update profile store with extracted data
            updateProfile(response.data.extractedData);
            setSuccess(true);
            setProgress(100);
            toast.success('CV uploaded and parsed successfully!');
            
            // Refresh profiles list
            fetchProfiles();
            
            // Reset form
            setTimeout(() => {
              setSuccess(false);
              setProgress(0);
              setCreateNewProfile(false);
              setNewProfileName('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
              onSuccess?.();
            }, 2000);
          }
        } else {
          const response = JSON.parse(xhr.responseText);
          const errorMsg = response.message || 'Failed to upload CV';
          setError(errorMsg);
          toast.error(errorMsg);
          setUploading(false);
        }
      });

      // Handle errors
      xhr.addEventListener('error', () => {
        const errorMsg = 'Network error during upload';
        setError(errorMsg);
        toast.error(errorMsg);
        setUploading(false);
      });

      xhr.open('POST', `${process.env.NEXT_PUBLIC_API_URL}/cv/upload`);
      if (accessToken) {
        xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      }
      xhr.send(formData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMsg);
      toast.error(errorMsg);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      uploadFile(files[0]);
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-2">Upload Your CV</h2>
        <p className="text-gray-600 mb-6">
          Upload your resume or CV and we'll automatically extract information to populate your profile.
        </p>

        {/* Profile Selection */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload to Profile
          </label>
          
          <div className="space-y-3">
            {/* Existing Profile Selection */}
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="existing-profile"
                checked={!createNewProfile}
                onChange={() => setCreateNewProfile(false)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="existing-profile" className="flex-1">
                <select
                  value={selectedProfileId}
                  onChange={(e) => setSelectedProfileId(e.target.value)}
                  disabled={createNewProfile}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select existing profile</option>
                  {profiles.map((profile) => (
                    <option key={profile._id} value={profile._id}>
                      {profile.profileName} {profile.isDefault ? '(Default)' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Create New Profile */}
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="new-profile"
                checked={createNewProfile}
                onChange={() => setCreateNewProfile(true)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="new-profile" className="flex-1">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  disabled={!createNewProfile}
                  placeholder="New profile name (e.g., Software Engineer Profile)"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            dragActive
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleChange}
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            disabled={uploading}
          />

          {/* Icons & Text */}
          {!uploading && !success && (
            <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
              <svg
                className="mx-auto h-12 w-12 text-gray-400 mb-4"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20m-18-8v12m0 0l-4-4m4 4l4-4m-8 20h16"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-lg font-semibold text-gray-700 mb-1">
                Drag your CV here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {uploading && !success && (
            <div className="w-full">
              <p className="text-sm font-medium text-gray-700 mb-3">Uploading and parsing...</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{progress}%</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex flex-col items-center">
              <svg
                className="h-12 w-12 text-green-500 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p className="text-lg font-semibold text-green-600">CV uploaded successfully!</p>
              <p className="text-sm text-gray-600 mt-2">Your profile has been updated with extracted information.</p>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && !uploading && !success && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">💡 Tip:</span> We use OCR and AI to extract information from your CV. 
            The more clearly formatted your document, the better the extraction results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVUpload;
