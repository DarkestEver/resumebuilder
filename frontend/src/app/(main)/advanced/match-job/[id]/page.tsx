/**
 * Job Matcher Page
 * Input job description → AI matches resume and shows gaps
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { authStore } from '@/stores/authStore';
import axios from 'axios';
import { ArrowLeft, Target, CheckCircle, XCircle, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface MatchResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendations: string[];
}

export default function JobMatcherPage() {
  const params = useParams();
  const resumeId = params.id as string;
  
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description');
      return;
    }

    setLoading(true);
    try {
      const token = authStore.getState().accessToken;
      const res = await axios.post(
        `${API_BASE_URL}/advanced/${resumeId}/match-job`,
        { jobDescription },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          withCredentials: true,
        }
      );
      setResult(res.data.data);
      toast.success('Match analysis complete!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to analyze match');
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMatchBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 border-green-200';
    if (percentage >= 60) return 'bg-yellow-50 border-yellow-200';
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
              <Target className="w-8 h-8 text-blue-600" />
              Job Matcher
            </h1>
            <p className="text-gray-600 mt-1">See how well your resume matches a specific job</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {/* Input Section */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Job Description</h3>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here (responsibilities, requirements, qualifications)..."
                className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleMatch}
                  disabled={loading || !jobDescription.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Match
                    </>
                  )}
                </button>
                {result && (
                  <button
                    onClick={() => {
                      setResult(null);
                      setJobDescription('');
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    Start Over
                  </button>
                )}
              </div>
            </div>

            {/* Results Section */}
            {result && (
              <div className="space-y-6">
                {/* Match Score */}
                <div className={`p-8 border-2 rounded-lg ${getMatchBg(result.matchPercentage)}`}>
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${getMatchColor(result.matchPercentage)}`}>
                      {result.matchPercentage}%
                    </div>
                    <p className="text-lg font-semibold text-gray-700">Match Score</p>
                    <p className="text-sm text-gray-600 mt-2">
                      {result.matchPercentage >= 80 && 'Excellent match! You\'re a strong candidate for this role.'}
                      {result.matchPercentage >= 60 && result.matchPercentage < 80 && 'Good match with some areas to improve.'}
                      {result.matchPercentage < 60 && 'Consider adding relevant skills and experience.'}
                    </p>
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Matched Skills */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Matched Skills ({result.matchedSkills?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.matchedSkills?.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-red-600" />
                      Skills to Add ({result.missingSkills?.length || 0})
                    </h3>
                    <div className="space-y-2">
                      {result.missingSkills?.map((skill, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                          <span className="text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      How to Improve Your Match
                    </h3>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <p className="text-gray-700">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                  <Link
                    href={`/resume/${resumeId}`}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                  >
                    Update Resume
                  </Link>
                  <Link
                    href={`/advanced/ats-analysis/${resumeId}`}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold"
                  >
                    View ATS Analysis
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
