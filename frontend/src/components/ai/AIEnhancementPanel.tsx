'use client';

import React, { useState } from 'react';
import { aiApi } from '@/lib/api/ai';
import { AlertCircle, Loader2, Copy, CheckCircle2 } from 'lucide-react';

interface AIEnhancementPanelProps {
  resumeContent: string;
  jobDescription?: string;
  onApply?: (content: string) => void;
  creditsAvailable: number;
}

export const AIEnhancementPanel: React.FC<AIEnhancementPanelProps> = ({
  resumeContent,
  jobDescription,
  onApply,
  creditsAvailable,
}) => {
  const [showDialog, setShowDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'improve' | 'tailor' | 'ats' | 'bullets'>('improve');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [jobDesc, setJobDesc] = useState(jobDescription || '');
  const [error, setError] = useState<string>('');
  const [atsScore, setAtsScore] = useState<{ score: number; feedback: string } | null>(null);

  const handleImprove = async () => {
    if (creditsAvailable < 100) {
      setError('Insufficient AI credits');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.improveContent(resumeContent, 'enhance');
      setResult(response.improved_content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to improve content');
    } finally {
      setLoading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDesc.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (creditsAvailable < 200) {
      setError('Insufficient AI credits (needs 200)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.tailorForJob(resumeContent, jobDesc);
      setResult(response.tailored_resume);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to tailor resume');
    } finally {
      setLoading(false);
    }
  };

  const handleScoreATS = async () => {
    if (!jobDesc.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (creditsAvailable < 150) {
      setError('Insufficient AI credits (needs 150)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.scoreATS(resumeContent, jobDesc);
      setAtsScore({ score: response.score, feedback: response.feedback });
      setResult(`ATS Score: ${response.score}/100\n\nFeedback: ${response.feedback}\n\nKeywords Found: ${response.keywords_found.join(', ')}\n\nMissing Keywords: ${response.keywords_missing.join(', ')}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to score ATS');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateBullets = async () => {
    if (!jobDesc.trim()) {
      setError('Please enter a job description');
      return;
    }
    if (creditsAvailable < 150) {
      setError('Insufficient AI credits (needs 150)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await aiApi.generateBulletPoints(jobDesc, 5);
      setResult(response.bullet_points);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate bullets');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(result);
    }
  };

  return (
    <>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition"
        >
          ✨ AI Enhancement
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
            {creditsAvailable} credits
          </span>
        </button>
      </div>

      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">AI Resume Enhancement</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Use AI to improve, tailor, and optimize your resume. Credits: {creditsAvailable}
                </p>
              </div>
              <button
                onClick={() => setShowDialog(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Tabs */}
              <div className="flex gap-2 border-b">
                {['improve', 'tailor', 'ats', 'bullets'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab as any);
                      setResult('');
                      setError('');
                    }}
                    className={`px-4 py-2 capitalize transition ${
                      activeTab === tab
                        ? 'border-b-2 border-blue-500 text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab === 'ats' ? 'ATS Score' : tab}
                  </button>
                ))}
              </div>

              {/* Content */}
              {activeTab === 'improve' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Enhance your resume content to be more impactful and professional.
                  </p>
                  <button
                    onClick={handleImprove}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Improve Content (100 credits)
                  </button>
                </div>
              )}

              {activeTab === 'tailor' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Tailor your resume to match a specific job description.
                  </p>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDesc(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleTailor}
                    disabled={loading || !jobDesc.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Tailor Resume (200 credits)
                  </button>
                </div>
              )}

              {activeTab === 'ats' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Score your resume for ATS (Applicant Tracking System) compatibility.
                  </p>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDesc(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleScoreATS}
                    disabled={loading || !jobDesc.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Score ATS (150 credits)
                  </button>
                  {atsScore && (
                    <div className="p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="font-bold text-lg">
                        ATS Score: <span className="text-blue-600">{atsScore.score}/100</span>
                      </p>
                      <p className="text-sm text-gray-700 mt-2">{atsScore.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'bullets' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Generate impactful bullet points based on a job description.
                  </p>
                  <textarea
                    placeholder="Paste the job description here..."
                    value={jobDesc}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobDesc(e.target.value)}
                    className="w-full h-32 p-3 border border-gray-300 rounded"
                  />
                  <button
                    onClick={handleGenerateBullets}
                    disabled={loading || !jobDesc.trim()}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Generate Bullets (150 credits)
                  </button>
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="space-y-3 p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm">AI Generated Content:</p>
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-100 transition"
                    >
                      {copied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    value={result}
                    readOnly
                    className="w-full h-32 p-3 bg-white border border-gray-300 rounded"
                  />
                  {onApply && (
                    <button
                      onClick={handleApply}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                      Apply to Resume
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
