import React from 'react';
import { TemplateProps } from './types';

const ModernTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#2563eb';
  const accentColor = customizations?.colors?.accent || '#1e40af';

  return (
    <div className="w-full bg-white p-8 font-sans" style={{ color: '#1f2937' }}>
      {/* Header */}
      <div className="border-b-4 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        <p className="text-lg" style={{ color: accentColor }}>
          {profile.summary || 'Professional Summary'}
        </p>
        <div className="flex gap-6 mt-4 text-sm">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.address && (
            <span>
              {typeof profile.contact.address === 'string'
                ? profile.contact.address
                : `${profile.contact.address?.city}, ${profile.contact.address?.country}`}
            </span>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="col-span-2">
          {/* Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                EXPERIENCE
              </h2>
              {profile.experience.map((exp: any, idx: number) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-lg">{exp.title}</p>
                      <p style={{ color: accentColor }}>{exp.company}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {exp.startDate && typeof exp.startDate === 'string'
                        ? exp.startDate.slice(0, 7)
                        : exp.startDate instanceof Date
                        ? exp.startDate.toISOString().slice(0, 7)
                        : ''}{' '}
                      -{' '}
                      {exp.endDate && typeof exp.endDate === 'string'
                        ? exp.endDate.slice(0, 7)
                        : exp.endDate instanceof Date
                        ? exp.endDate.toISOString().slice(0, 7)
                        : 'Present'}
                    </span>
                  </div>
                  <p className="text-sm mt-2 text-gray-600">{exp.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {profile.education && profile.education.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                EDUCATION
              </h2>
              {profile.education.map((edu: any, idx: number) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{edu.degree}</p>
                      <p style={{ color: accentColor }}>{edu.institution}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      {edu.startDate && typeof edu.startDate === 'string'
                        ? edu.startDate.slice(0, 4)
                        : edu.startDate instanceof Date
                        ? edu.startDate.getFullYear()
                        : ''}{' '}
                      -{' '}
                      {edu.endDate && typeof edu.endDate === 'string'
                        ? edu.endDate.slice(0, 4)
                        : edu.endDate instanceof Date
                        ? edu.endDate.getFullYear()
                        : ''}
                    </span>
                  </div>
                  {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                PROJECTS
              </h2>
              {profile.projects.map((project, idx) => (
                <div key={idx} className="mb-4">
                  <p className="font-bold">{project.name}</p>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  {project.link && (
                    <p className="text-sm" style={{ color: accentColor }}>
                      {project.link}
                    </p>
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
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                SKILLS
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded text-sm text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    {typeof skill === 'string' ? skill : skill.name || ''}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                CERTIFICATIONS
              </h3>
              {profile.certifications.map((cert: any, idx: number) => (
                <div key={idx} className="mb-3">
                  <p className="font-semibold text-sm">{typeof cert === 'string' ? cert : cert.name || ''}</p>
                  <p className="text-xs text-gray-500">{cert.issuer}</p>
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3 pb-2 border-b-2" style={{ borderColor: primaryColor, color: primaryColor }}>
                LANGUAGES
              </h3>
              {profile.languages.map((lang: any, idx: number) => (
                <p key={idx} className="text-sm mb-2">
                  {typeof lang === 'string' ? lang : `${lang.name || ''} - ${lang.proficiency || ''}`}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
