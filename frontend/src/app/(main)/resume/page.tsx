'use client';

/**
 * Resume Editor Page
 * Template selection, customization, preview, and PDF export
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { resumeStore } from '@/stores/resumeStore';
import { profileStore } from '@/stores/profileStore';
import TemplateSelector from '@/components/resume/TemplateSelector';
import ResumeCustomizer from '@/components/resume/ResumeCustomizer';
import ResumePreview from '@/components/resume/ResumePreview';
import { TailorToJobModal } from '@/components/ai/TailorToJobModal';
import { ATSScoreWidget } from '@/components/ai/ATSScoreWidget';
import { Download, Eye, EyeOff, Lock, Globe, AlertCircle } from 'lucide-react';
import { resumeApi } from '@/lib/api/resume';
import { toast } from 'sonner';

export default function ResumeEditorPage() {
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

  const [step, setStep] = useState<'select' | 'customize' | 'preview'>('select');
  const [showNewResumeModal, setShowNewResumeModal] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [showTailorModal, setShowTailorModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password' | 'expiring'>('private');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [profileChecked, setProfileChecked] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

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

  // Watch for selectedResume changes after creation
  useEffect(() => {
    if (justCreated && selectedResume) {
      console.log('Resume created, navigating to customize:', selectedResume);
      setStep('customize');
      setJustCreated(false);
    }
  }, [selectedResume, justCreated]);

  // Safety check: if on customize/preview without selected resume, go back to select
  useEffect(() => {
    if (!isLoading && (step === 'customize' || step === 'preview') && !selectedResume) {
      console.log('No resume selected, going back to select');
      setStep('select');
    }
  }, [step, selectedResume, isLoading]);

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
      
      console.log('Creating resume with slug:', slug);
      
      await createResume({
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
      
      // Flag that we just created a resume
      setJustCreated(true);
      
    } catch (error: any) {
      console.error('Failed to create resume:', error);
      toast.error(error?.response?.data?.message || 'Failed to create resume. Please ensure you have completed your profile first.');
      setJustCreated(false);
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
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
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

          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8 mb-4">
              <button
                onClick={() => setStep('select')}
                className={`flex flex-col items-center space-y-2 ${
                  step === 'select' ? 'opacity-100' : 'opacity-50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'select'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  1
                </div>
                <span className="text-sm font-medium">Select Template</span>
              </button>

              <div className="flex-1 h-1 bg-gray-300 max-w-[100px]"></div>

              <button
                onClick={() => setStep('customize')}
                disabled={!selectedResume}
                className={`flex flex-col items-center space-y-2 ${
                  !selectedResume ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'customize'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="text-sm font-medium">Customize</span>
              </button>

              <div className="flex-1 h-1 bg-gray-300 max-w-[100px]"></div>

              <button
                onClick={() => setStep('preview')}
                disabled={!selectedResume}
                className={`flex flex-col items-center space-y-2 ${
                  !selectedResume ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="text-sm font-medium">Preview & Export</span>
              </button>
            </div>
            
            {/* Step Description */}
            <div className="text-center text-sm text-gray-600">
              {step === 'select' && (
                <p>Choose an existing resume to edit or create a new one with a template</p>
              )}
              {step === 'customize' && (
                <p>Customize colors, fonts, and sections. Your profile data populates automatically.</p>
              )}
              {step === 'preview' && (
                <p>Review your resume, set visibility, and export to PDF</p>
              )}
            </div>
          </div>

          {/* Content */}
          {step === 'select' && (
            <TemplateSelector
              onSelectTemplate={(templateId) => {
                setSelectedTemplateId(templateId);
                setShowNewResumeModal(true);
              }}
              existingResumes={resumes || []}
              onSelectExisting={(resume) => {
                selectResume(resume._id || resume.id);
                setStep('customize');
              }}
              onRename={async (resume, newName) => {
                try {
                  await resumeApi.updateResume(resume._id || resume.id, { title: newName });
                  await fetchResumes();
                  toast.success('Resume renamed successfully');
                } catch (error) {
                  toast.error('Failed to rename resume');
                }
              }}
              onUpdateSlug={async (resume, newSlug) => {
                try {
                  // Sanitize slug
                  const sanitizedSlug = newSlug.toLowerCase()
                    .replace(/[^a-z0-9-]+/g, '-')
                    .replace(/^-+|-+$/g, '')
                    .replace(/-+/g, '-');
                  
                  await resumeApi.updateResume(resume._id || resume.id, { slug: sanitizedSlug });
                  await fetchResumes();
                  toast.success('Slug updated successfully');
                } catch (error: any) {
                  toast.error(error.response?.data?.message || 'Failed to update slug');
                }
              }}
            />
          )}

          {step === 'customize' && selectedResume && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <ResumeCustomizer
                  resume={selectedResume}
                  onNext={() => setStep('preview')}
                />
              </div>
              <div className="lg:col-span-1 space-y-4">
                <ATSScoreWidget resumeId={selectedResume._id || selectedResume.id} />
                <button
                  className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors"
                  onClick={() => setShowTailorModal(true)}
                >
                  🎯 Tailor to Job
                </button>
              </div>
            </div>
          )}

          {step === 'preview' && selectedResume && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex items-center gap-4">
                  <select
                    value={visibility}
                    onChange={(e) => {
                      const newVisibility = e.target.value as typeof visibility;
                      setVisibility(newVisibility);
                      resumeApi.updateVisibility(selectedResume._id || selectedResume.id, newVisibility)
                        .then(() => toast.success('Visibility updated'))
                        .catch(() => toast.error('Failed to update visibility'));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="private">🔒 Private</option>
                    <option value="public">🌐 Public</option>
                    <option value="password">🔑 Password Protected</option>
                    <option value="expiring">⏰ Expiring Link</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowPDFModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
              <ResumePreview resume={selectedResume} />
            </div>
          )}
        </div>
      </div>

      {/* New Resume Modal */}
      {showNewResumeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Resume</h2>
            <p className="text-sm text-gray-600 mb-4">
              Selected template: <span className="font-medium text-blue-600">{selectedTemplateId}</span>
            </p>
            <input
              type="text"
              value={newResumeName}
              onChange={(e) => setNewResumeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
              placeholder="Resume Name (e.g., Software Engineer Role)"
            />
            
            <div className="mb-4">
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
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tailor to Job Modal */}
      {showTailorModal && selectedResume && (
        <TailorToJobModal
          resumeId={selectedResume._id || selectedResume.id}
          onClose={() => setShowTailorModal(false)}
          onApplied={() => setShowTailorModal(false)}
        />
      )}

      {/* PDF Export Modal */}
      {showPDFModal && selectedResume && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Export PDF</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Page Size</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="A4">A4</option>
                  <option value="Letter">Letter</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm text-gray-700">Include watermark (Free plan)</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPDFModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setExportingPDF(true);
                  try {
                    const blob = await resumeApi.generatePDF(selectedResume._id || selectedResume.id);
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${selectedResume.title || selectedResume.name || 'resume'}.pdf`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    toast.success('PDF exported successfully');
                    setShowPDFModal(false);
                  } catch (error) {
                    toast.error('Failed to export PDF');
                  } finally {
                    setExportingPDF(false);
                  }
                }}
                disabled={exportingPDF}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {exportingPDF ? 'Exporting...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
