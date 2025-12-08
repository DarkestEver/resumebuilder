'use client';

/**
 * Resume Editor Page
 * Template selection, customization, preview, and PDF export
 */

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { resumeStore } from '@/stores/resumeStore';
import { profileStore } from '@/stores/profileStore';
import TemplateSelectorV2 from '@/components/resume/TemplateSelectorV2';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

function ResumeEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    resumes,
    selectedResume,
    isLoading,
    isSaving,
    fetchResumes,
    selectResume,
    createResume,
  } = resumeStore();
  
  const { profile, fetchProfile } = profileStore();

  const [showNewResumeModal, setShowNewResumeModal] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [profileChecked, setProfileChecked] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchResumes(), fetchProfile()]);
      setProfileChecked(true);
    };
    loadData();
  }, [fetchResumes, fetchProfile]);

  // Separate effect to handle URL template parameter
  useEffect(() => {
    const templateFromUrl = searchParams.get('template');
    if (templateFromUrl && profileChecked) {
      setSelectedTemplateId(templateFromUrl);
      setShowNewResumeModal(true);
    }
  }, [searchParams, profileChecked]);

  const handleCreateResume = async () => {
    if (!selectedTemplateId) return;
    
    try {
      const title = newResumeName || 'My Resume';
      
      // Use custom slug if provided, otherwise auto-generate
      let slug: string;
      if (customSlug.trim()) {
        // Sanitize custom slug
        slug = customSlug.toLowerCase()
          .replace(/[^a-z0-9-]+/g, '-')
          .replace(/^-+|-+$/g, '')
          .replace(/-+/g, '-');
      } else {
        // Auto-generate from title with timestamp and random suffix
        const randomSuffix = Math.random().toString(36).substring(2, 8);
        slug = title.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') + '-' + Date.now() + '-' + randomSuffix;
      }
      
      const newResume = await createResume({
        title,
        templateId: selectedTemplateId,
        slug,
      });
      
      toast.success('Resume created successfully!');
      
      // Clear modal state
      setNewResumeName('');
      setCustomSlug('');
      setSelectedTemplateId('');
      setShowNewResumeModal(false);
      
      // Redirect to the new resume page
      if (newResume && (newResume._id || newResume.id)) {
        router.push(`/resume/${newResume._id || newResume.id}`);
      }
      
    } catch (error: any) {
      console.error('Failed to create resume:', error);
      toast.error(error?.response?.data?.message || 'Failed to create resume. Please ensure you have completed your profile first.');
    }
  };

  if (isLoading || !profileChecked) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Check if profile exists
  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Required</h2>
            <p className="text-gray-600 mb-6">
              You need to create your profile first before building resumes. Your profile contains the personal information, experience, education, and skills that will be used in your resumes.
            </p>
            <button
              onClick={() => router.push('/profile')}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Create Your Profile Now
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header with Profile Selector */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
                <p className="mt-2 text-gray-600">
                  Create tailored resumes for different jobs using your profile data
                </p>
              </div>
              {resumes && resumes.length > 0 && (
                <Link
                  href="/profile"
                  className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Edit Profile Data
                </Link>
              )}
            </div>
          </div>

          {/* Resumes Section */}
          {resumes && resumes.length > 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Resumes</h2>
                <button
                  onClick={() => setShowNewResumeModal(true)}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  + New Resume
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resumes.map((resume) => (
                  <Link
                    key={resume._id || resume.id}
                    href={`/resume/${resume._id || resume.id}`}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                        {resume.title || resume.name || 'Untitled Resume'}
                      </h3>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">
                      Template: {resume.templateId || 'default'}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {resume.viewCount || 0}
                      </span>
                      <span>{resume.visibility === 'public' ? '🌍 Public' : '🔒 Private'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your First Resume</h2>
                <p className="text-gray-600">Choose a template to get started</p>
              </div>
              <TemplateSelectorV2
                onSelectTemplate={(templateId) => {
                  setSelectedTemplateId(templateId);
                  setShowNewResumeModal(true);
                }}
                existingResumes={[]}
                onSelectExisting={() => {}}
              />
            </div>
          )}
        </div>
      </div>

      {/* New Resume Modal */}
      {showNewResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-2">Create New Resume</h2>
            <p className="text-gray-600 mb-6">Choose a template and customize your resume</p>
            
            {/* Step 1: Template Selection (if not selected yet) */}
            {!selectedTemplateId ? (
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 1: Choose a Template</h3>
                <TemplateSelectorV2
                  onSelectTemplate={(templateId) => {
                    setSelectedTemplateId(templateId);
                  }}
                  existingResumes={[]}
                  onSelectExisting={() => {}}
                />
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => {
                      setShowNewResumeModal(false);
                      setSelectedTemplateId('');
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2: Resume Details */
              <div>
                <h3 className="text-lg font-semibold mb-4">Step 2: Resume Details</h3>
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Selected template:</span> <span className="font-semibold">{selectedTemplateId}</span>
                  </p>
                  <button
                    onClick={() => setSelectedTemplateId('')}
                    className="text-xs text-blue-600 hover:text-blue-700 underline mt-1"
                  >
                    Change template
                  </button>
                </div>
                
                <input
                  type="text"
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                  placeholder="Resume Name (e.g., Software Engineer Role)"
                />
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom URL Slug (Optional)
                  </label>
                  <input
                    type="text"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="my-software-resume (leave empty for auto-generate)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Create a memorable URL like: profilebuilder.com/username/<span className="font-medium">{customSlug || 'auto-generated-slug'}</span>
                  </p>
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowNewResumeModal(false);
                      setSelectedTemplateId('');
                      setNewResumeName('');
                      setCustomSlug('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateResume}
                    disabled={!selectedTemplateId}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Create Resume
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

export default function ResumeEditorPage() {
  return (
    <Suspense fallback={
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </ProtectedRoute>
    }>
      <ResumeEditorContent />
    </Suspense>
  );
}
