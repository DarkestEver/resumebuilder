/**
 * Resume Analyzer Component - ATS score and optimization
 */

'use client';

import React, { useState, useEffect } from 'react';
import apiClient from '@/lib/api/auth';

interface AtsData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

interface JobMatchData {
  found: string[];
  missing: string[];
  matchPercentage: number;
}

interface ResumeAnalyzerProps {
  resumeId: string;
}

export default function ResumeAnalyzer({ resumeId }: ResumeAnalyzerProps) {
  const [atsScore, setAtsScore] = useState<AtsData | null>(null);
  const [jobMatch, setJobMatch] = useState<JobMatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  useEffect(() => {
    loadAtsScore();
  }, [resumeId]);

  const loadAtsScore = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/advanced/${resumeId}/ats-score`);
      setAtsScore(response.data.data);
    } catch (error) {
      console.error('Failed to load ATS score:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeJob = async () => {
    if (!jobDescription.trim()) return;

    try {
      setAnalyzeLoading(true);
      const response = await apiClient.post(`/advanced/${resumeId}/match-job`, {
        jobDescription,
      });
      setJobMatch(response.data.data);
    } catch (error) {
      console.error('Failed to analyze job:', error);
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-gray-200 h-40 rounded-lg"></div>
        <div className="bg-gray-200 h-40 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ATS Score Card */}
      {atsScore && (
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">ATS Compatibility Score</h2>

          <div className="flex items-center gap-8 mb-8">
            <div className="flex-shrink-0">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={atsScore.score >= 80 ? '#10b981' : atsScore.score >= 60 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeDasharray={`${(atsScore.score / 100) * 282.6} 282.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(atsScore.score)}`}>{atsScore.score}</span>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-gray-600 mb-4">Your resume is optimized for Applicant Tracking Systems</p>

              {atsScore.score >= 80 && <p className="text-green-600 font-semibold">✓ Excellent ATS compatibility</p>}
              {atsScore.score >= 60 && atsScore.score < 80 && (
                <p className="text-yellow-600 font-semibold">○ Good ATS compatibility, room for improvement</p>
              )}
              {atsScore.score < 60 && <p className="text-red-600 font-semibold">✗ Needs improvement for better ATS compatibility</p>}
            </div>
          </div>

          {/* Strengths */}
          {atsScore.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Strengths</h3>
              <div className="space-y-2">
                {atsScore.strengths.map((strength, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-green-600">
                    <span>✓</span>
                    <span>{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses */}
          {atsScore.weaknesses.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Areas for Improvement</h3>
              <div className="space-y-2">
                {atsScore.weaknesses.map((weakness, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-red-600">
                    <span>✗</span>
                    <span>{weakness}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {atsScore.suggestions.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Recommendations</h3>
              <div className="space-y-2 text-sm">
                {atsScore.suggestions.map((suggestion, idx) => (
                  <p key={idx} className="text-blue-600">
                    💡 {suggestion}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Job Description Analyzer */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Match Your Resume to a Job</h2>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-2">Paste Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here to see how well your resume matches..."
            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleAnalyzeJob}
          disabled={!jobDescription.trim() || analyzeLoading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-semibold"
        >
          {analyzeLoading ? 'Analyzing...' : 'Analyze Match'}
        </button>

        {jobMatch && (
          <div className="mt-8 space-y-6">
            {/* Match Score */}
            <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Job Match Score</h3>
                <span className="text-3xl font-bold text-blue-600">{jobMatch.matchPercentage}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${jobMatch.matchPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Found Keywords */}
            {jobMatch.found.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Matching Keywords ({jobMatch.found.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobMatch.found.slice(0, 10).map((keyword, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Missing Keywords */}
            {jobMatch.missing.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Missing Keywords ({jobMatch.missing.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {jobMatch.missing.slice(0, 10).map((keyword, idx) => (
                    <span key={idx} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
                {jobMatch.missing.length > 10 && (
                  <p className="text-sm text-gray-600 mt-2">And {jobMatch.missing.length - 10} more keywords</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
