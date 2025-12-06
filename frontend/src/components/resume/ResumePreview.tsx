'use client';

import { useEffect, useState } from 'react';
import { resumeStore } from '@/stores/resumeStore';
import { profileStore } from '@/stores/profileStore';
import TemplateRenderer from './TemplateRenderer';

interface ResumePreviewProps {
  resume: any;
}

export default function ResumePreview({ resume }: ResumePreviewProps) {
  const { exportPDF, isSaving } = resumeStore();
  const { profile, fetchProfile } = profileStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
      setLoading(false);
    };
    loadProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 min-h-[1000px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile data...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-lg shadow p-8 min-h-[1000px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg mb-2">No Profile Data Found</p>
          <p className="text-sm">Please complete your profile first to preview your resume.</p>
          <a href="/profile" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go to Profile Builder
          </a>
        </div>
      </div>
    );
  }

  return (
    <div id="resume-preview" className="bg-white rounded-lg shadow-lg overflow-hidden">
      <TemplateRenderer 
        templateId={resume.templateId || 'modern'} 
        profile={profile}
        customizations={resume.customizations}
      />
    </div>
  );
}
