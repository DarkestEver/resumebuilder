'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileStore } from '@/stores/profileStore';
import { CoverLetterRenderer } from '@/components/cover-letter/CoverLetterRenderer';
import { coverLetterTemplates } from '@/lib/coverLetterTemplates';
import { CoverLetterTemplate, CoverLetterData } from '@/types/coverLetter';
import { FileText, Download, Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { authStore } from '@/stores/authStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function CoverLetterPageContent() {
  const { profile, fetchProfile } = profileStore();
  const [selectedTemplate, setSelectedTemplate] = useState<CoverLetterTemplate>(coverLetterTemplates[0]);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    companyName: '',
    positionTitle: '',
  });
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai');

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setCoverLetterData(prev => ({
        ...prev,
        senderName: `${profile.personalInfo?.firstName || ''} ${profile.personalInfo?.lastName || ''}`.trim(),
        senderEmail: profile.contact?.email || '',
        senderPhone: profile.contact?.phone || '',
        senderLinkedIn: profile.contact?.linkedin || '',
        senderAddress: profile.contact?.address?.city 
          ? `${profile.contact.address.city}${profile.contact.address.state ? ', ' + profile.contact.address.state : ''}`
          : '',
      }));
    }
  }, [profile]);

  const handleGenerate = async () => {
    if (!coverLetterData.companyName || !coverLetterData.positionTitle) {
      alert('Please provide company name and position title');
      return;
    }

    setLoading(true);
    try {
      const token = authStore.getState().accessToken;
      
      // Build resume content from profile
      const resumeContent = profile ? `
Name: ${coverLetterData.senderName}
Email: ${coverLetterData.senderEmail}
Phone: ${coverLetterData.senderPhone}

Summary: ${profile.summary || 'Experienced professional'}

Experience:
${profile.experience?.map(exp => `- ${exp.role} at ${exp.company}: ${exp.description || ''}`).join('\n')}

Skills: ${profile.skills?.map(s => s.name).join(', ')}
` : '';

      const res = await axios.post(
        `${API_BASE_URL}/ai/generate-cover-letter`,
        {
          resumeContent: resumeContent,
          jobDescription: coverLetterData.jobDescription || `${coverLetterData.positionTitle} position`,
          companyName: coverLetterData.companyName,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );

      setGeneratedContent(res.data.data.cover_letter || '');
      setShowPreview(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.querySelector('.cover-letter-preview');
    if (!element) return;

    // Simple text export
    const text = element.textContent || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${coverLetterData.companyName.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letter Generator</h1>
          <p className="text-gray-600">Create professional cover letters with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Template Selection & Form */}
          <div className="lg:col-span-1 space-y-6">
            {/* Template Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Select Template
              </h2>
              <div className="space-y-2">
                {coverLetterTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedTemplate.id === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-sm">{template.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{template.description}</div>
                    <div className="mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded">{template.category}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab('ai')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'ai' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  <Sparkles className="w-4 h-4 inline mr-2" />
                  AI Generate
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                    activeTab === 'manual' ? 'bg-purple-600 text-white' : 'bg-gray-100'
                  }`}
                >
                  Manual
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    value={coverLetterData.companyName}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, companyName: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Google"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Position Title *</label>
                  <input
                    type="text"
                    value={coverLetterData.positionTitle}
                    onChange={(e) => setCoverLetterData({ ...coverLetterData, positionTitle: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="Senior Software Engineer"
                  />
                </div>

                {activeTab === 'ai' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Description (Optional)</label>
                      <textarea
                        value={coverLetterData.jobDescription || ''}
                        onChange={(e) => setCoverLetterData({ ...coverLetterData, jobDescription: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2"
                        rows={4}
                        placeholder="Paste job description for better results..."
                      />
                    </div>

                    <button
                      onClick={handleGenerate}
                      disabled={loading}
                      className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate with AI
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6 space-y-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full bg-gray-100 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 flex items-center justify-center gap-2"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                onClick={handleDownload}
                disabled={!generatedContent}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="lg:col-span-2">
            {showPreview && (
              <div className="bg-gray-100 rounded-lg p-6 min-h-[800px]">
                <CoverLetterRenderer
                  template={selectedTemplate}
                  data={coverLetterData}
                  generatedContent={generatedContent}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent" />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">✨ AI is crafting your cover letter...</p>
              <p className="text-sm text-gray-600 mt-1">Analyzing your profile and job requirements</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CoverLetterPage() {
  return (
    <ProtectedRoute>
      <CoverLetterPageContent />
    </ProtectedRoute>
  );
}

