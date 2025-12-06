'use client';

import { useEffect, useState } from 'react';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { Lock, X, User as UserIcon } from 'lucide-react';

interface PublicResumeViewProps {
  username?: string;
  slug: string;
}

export default function PublicResumeView({ username, slug }: PublicResumeViewProps) {
  const [resume, setResume] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('No resume slug provided');
      setLoading(false);
      return;
    }

    const fetchResume = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        let endpoint;
        if (username) {
          endpoint = `${apiUrl}/resumes/public/${username}/${slug}`;
        } else {
          endpoint = `${apiUrl}/resumes/slug/${slug}`;
        }
        
        console.log('[PublicResumeView] Fetching from:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Resume not found');
          } else if (response.status === 403) {
            setError('This resume is private');
          } else if (response.status === 401) {
            setError('This resume is password protected');
          } else {
            setError('Failed to load resume');
          }
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log('[PublicResumeView] API Response:', data);
        console.log('[PublicResumeView] Resume:', data.data?.resume);
        console.log('[PublicResumeView] ProfileId type:', typeof data.data?.resume?.profileId);
        console.log('[PublicResumeView] ProfileId value:', data.data?.resume?.profileId);
        
        const resumeData = data.data.resume;
        setResume(resumeData);
        
        // Handle profile data - could be populated object or ID string
        let profileData = null;
        
        if (resumeData.profileId && typeof resumeData.profileId === 'object') {
          // Already populated
          console.log('[PublicResumeView] Profile already populated');
          profileData = resumeData.profileId;
        } else if (resumeData.profileId && typeof resumeData.profileId === 'string') {
          // Need to fetch profile separately
          console.log('[PublicResumeView] Need to fetch profile:', resumeData.profileId);
          try {
            const profileResponse = await fetch(`${apiUrl}/profiles/${resumeData.profileId}`, {
              credentials: 'omit',
            });
            if (profileResponse.ok) {
              const profileJson = await profileResponse.json();
              profileData = profileJson.data?.profile;
            }
          } catch (err) {
            console.error('[PublicResumeView] Failed to fetch profile:', err);
          }
        } else if (data.data.profile) {
          // Profile in separate field
          console.log('[PublicResumeView] Profile in data.profile');
          profileData = data.data.profile;
        }
        
        console.log('[PublicResumeView] Final profile data:', profileData);
        setProfile(profileData);
        
        if (data.data.owner) {
          setOwner(data.data.owner);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('[PublicResumeView] Error:', err);
        setError('Unable to connect to server');
        setLoading(false);
      }
    };

    fetchResume();
  }, [slug, username]);

  const handleClose = () => {
    // Remove hash and go back to home
    window.location.hash = '';
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">
            {error === 'Resume not found' 
              ? 'The resume you are looking for does not exist or has been removed.'
              : error === 'This resume is private'
              ? 'This resume is set to private and cannot be viewed publicly.'
              : error === 'This resume is password protected'
              ? 'This resume requires a password to view.'
              : 'This resume is not publicly accessible.'}
          </p>
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!resume || !profile || !profile.personalInfo) {
    return (
      <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Close"
        >
          <X className="w-6 h-6" />
        </button>
        <div className="text-center">
          <p className="text-gray-600 mb-2">No resume data available</p>
          <p className="text-sm text-gray-500">Profile: {profile ? 'loaded' : 'missing'}</p>
          <p className="text-sm text-gray-500">Resume: {resume ? 'loaded' : 'missing'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-50 z-[9999] overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {owner && (
              <div className="flex items-center gap-2 text-gray-700">
                <UserIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{owner.name || owner.email}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TemplateRenderer
            templateId={resume.templateId}
            profile={profile}
            customizations={resume.customizations || {}}
          />
        </div>
      </div>
    </div>
  );
}
