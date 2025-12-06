'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TemplateRenderer from '@/components/resume/TemplateRenderer';
import { Lock, ArrowLeft, User as UserIcon } from 'lucide-react';

function PublicResumeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug');
  const username = searchParams.get('username');
  
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
        // NEXT_PUBLIC_API_URL already includes /api
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        let endpoint;
        if (username) {
          // Fetch by username and slug
          endpoint = `${apiUrl}/resumes/public/${username}/${slug}`;
        } else {
          // Fetch by slug only (backward compatibility)
          endpoint = `${apiUrl}/resumes/slug/${slug}`;
        }
        
        console.log('[PublicResume] Fetching from:', endpoint);
        console.log('[PublicResume] Username:', username, 'Slug:', slug);
        
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'omit',
        });
        
        console.log('[PublicResume] Response status:', response.status);
        
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
        setResume(data.data.resume);
        
        if (data.data.resume.profileId) {
          setProfile(data.data.resume.profileId);
        }
        
        if (data.data.owner) {
          setOwner(data.data.owner);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Unable to connect to server. Please try again later.');
        setLoading(false);
      }
    };

    fetchResume();
  }, [slug, username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">
            {error === 'Resume not found' 
              ? 'The resume you are looking for does not exist or has been removed.'
              : error === 'This resume is private'
              ? 'This resume is set to private and cannot be viewed publicly. The owner needs to change the visibility to "Public" to share it.'
              : error === 'This resume is password protected'
              ? 'This resume requires a password to view.'
              : 'This resume is not publicly accessible.'}
          </p>
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!resume || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No resume data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-4">
            {owner && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <UserIcon className="w-4 h-4" />
                <span>{owner.name || owner.username}</span>
              </div>
            )}
            <div className="text-sm text-gray-500">
              {resume.viewCount || 0} views
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <TemplateRenderer 
            templateId={resume.templateId || 'modern'} 
            profile={profile}
            customizations={resume.customizations}
          />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Created with ProfileBuilder • Professional Resume Builder</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    }>
      <PublicResumeContent />
    </Suspense>
  );
}
