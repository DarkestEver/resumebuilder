'use client';

import { useState, useRef } from 'react';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { useAutoSave } from '@/hooks/useAutoSave';
import { toast } from 'react-hot-toast';
import apiClient from '@/lib/api/auth';

interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  title?: string;
  photo?: string;
}

export default function PersonalInfoSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const user = authStore((state) => state.user);
  const [formData, setFormData] = useState<PersonalInfo>(profile?.personalInfo || {});
  const [isUploading, setIsUploading] = useState(false);
  const [photoVisibility, setPhotoVisibility] = useState<'public' | 'private'>('public');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useAutoSave(isDirty, formData, async (data) => {
    await updateProfile({ personalInfo: data });
  });

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };

    switch (field) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;
      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newErrors.lastName;
        }
        break;
      case 'title':
        if (!value.trim()) {
          newErrors.title = 'Professional title is required';
        } else if (value.trim().length < 3) {
          newErrors.title = 'Title must be at least 3 characters';
        } else {
          delete newErrors.title;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
    setDirty(true);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setIsUploading(true);
    const formDataObj = new FormData();
    formDataObj.append('photo', file);
    formDataObj.append('visibility', photoVisibility);

    try {
      const response = await apiClient.post('/users/photo', formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const photoUrl = response.data.data.photoUrl;
      
      // Build full URL for file system photos
      const fullPhotoUrl = photoUrl.startsWith('http') || photoUrl.startsWith('data:') 
        ? photoUrl 
        : `http://localhost:5000${photoUrl}`;
      
      // Update profile with new photo URL
      setFormData((prev) => ({ ...prev, photo: fullPhotoUrl }));
      setDirty(true);
      
      // Update auth store user photo
      if (user) {
        authStore.setState({ 
          user: { ...user, profilePhoto: fullPhotoUrl } 
        });
      }

      toast.success('Profile photo uploaded successfully!');
    } catch (error: any) {
      console.error('Photo upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload photo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photo: '' }));
    setDirty(true);
    toast.success('Profile photo removed');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
        {isSaving && <span className="text-sm text-blue-600">Saving...</span>}
      </div>

      {/* Profile Photo Upload */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Profile Photo
        </label>
        
        <div className="flex items-start gap-6">
          {/* Photo Preview */}
          <div className="flex-shrink-0">
            {formData.photo || user?.profilePhoto ? (
              <div className="relative">
                <img
                  src={formData.photo || user?.profilePhoto || ''}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button
                  onClick={handleRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-lg"
                  title="Remove photo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            
            <label
              htmlFor="photo-upload"
              className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isUploading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Photo
                </>
              )}
            </label>

            {/* Visibility Toggle */}
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-2">Photo Visibility</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="photoVisibility"
                    value="public"
                    checked={photoVisibility === 'public'}
                    onChange={(e) => setPhotoVisibility(e.target.value as 'public')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Public</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="photoVisibility"
                    value="private"
                    checked={photoVisibility === 'private'}
                    onChange={(e) => setPhotoVisibility(e.target.value as 'private')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Private</span>
                </label>
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-3">
              • Max file size: 5MB<br />
              • Accepted formats: JPG, PNG, GIF<br />
              • Square images work best (1:1 ratio)
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName || ''}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName || ''}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.title ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Senior Software Engineer"
          />
          {errors.title && (
            <p className="text-xs text-red-600 mt-1">{errors.title}</p>
          )}
        </div>
      </div>
    </div>
  );
}
