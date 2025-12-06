'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api/auth';

interface PublicResumeData {
  resume: {
    id: string;
    name: string;
    templateId: string;
    customizations: any;
    viewCount: number;
    downloadCount: number;
  };
  profile: any;
  user: {
    name: string;
    email: string;
    profilePhoto?: string;
  };
}

export default function PublicResumePage() {
  const params = useParams();
  const shortId = params?.shortId as string;
  const [data, setData] = useState<PublicResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!shortId) return;

    const fetchResume = async () => {
      try {
        setLoading(true);
        const queryParams = password ? `?password=${encodeURIComponent(password)}` : '';
        const response = await apiClient.get(`/public/r/${shortId}${queryParams}`);
        setData(response.data.data);
        setPasswordRequired(false);
      } catch (err: any) {
        if (err.response?.data?.passwordRequired) {
          setPasswordRequired(true);
        } else {
          setError(err.response?.data?.message || 'Failed to load resume');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, [shortId, password]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Back to home
          </a>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Password Required</h2>
          <p className="text-gray-600 mb-6">This resume is password protected. Please enter the password to view it.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && password && window.location.reload()}
          />
          <button
            onClick={() => password && window.location.reload()}
            disabled={!password}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            Unlock Resume
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Resume not found</p>
      </div>
    );
  }

  const { resume, profile, user } = data;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          {user.profilePhoto && (
            <img
              src={user.profilePhoto}
              alt={user.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
          )}
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{profile.personalInfo?.firstName} {profile.personalInfo?.lastName}</h1>
          {profile.personalInfo?.title && (
            <p className="text-xl text-blue-600 mb-4">{profile.personalInfo.title}</p>
          )}

          {/* Contact Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
            {profile.contact?.email && (
              <a href={`mailto:${profile.contact.email}`} className="hover:text-blue-600">
                {profile.contact.email}
              </a>
            )}
            {profile.contact?.phone && (
              <a href={`tel:${profile.contact.phone}`} className="hover:text-blue-600">
                {profile.contact.phone}
              </a>
            )}
            {profile.contact?.linkedin && (
              <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                LinkedIn
              </a>
            )}
            {profile.contact?.github && (
              <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                GitHub
              </a>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-gray-600 border-t pt-6">
            <div>
              <p className="font-semibold text-gray-900">{resume.viewCount}</p>
              <p className="text-gray-600">Views</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{resume.downloadCount}</p>
              <p className="text-gray-600">Downloads</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">{resume.templateId}</p>
              <p className="text-gray-600">Template</p>
            </div>
          </div>
        </div>

        {/* Resume Content */}
        <div className="bg-white rounded-lg shadow-lg p-12 space-y-8">
          {/* Summary */}
          {profile.summary && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Professional Summary</h2>
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </section>
          )}

          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Experience</h2>
              <div className="space-y-6">
                {profile.experience.map((job: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company} {job.location && `• ${job.location}`}</p>
                      </div>
                      <p className="text-gray-500 text-sm">
                        {job.startDate} – {job.endDate || 'Present'}
                      </p>
                    </div>
                    {job.description && <p className="text-gray-700 mt-2">{job.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution} {edu.location && `• ${edu.location}`}</p>
                    {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Projects</h2>
              <div className="space-y-6">
                {profile.projects.map((project: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                      {project.link && (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View Project
                        </a>
                      )}
                    </div>
                    {project.description && <p className="text-gray-700 mt-2">{project.description}</p>}
                    {project.technologies && (
                      <p className="text-gray-600 text-sm mt-2">{project.technologies.join(', ')}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">Languages</h2>
              <div className="grid grid-cols-2 gap-4">
                {profile.languages.map((lang: any, idx: number) => (
                  <div key={idx} className="flex justify-between">
                    <span className="text-gray-900 font-medium">{lang.name}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-600">
          <p>Viewed {resume.viewCount} times • Downloaded {resume.downloadCount} times</p>
          <p className="text-sm mt-2">
            Created with ProfileBuilder Resume Generator
          </p>
        </div>
      </div>
    </div>
  );
}
