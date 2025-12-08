/**
 * CV Upload Component
 * Allows users to upload and parse their CV/resume
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { resumeStore } from '@/stores/resumeStore';
import { toast } from 'sonner';
import { FileText, Upload, X } from 'lucide-react';

interface CVUploadProps {
  onSuccess?: () => void;
}

interface Profile {
  _id: string;
  profileName: string;
  isDefault: boolean;
}

interface Resume {
  _id: string;
  title: string;
  templateId: string;
}

type UploadTarget = 'profile' | 'resume';
type UploadMode = 'update' | 'create';

const CVUpload: React.FC<CVUploadProps> = ({ onSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // Target selection
  const [uploadTarget, setUploadTarget] = useState<UploadTarget>('profile');
  const [uploadMode, setUploadMode] = useState<UploadMode>('update');
  
  // Profile options
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [newProfileName, setNewProfileName] = useState('');
  
  // Resume options
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>('');
  const [newResumeTitle, setNewResumeTitle] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateProfile } = profileStore();
  const { accessToken } = authStore();

  const supportedFormats = ['pdf']; // PDF only
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  useEffect(() => {
    fetchProfiles();
    fetchResumes();
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

  const fetchResumes = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resumes`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setResumes(data.data);
        if (data.data.length > 0) {
          setSelectedResumeId(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Failed to fetch resumes:', error);
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
      return `Invalid format. Only PDF files are supported.`;
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

    // Validate selection based on target and mode
    if (uploadTarget === 'profile') {
      if (uploadMode === 'update' && !selectedProfileId) {
        setError('Please select a profile to update');
        toast.error('Please select a profile to update');
        return;
      }
      if (uploadMode === 'create' && !newProfileName.trim()) {
        setError('Please enter a name for the new profile');
        toast.error('Please enter a profile name');
        return;
      }
    } else if (uploadTarget === 'resume') {
      if (uploadMode === 'update' && !selectedResumeId) {
        setError('Please select a resume to update');
        toast.error('Please select a resume to update');
        return;
      }
      if (uploadMode === 'create' && !newResumeTitle.trim()) {
        setError('Please enter a title for the new resume');
        toast.error('Please enter a resume title');
        return;
      }
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadTarget', uploadTarget);
    formData.append('uploadMode', uploadMode);
    
    if (uploadTarget === 'profile') {
      if (uploadMode === 'create') {
        formData.append('newProfileName', newProfileName);
      } else {
        formData.append('profileId', selectedProfileId);
      }
    } else if (uploadTarget === 'resume') {
      if (uploadMode === 'create') {
        formData.append('newResumeTitle', newResumeTitle);
        formData.append('profileId', selectedProfileId); // Use selected profile for new resume
      } else {
        formData.append('resumeId', selectedResumeId);
      }
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
            setSuccess(true);
            setProgress(100);
            
            const targetName = uploadTarget === 'profile' ? 'Profile' : 'Resume';
            const action = uploadMode === 'create' ? 'created' : 'updated';
            toast.success(`${targetName} ${action} successfully from CV!`);
            
            // Refresh data lists
            fetchProfiles();
            fetchResumes();
            
            // Reset form
            setTimeout(() => {
              setSuccess(false);
              setProgress(0);
              setNewProfileName('');
              setNewResumeTitle('');
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
          Upload your PDF resume and we'll automatically extract information to create or update your profile or resume.
        </p>

        {/* Upload Target Selection */}
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            What do you want to update?
          </label>
          
          <div className="flex gap-4">
            <button
              onClick={() => setUploadTarget('profile')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                uploadTarget === 'profile'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-2 mb-1" />
              Profile
            </button>
            <button
              onClick={() => setUploadTarget('resume')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                uploadTarget === 'resume'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400'
              }`}
            >
              <FileText className="inline-block w-5 h-5 mr-2 mb-1" />
              Resume
            </button>
          </div>
        </div>

        {/* Upload Mode Selection */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            {uploadTarget === 'profile' ? 'Profile Selection' : 'Resume Selection'}
          </label>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setUploadMode('update')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                uploadMode === 'update'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Update Existing
            </button>
            <button
              onClick={() => setUploadMode('create')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                uploadMode === 'create'
                  ? 'bg-gray-800 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
              }`}
            >
              Create New
            </button>
          </div>

          {/* Conditional Selection UI */}
          {uploadTarget === 'profile' && uploadMode === 'update' && (
            <select
              value={selectedProfileId}
              onChange={(e) => setSelectedProfileId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select profile to update</option>
              {profiles.map((profile) => (
                <option key={profile._id} value={profile._id}>
                  {profile.profileName} {profile.isDefault ? '(Default)' : ''}
                </option>
              ))}
            </select>
          )}

          {uploadTarget === 'profile' && uploadMode === 'create' && (
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Enter new profile name (e.g., Software Engineer Profile)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          )}

          {uploadTarget === 'resume' && uploadMode === 'update' && (
            <select
              value={selectedResumeId}
              onChange={(e) => setSelectedResumeId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select resume to update</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.title}
                </option>
              ))}
            </select>
          )}

          {uploadTarget === 'resume' && uploadMode === 'create' && (
            <div className="space-y-3">
              <input
                type="text"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                placeholder="Enter new resume title (e.g., Senior Developer Resume)"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={selectedProfileId}
                onChange={(e) => setSelectedProfileId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select base profile</option>
                {profiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>
                    {profile.profileName} {profile.isDefault ? '(Default)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
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
            accept=".pdf"
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
                Drag your PDF here or click to upload
              </p>
              <p className="text-sm text-gray-500">
                PDF only · Max 10MB
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
