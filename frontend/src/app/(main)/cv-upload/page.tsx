/**
 * CV Parsing / Upload Page
 */

'use client';

import React from 'react';
import CVUpload from '@/components/CVUpload';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function CVParsingPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">Upload Your Resume</h1>
            <p className="text-lg text-gray-600">
              Upload your PDF resume to create or update your profile or resume. Our intelligent parsing system 
              will extract your information automatically.
            </p>
          </div>

          {/* Upload Component */}
          <CVUpload />

          {/* Steps */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Your PDF</h3>
                <p className="text-gray-600 text-sm">
                  Choose your PDF resume from your computer or drag and drop it. Only PDF format is supported.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Extraction</h3>
                <p className="text-gray-600 text-sm">
                  Our advanced AI and OCR technology extract information from your CV including contact details, experience, and skills.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-lg font-semibold mb-2">Auto-Populate</h3>
                <p className="text-gray-600 text-sm">
                  Your profile is automatically filled with extracted data. Review and edit any information as needed.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mt-16 bg-white p-8 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">What file formats are supported?</h3>
                <p className="text-gray-700">
                  We support PDF files only. The maximum file size is 10MB. This ensures the best extraction accuracy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How accurate is the CV parsing?</h3>
                <p className="text-gray-700">
                  Our AI-powered extraction achieves 85-95% accuracy depending on the quality and formatting of your CV. 
                  Always review the extracted information to ensure accuracy.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What's the difference between Profile and Resume?</h3>
                <p className="text-gray-700">
                  A <strong>Profile</strong> is your master data store - all your information in one place. 
                  A <strong>Resume</strong> is a specific document generated from a profile. You can create multiple 
                  resumes from one profile, each tailored for different jobs.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Can I edit the extracted information?</h3>
                <p className="text-gray-700">
                  Yes! After uploading, you can edit any extracted information in your profile or resume. You maintain complete control over your data.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Is my data secure?</h3>
                <p className="text-gray-700">
                  Your CV is encrypted during transmission and processing. After parsing, the original file is deleted from our servers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Can I upload multiple CVs?</h3>
                <p className="text-gray-700">
                  Yes, you can upload and parse multiple CVs. Each upload will merge new information with your existing profile.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
