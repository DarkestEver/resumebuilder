import React from 'react';
import { TemplateProps } from './types';

const ModernTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#2563eb';
  const textColor = '#000000';

  return (
    <div className="w-full bg-white p-8 font-sans" style={{ color: textColor }}>
      {/* Header - ATS Optimized */}
      <div className="pb-4 mb-6 border-b-2 border-gray-800">
        <h1 className="text-3xl font-bold mb-1" style={{ color: textColor }}>
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-base mb-2">{profile.personalInfo.title}</p>
        )}
        <div className="text-sm space-y-1">
          {profile.contact?.email && <div>Email: {profile.contact.email}</div>}
          {profile.contact?.phone && <div>Phone: {profile.contact.phone}</div>}
          {profile.contact?.address && (
            <div>
              Location: {typeof profile.contact.address === 'string'
                ? profile.contact.address
                : `${profile.contact.address?.city}, ${profile.contact.address?.country}`}
            </div>
          )}
          {profile.contact?.linkedin && <div>LinkedIn: {profile.contact.linkedin}</div>}
        </div>
      </div>

      {/* Professional Summary - ATS Optimized */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Skills - ATS Optimized (Single Column, Simple List) */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            SKILLS
          </h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' • ')}
          </p>
        </div>
      )}

      {/* Experience - ATS Optimized */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-base">{exp.title}</p>
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  {exp.startDate && typeof exp.startDate === 'string'
                    ? exp.startDate.slice(0, 7)
                    : exp.startDate instanceof Date
                    ? exp.startDate.toISOString().slice(0, 7)
                    : ''}{' '}
                  - {' '}
                  {exp.endDate && typeof exp.endDate === 'string'
                    ? exp.endDate.slice(0, 7)
                    : exp.endDate instanceof Date
                    ? exp.endDate.toISOString().slice(0, 7)
                    : 'Present'}
                </span>
              </div>
              <p className="font-semibold text-sm mb-1">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education - ATS Optimized */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            EDUCATION
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-bold text-sm">{edu.degree}</p>
                  <p className="text-sm">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-700 whitespace-nowrap ml-4">
                  {edu.startDate && typeof edu.startDate === 'string'
                    ? edu.startDate.slice(0, 4)
                    : edu.startDate instanceof Date
                    ? edu.startDate.getFullYear()
                    : ''}{' '}
                  {edu.endDate && (
                    <>
                      - {' '}
                      {typeof edu.endDate === 'string'
                        ? edu.endDate.slice(0, 4)
                        : edu.endDate instanceof Date
                        ? edu.endDate.getFullYear()
                        : ''}
                    </>
                  )}
                </span>
              </div>
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects - ATS Optimized */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            PROJECTS
          </h2>
          {profile.projects.map((project: any, idx: number) => (
            <div key={idx} className="mb-3">
              <p className="font-bold text-sm">{project.name}</p>
              <p className="text-sm leading-relaxed">{project.description}</p>
              {project.link && <p className="text-sm">Link: {project.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications - ATS Optimized */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            CERTIFICATIONS
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <div key={idx} className="mb-2">
              <p className="text-sm">
                {typeof cert === 'string' ? cert : cert.name || ''}
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.date && ` (${cert.date})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Languages - ATS Optimized */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2 border-b border-gray-800" style={{ color: textColor }}>
            LANGUAGES
          </h2>
          <p className="text-sm">
            {profile.languages.map((lang: any) => 
              typeof lang === 'string' ? lang : `${lang.name || ''} (${lang.proficiency || ''})`
            ).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
