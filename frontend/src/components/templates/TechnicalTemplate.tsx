import React from 'react';
import { TemplateProps } from './types';

const TechnicalTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#0066cc';

  return (
    <div className="w-full bg-white p-10 font-mono text-sm" style={{ color: '#333' }}>
      {/* Header */}
      <div className="mb-8 pb-4 border-b-2" style={{ borderColor: primaryColor }}>
        <h1 className="text-2xl font-bold" style={{ color: primaryColor }}>
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        <p className="text-sm mt-2" style={{ color: '#666' }}>
          {profile.personalInfo?.title || 'Software Engineer'}
        </p>
        <div className="flex gap-4 mt-3 text-xs">
          {profile.contact?.email && <span>📧 {profile.contact.email}</span>}
          {profile.contact?.phone && <span>📞 {profile.contact.phone}</span>}
          {profile.contact?.github && <span>💻 {profile.contact.github}</span>}
        </div>
      </div>

      {/* Overview */}
      {profile.summary && (
        <div className="mb-8">
          <h2 className="font-bold mb-2 pb-1 border-b" style={{ borderColor: primaryColor }}>
            » OVERVIEW
          </h2>
          <p className="text-xs leading-relaxed">{profile.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="col-span-2">
          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » EXPERIENCE
              </h2>
              {profile.experience.map((exp: any, idx: number) => (
                <div key={idx} className="mb-5 pb-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-xs" style={{ color: primaryColor }}>
                        {exp.title.toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-700">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {exp.startDate && typeof exp.startDate === 'string'
                        ? exp.startDate.slice(0, 4)
                        : exp.startDate instanceof Date
                        ? exp.startDate.getFullYear()
                        : ''}
                    </span>
                  </div>
                  <p className="text-xs mt-2 text-gray-800">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="mb-8">
              <h2 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » EDUCATION
              </h2>
              {profile.education.map((edu: any, idx: number) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold text-xs" style={{ color: primaryColor }}>
                    {edu.degree.toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-700">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div>
              <h2 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » PROJECTS
              </h2>
              {profile.projects.map((proj: any, idx: number) => (
                <div key={idx} className="mb-4 pb-4 border-b border-gray-200">
                  <p className="font-semibold text-xs" style={{ color: primaryColor }}>
                    {proj.name.toUpperCase()}
                  </p>
                  <p className="text-xs mt-1 text-gray-800">{proj.description}</p>
                  {proj.technologies && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-600">tech: </span>
                      <span className="text-xs text-gray-800">{proj.technologies.join(' • ')}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » SKILLS
              </h3>
              <div className="space-y-1">
                {profile.skills.map((skill: any, idx: number) => (
                  <p key={idx} className="text-xs">
                    <span style={{ color: primaryColor }}>→</span> {typeof skill === 'string' ? skill : skill.name || ''}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » LANGUAGES
              </h3>
              <div className="space-y-1">
                {profile.languages.map((lang: any, idx: number) => (
                  <p key={idx} className="text-xs">
                    <span style={{ color: primaryColor }}>→</span> {typeof lang === 'string' ? lang : lang.name || ''}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div>
              <h3 className="font-bold mb-3 pb-1 border-b" style={{ borderColor: primaryColor }}>
                » CERTS
              </h3>
              <div className="space-y-1">
                {profile.certifications.map((cert: any, idx: number) => (
                  <p key={idx} className="text-xs text-gray-700">{typeof cert === 'string' ? cert : cert.name || ''}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicalTemplate;
