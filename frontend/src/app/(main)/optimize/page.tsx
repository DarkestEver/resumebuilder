/**
 * Resume Optimization Page - PDF Upload & ATS Scoring
 */

'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import apiClient from '@/lib/api/auth';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, Target, Zap } from 'lucide-react';

interface ATSScore {
  overallScore: number;
  formatScore: number;
  contentScore: number;
  keywordScore: number;
  structureScore: number;
  sections: {
    name: string;
    score: number;
    feedback: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  keywords: {
    found: string[];
    missing: string[];
  };
}

export default function OptimizationPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [score, setScore] = useState<ATSScore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      const response = await apiClient.post('/ai/score-resume-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setScore(response.data.data);
      setAnalyzing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to analyze resume');
    } finally {
      setUploading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ATS Resume Optimizer
              </span>
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              Upload your resume PDF and get instant ATS compatibility score with actionable recommendations
            </p>
          </div>

          {!score ? (
            <>
              {/* Upload Section */}
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div
                  className={`relative border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-blue-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    id="pdf-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileChange}
                  />

                  <div className="flex flex-col items-center gap-4">
                    <div className="p-6 bg-blue-100 rounded-full">
                      {selectedFile ? (
                        <FileText className="w-12 h-12 text-blue-600" />
                      ) : (
                        <Upload className="w-12 h-12 text-blue-600" />
                      )}
                    </div>

                    {selectedFile ? (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900">{selectedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          onClick={handleUploadAndAnalyze}
                          disabled={uploading}
                          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {uploading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5" />
                              Analyze Resume
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-sm text-gray-500 hover:text-gray-700"
                        >
                          Choose different file
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="text-center">
                          <p className="text-lg font-semibold text-gray-900 mb-2">
                            Drop your resume PDF here
                          </p>
                          <p className="text-sm text-gray-500 mb-4">or</p>
                          <label
                            htmlFor="pdf-upload"
                            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 cursor-pointer inline-block transition-all"
                          >
                            Browse Files
                          </label>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Supports PDF files up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
              </div>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">ATS Compatibility</h3>
                  <p className="text-gray-600 text-sm">
                    Get scored on formatting, keywords, structure, and content quality
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Feedback</h3>
                  <p className="text-gray-600 text-sm">
                    Receive detailed analysis with strengths, weaknesses, and recommendations
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Improve Your Score</h3>
                  <p className="text-gray-600 text-sm">
                    Follow actionable tips to optimize your resume for better results
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* Results Section */
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">ATS Compatibility Score</h2>
                  <button
                    onClick={() => {
                      setScore(null);
                      setSelectedFile(null);
                    }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Analyze Another Resume
                  </button>
                </div>

                <div className="flex items-center gap-8">
                  {/* Circular Score */}
                  <div className="relative w-40 h-40">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          score.overallScore >= 80 ? '#10b981' :
                          score.overallScore >= 60 ? '#f59e0b' : '#ef4444'
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(score.overallScore / 100) * 282.6} 282.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-4xl font-bold ${getScoreColor(score.overallScore)}`}>
                        {score.overallScore}
                      </span>
                      <span className="text-sm text-gray-500">/ 100</span>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Format</span>
                        <span className={`font-semibold ${getScoreColor(score.formatScore)}`}>
                          {score.formatScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBg(score.formatScore)}`}
                          style={{ width: `${score.formatScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Content</span>
                        <span className={`font-semibold ${getScoreColor(score.contentScore)}`}>
                          {score.contentScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBg(score.contentScore)}`}
                          style={{ width: `${score.contentScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Keywords</span>
                        <span className={`font-semibold ${getScoreColor(score.keywordScore)}`}>
                          {score.keywordScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBg(score.keywordScore)}`}
                          style={{ width: `${score.keywordScore}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Structure</span>
                        <span className={`font-semibold ${getScoreColor(score.structureScore)}`}>
                          {score.structureScore}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getScoreBg(score.structureScore)}`}
                          style={{ width: `${score.structureScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-green-600 mt-1">✓</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-bold text-gray-900">Areas to Improve</h3>
                  </div>
                  <ul className="space-y-2">
                    {score.weaknesses.map((weakness, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-red-600 mt-1">✗</span>
                        <span>{weakness}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-bold text-gray-900">Recommendations</h3>
                </div>
                <div className="space-y-3">
                  {score.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </span>
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              {score.keywords && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Keyword Analysis</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">Found Keywords ({score.keywords.found.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {score.keywords.found.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3">Missing Keywords ({score.keywords.missing.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {score.keywords.missing.map((keyword, idx) => (
                          <span key={idx} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
