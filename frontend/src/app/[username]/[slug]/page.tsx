'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api/auth';
import TemplateRenderer from '@/components/resume/TemplateRenderer';

interface PublicResumeData {
  resume: {
    _id: string;
    name: string;
    slug: string;
    shortId: string;
    templateId: string;
    customizations: any;
    data: any;
    visibility: string;
    createdAt: string;
  };
  profile: any;
}

export default function PublicResumeSlugPage() {
  const params = useParams();
  const username = params.username as string;
  const slug = params.slug as string;
  const [data, setData] = useState<PublicResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/public/profile/${username}/${slug}`);
        setData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Resume not found');
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [username, slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg font-medium mb-2">{error || 'Resume not found'}</p>
        </div>
      </div>
    );
  }

  const { resume, profile } = data;

  // Merge resume data with profile
  const displayData = {
    ...profile,
    ...resume.data,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Resume Display - Same as builder */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <TemplateRenderer
            templateId={resume.templateId}
            profile={displayData}
            customizations={resume.customizations}
          />
        </div>
      </div>
    </div>
  );
}
