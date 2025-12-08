'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api/auth';
import { User, Briefcase, Mail, MapPin, ExternalLink, Eye, Download } from 'lucide-react';

interface PublicProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    username: string;
    profilePhoto?: string;
    createdAt: string;
  };
  profile: any;
  resumes: Array<{
    id: string;
    name: string;
    slug?: string;
    shortId: string;
    templateId: string;
    viewCount: number;
    downloadCount: number;
    createdAt: string;
  }>;
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const [data, setData] = useState<PublicProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/public/profile/${username}`);
        setData(response.data.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-medium mb-2">{error}</p>
          <Link href="/" className="text-blue-600 hover:underline">Back to home</Link>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {data.user.profilePhoto ? (
                <img src={data.user.profilePhoto} alt={data.user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-3xl font-bold text-white">{data.user.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{data.user.name}</h1>
              <p className="text-lg text-gray-600 mt-1">@{data.user.username}</p>
              
              {data.profile?.personalInfo?.headline && (
                <p className="text-gray-700 mt-3 text-lg font-medium">{data.profile.personalInfo.headline}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600">
                {data.profile?.contact?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{data.profile.contact.email}</span>
                  </div>
                )}
                {data.profile?.contact?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{data.profile.contact.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary */}
        {data.profile?.summary && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{data.profile.summary}</p>
          </div>
        )}

        {/* Video Profile */}
        {data.profile?.videoProfile && data.profile.videoProfile.videoUrl && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎥</span>
              Video Introduction
            </h2>
            <div className="relative w-full max-w-3xl mx-auto">
              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <video
                  src={`http://localhost:5000${data.profile.videoProfile.videoUrl}`}
                  controls
                  className="w-full h-full"
                  controlsList="nodownload"
                  crossOrigin="anonymous"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
              
              {/* Video Stats */}
              <div className="flex items-center gap-6 mt-4 text-sm text-gray-600">
                {data.profile.videoProfile.duration && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Duration:</span>
                    <span>{Math.floor(data.profile.videoProfile.duration / 60)}:{String(data.profile.videoProfile.duration % 60).padStart(2, '0')}</span>
                  </div>
                )}
                {data.profile.videoProfile.views !== undefined && (
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{data.profile.videoProfile.views} views</span>
                  </div>
                )}
                {data.profile.videoProfile.uploadedAt && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Uploaded:</span>
                    <span>{new Date(data.profile.videoProfile.uploadedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Public Resumes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Public Resumes ({data.resumes.length})</h2>
          </div>

          {data.resumes.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No public resumes available</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.resumes.map((resume) => (
                <a
                  key={resume.id}
                  href={`/#/${data.user.username}/${resume.slug || resume.shortId}`}
                  className="group p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                        {resume.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{resume.templateId} template</p>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{resume.viewCount} views</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>{resume.downloadCount} downloads</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
                    Created {new Date(resume.createdAt).toLocaleDateString()}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Skills */}
        {data.profile?.skills && data.profile.skills.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {data.profile.skills.map((skill: any, index: number) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {typeof skill === 'string' ? skill : skill.name || ''}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
