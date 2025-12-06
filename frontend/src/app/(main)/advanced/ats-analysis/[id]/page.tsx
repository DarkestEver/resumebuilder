/**
 * Advanced ATS Analysis Page
 * Detailed breakdown of ATS score with actionable tips
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authStore } from '@/stores/authStore';
import axios from 'axios';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle, TrendingUp, FileText } from 'lucide-react';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ATSAnalysis {
  score: number;
  keywordsMatched: string[];
  keywordsMissing: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  formatting: {
    score: number;
    issues: string[];
  };
  content: {
    score: number;
    issues: string[];
  };
}

export default function ATSAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;
  
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalysis();
  }, [resumeId]);

  const loadAnalysis = async () => {
    try {
      const token = authStore.getState().accessToken;
      const res = await axios.get(`${API_BASE_URL}/advanced/${resumeId}/ats-score`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      setAnalysis(res.data.data);
    } catch (error) {
      console.error('Failed to load ATS analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Link 
              href="/dashboard"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8" />
              ATS Score Analysis
            </h1>
            <p className="text-gray-600 mt-1">Detailed breakdown and optimization recommendations</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className={`p-8 border-2 rounded-lg ${getScoreBg(analysis.score)}`}>
                <div className="text-center">
                  <div className="text-6xl font-bold ${getScoreColor(analysis.score)} mb-2">
                    {analysis.score}%
                  </div>
                  <p className="text-lg font-semibold text-gray-700">Overall ATS Score</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {analysis.score >= 80 && 'Excellent! Your resume is highly optimized for ATS systems.'}
                    {analysis.score >= 60 && analysis.score < 80 && 'Good, but there\'s room for improvement.'}
                    {analysis.score < 60 && 'Needs significant optimization to pass ATS filters.'}
                  </p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Formatting Score */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Formatting Score
                  </h3>
                  <div className={`text-4xl font-bold mb-4 ${getScoreColor(analysis.formatting?.score || 0)}`}>
                    {analysis.formatting?.score || 0}%
                  </div>
                  {analysis.formatting?.issues && analysis.formatting.issues.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Issues:</p>
                      {analysis.formatting.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Content Score */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Content Score
                  </h3>
                  <div className={`text-4xl font-bold mb-4 ${getScoreColor(analysis.content?.score || 0)}`}>
                    {analysis.content?.score || 0}%
                  </div>
                  {analysis.content?.issues && analysis.content.issues.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-700">Issues:</p>
                      {analysis.content.issues.map((issue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                          {issue}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Keywords Analysis */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Matched Keywords */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Matched Keywords ({analysis.keywordsMatched?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordsMatched?.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missing Keywords */}
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    Missing Keywords ({analysis.keywordsMissing?.length || 0})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywordsMissing?.map((keyword, idx) => (
                      <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Strengths
                  </h3>
                  <div className="space-y-3">
                    {analysis.strengths.map((strength, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{strength}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    Weaknesses
                  </h3>
                  <div className="space-y-3">
                    {analysis.weaknesses.map((weakness, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Suggestions */}
              {analysis.suggestions && analysis.suggestions.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Actionable Recommendations
                  </h3>
                  <div className="space-y-3">
                    {analysis.suggestions.map((suggestion, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {idx + 1}
                        </span>
                        <p className="text-gray-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <Link
                  href={`/resume/${resumeId}`}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Edit Resume
                </Link>
                <button
                  onClick={() => router.push(`/advanced/match-job/${resumeId}`)}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                >
                  Match to Job Description
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Failed to load ATS analysis. Please try again.</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
