'use client';

/**
 * Resume Editor Page - Edit specific resume by ID
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { resumeStore } from '@/stores/resumeStore';
import ResumeCustomizer from '@/components/resume/ResumeCustomizer';
import ResumePreview from '@/components/resume/ResumePreview';
import { TailorToJobModal } from '@/components/ai/TailorToJobModal';
import { ATSScoreWidget } from '@/components/ai/ATSScoreWidget';
import { Download, ArrowLeft, Eye, EyeOff, Lock, Globe } from 'lucide-react';
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

  const [showTailorModal, setShowTailorModal] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const [visibility, setVisibility] = useState<'public' | 'private' | 'password' | 'expiring'>('private');
  const [exportingPDF, setExportingPDF] = useState(false);

  useEffect(() => {
    const loadResume = async () => {
      await fetchResumes();
      if (resumeId) {
        selectResume(resumeId);
      }
    };
    loadResume();
  }, [resumeId, fetchResumes, selectResume]);

  const handleExportPDF = async () => {
    if (!selectedResume?._id) return;
    
    try {
      setExportingPDF(true);
      await resumeApi.exportPDF(selectedResume._id);
      toast.success('PDF exported successfully');
    } catch (error) {
      toast.error('Failed to export PDF');
    } finally {
      setExportingPDF(false);
    }
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
          <div className="bg-white rounded-lg shadow p-6 mb-6">
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
                {/* Visibility */}
                <select
                  value={visibility}
                  onChange={(e) => handleVisibilityChange(e.target.value as typeof visibility)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="private">
                    <Lock className="w-4 h-4 inline mr-1" /> Private
                  </option>
                  <option value="public">
                    <Globe className="w-4 h-4 inline mr-1" /> Public
                  </option>
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
          </div>

          {/* ATS Score Widget */}
          {selectedResume._id && (
            <ATSScoreWidget resumeId={selectedResume._id} />
          )}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customizer */}
            <div>
              <ResumeCustomizer />
            </div>

            {/* Preview */}
            <div className="sticky top-4">
              <ResumePreview />
            </div>
          </div>

          {/* Tailor to Job Modal */}
          {showTailorModal && selectedResume._id && (
            <TailorToJobModal
              resumeId={selectedResume._id}
              onClose={() => setShowTailorModal(false)}
            />
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
