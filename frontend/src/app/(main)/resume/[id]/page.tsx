'use client';

/**
 * Resume Editor Page - Edit specific resume by ID
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { resumeStore } from '@/stores/resumeStore';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import ResumeCustomizer from '@/components/resume/ResumeCustomizer';
import ResumePreview from '@/components/resume/ResumePreview';
import ResumeContentEditor from '@/components/resume/ResumeContentEditor';
import TemplateSelectorV2 from '@/components/resume/TemplateSelectorV2';
import { TailorToJobModal } from '@/components/ai/TailorToJobModal';
import { ATSScoreWidget } from '@/components/ai/ATSScoreWidget';
import { Download, ArrowLeft, RefreshCw, Edit2, Link2, Copy } from 'lucide-react';
import { resumeApi } from '@/lib/api/resume';
import { toast } from 'sonner';

export default function ResumeEditorByIdPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const {
    selectedResume,
    isLoading,
    isSaving,
    fetchResumes,
    selectResume,
  } = resumeStore();

  const { profile, fetchProfile } = profileStore();
  const { user } = authStore();

  const [showTailorModal, setShowTailorModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [showContentEditor, setShowContentEditor] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password' | 'expiring'>('private');
  const [exportingPDF, setExportingPDF] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      await Promise.all([fetchResumes(), fetchProfile()]);
      if (resumeId) {
        selectResume(resumeId);
      }
    };
    loadResume();
  }, [resumeId, fetchResumes, fetchProfile, selectResume]);

  // Sync visibility state with selected resume
  useEffect(() => {
    if (selectedResume?.visibility) {
      setVisibility(selectedResume.visibility);
    }
  }, [selectedResume?.visibility]);

  // Get username from auth user (primary source)
  const username = user?.username;

  const handleExportPDF = async () => {
    if (!selectedResume?._id) return;
    
    try {
      setExportingPDF(true);
      
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Trigger browser print dialog
      window.print();
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to open print dialog');
    } finally {
      setExportingPDF(false);
    }
  };

  const handleSyncFromProfile = async () => {
    if (!selectedResume?._id) return;
    
    try {
      setIsSyncing(true);
      await resumeApi.syncFromProfile(selectedResume._id);
      toast.success('Resume data synced from profile successfully');
      // Refresh the resume
      await fetchResumes();
      selectResume(resumeId);
    } catch (error) {
      toast.error('Failed to sync from profile');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCopyPublicLink = () => {
    if (!username) {
      toast.error('Profile username not set');
      return;
    }
    const publicLink = `${window.location.origin}/${username}`;
    navigator.clipboard.writeText(publicLink);
    toast.success('Public link copied to clipboard!');
  };

  const handleCopyShortLink = () => {
    if (!selectedResume?.shortId) {
      toast.error('Short link not available');
      return;
    }
    const shortLink = `${window.location.origin}/r/${selectedResume.shortId}`;
    navigator.clipboard.writeText(shortLink);
    toast.success('Short link copied to clipboard!');
  };

  const handleCopySlugLink = () => {
    if (!username || !selectedResume?.slug) {
      toast.error('Custom slug link not available');
      return;
    }
    const slugLink = `${window.location.origin}/${username}/${selectedResume.slug}`;
    navigator.clipboard.writeText(slugLink);
    toast.success('Custom slug link copied to clipboard!');
  };

  const handleVisibilityChange = async (newVisibility: typeof visibility) => {
    if (!selectedResume?._id) return;
    
    try {
      await resumeApi.updateResume(selectedResume._id, {
        visibility: newVisibility,
      });
      setVisibility(newVisibility);
      toast.success('Visibility updated');
    } catch (error) {
      toast.error('Failed to update visibility');
    }
  };

  const handleTemplateChange = async (newTemplateId: string) => {
    if (!selectedResume?._id) return;
    
    try {
      await resumeApi.updateResume(selectedResume._id, {
        templateId: newTemplateId,
      });
      toast.success('Template changed successfully');
      setShowTemplateSelector(false);
      // Refresh the resume to show new template
      await fetchResumes();
      selectResume(resumeId);
    } catch (error) {
      toast.error('Failed to change template');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading resume...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!selectedResume) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Resume not found</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white rounded-lg shadow p-6 mb-6 no-print">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {selectedResume.title || selectedResume.name || 'Untitled Resume'}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Template: {selectedResume.templateId}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Change Template */}
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium"
                  title="Change resume template"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 010 2H6v13h13v-3a1 1 0 112 0v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  </svg>
                  Change Template
                </button>

                {/* Edit Resume Content */}
                <button
                  onClick={() => setShowContentEditor(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm font-medium"
                  title="Edit this resume's content without changing your profile"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Content
                </button>

                {/* Sync from Profile */}
                <button
                  onClick={handleSyncFromProfile}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                  title="Refresh resume data from your profile"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync from Profile'}
                </button>

                {/* Edit Profile */}
                <button
                  onClick={() => router.push('/profile')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>

                {/* Visibility */}
                <select
                  value={visibility}
                  onChange={(e) => handleVisibilityChange(e.target.value as typeof visibility)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="private">🔒 Private</option>
                  <option value="public">🌍 Public</option>
                </select>

                {/* Export PDF */}
                <button
                  onClick={handleExportPDF}
                  disabled={exportingPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  {exportingPDF ? 'Exporting...' : 'Export PDF'}
                </button>
              </div>
            </div>

            {/* Sync Info */}
            {selectedResume?.lastSyncedAt && (
              <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Last synced: {new Date(selectedResume.lastSyncedAt).toLocaleString()}</span>
              </div>
            )}

            {/* Share Links */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
              {/* Public Link */}
              {visibility === 'public' && username && (
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <Link2 className="w-3.5 h-3.5 text-blue-600" />
                  <span className="text-gray-600 font-medium">Public:</span>
                  <button
                    onClick={handleCopyPublicLink}
                    className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    title="Click to copy"
                  >
                    <span className="font-mono text-xs">/{username}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Custom Slug Link */}
              {username && selectedResume?.slug && (
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg">
                  <Link2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-gray-600 font-medium">Slug:</span>
                  <button
                    onClick={handleCopySlugLink}
                    className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
                    title="Click to copy"
                  >
                    <span className="font-mono text-xs">/{username}/{selectedResume.slug}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Short Link */}
              {selectedResume?.shortId && (
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                  <Link2 className="w-3.5 h-3.5 text-gray-600" />
                  <span className="text-gray-600 font-medium">Short:</span>
                  <button
                    onClick={handleCopyShortLink}
                    className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
                    title="Click to copy"
                  >
                    <span className="font-mono text-xs">/r/{selectedResume.shortId}</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ATS Score Widget */}
          {selectedResume._id && (
            <ATSScoreWidget resumeId={selectedResume._id} />
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customizer */}
            <div className="no-print">
              <ResumeCustomizer resume={selectedResume} onNext={() => {}} />
            </div>

            {/* Preview */}
            <div className="sticky top-4">
              <ResumePreview resume={selectedResume} />
            </div>
          </div>

          {/* Tailor to Job Modal */}
          {showTailorModal && selectedResume._id && (
            <TailorToJobModal
              resumeId={selectedResume._id}
              onClose={() => setShowTailorModal(false)}
            />
          )}

          {/* Content Editor Modal */}
          {showContentEditor && selectedResume && (
            <ResumeContentEditor
              resume={selectedResume}
              onClose={() => setShowContentEditor(false)}
              onSave={async () => {
                await fetchResumes();
                selectResume(resumeId);
              }}
            />
          )}

          {/* Template Selector Modal */}
          {showTemplateSelector && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Change Template</h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Select a new template for your resume
                      </p>
                    </div>
                    <button
                      onClick={() => setShowTemplateSelector(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <TemplateSelectorV2
                    onSelectTemplate={(templateId) => {
                      handleTemplateChange(templateId);
                      setShowTemplateSelector(false);
                    }}
                    existingResumes={[]}
                    onSelectExisting={() => {}}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
