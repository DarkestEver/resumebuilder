/**
 * Resume Optimization Page - Advanced analytics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function OptimizationPage() {
  const params = useParams();
  const resumeId = (params?.resumeId as string) || '';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Resume Optimizer</h1>
            <p className="text-gray-600 text-lg">
              Get ATS scores, job matching analysis, and AI-powered recommendations to improve your resume
            </p>
          </div>

          {/* Main Content */}
          {resumeId ? (
            <ResumeAnalyzer resumeId={resumeId} />
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">Select a resume to begin optimization</p>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🎯 Why ATS Score Matters</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ 99% of large companies use ATS systems to screen resumes</li>
                <li>✓ Poorly formatted resumes get rejected automatically</li>
                <li>✓ Your content needs to match what ATS systems expect</li>
                <li>✓ Higher scores = More interviews</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🚀 Job Matching Benefits</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li>✓ See what keywords you're missing from job descriptions</li>
                <li>✓ Understand how closely your resume matches the role</li>
                <li>✓ Get specific keywords to incorporate</li>
                <li>✓ Tailor your resume for each application</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
