import React from 'react';
import { TemplateProps } from './types';

const ExecutiveTemplate: React.FC<TemplateProps> = ({ profile }) => {
  return (
    <div className="w-full bg-white" style={{ fontFamily: 'Garamond, Georgia, serif', color: '#1a1a1a' }}>
      {/* Letterhead Style Header */}
      <div className="p-16 text-center border-b-2 border-gray-300">
        <h1 className="text-3xl font-light tracking-wide mb-2">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        <p className="text-lg font-light" style={{ color: '#666' }}>
          {profile.personalInfo?.title}
        </p>
        <div className="flex justify-center gap-8 mt-4 text-sm">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.linkedin && <span>{profile.contact.linkedin}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-16">
        {/* Executive Summary */}
        {profile.summary && (
          <div className="mb-12">
            <h2 className="text-sm uppercase tracking-widest font-semibold mb-4 text-gray-700">
              Executive Summary
            </h2>
            <p className="text-sm leading-relaxed text-gray-800 max-w-3xl">{profile.summary}</p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-3 gap-12">
          {/* Main Column */}
          <div className="col-span-2">
            {/* Professional Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="mb-12">
                <h2 className="text-sm uppercase tracking-widest font-semibold mb-6 text-gray-700">
                  Professional Experience
                </h2>
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="mb-8">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-semibold">{exp.title}</h3>
                      <span className="text-xs text-gray-500">
                        {exp.startDate && typeof exp.startDate === 'string'
                          ? exp.startDate.slice(0, 4)
                          : exp.startDate instanceof Date
                          ? exp.startDate.getFullYear()
                          : ''}
                        –
                        {exp.endDate && typeof exp.endDate === 'string'
                          ? exp.endDate.slice(0, 4)
                          : exp.endDate instanceof Date
                          ? exp.endDate.getFullYear()
                          : 'Present'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{exp.company}</p>
                    <p className="text-sm text-gray-800">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div>
                <h2 className="text-sm uppercase tracking-widest font-semibold mb-6 text-gray-700">
                  Education
                </h2>
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-sm font-semibold">{edu.degree}</h3>
                    <p className="text-xs text-gray-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Core Competencies */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-gray-700">
                  Core Competencies
                </h3>
                <div className="space-y-2">
                  {profile.skills.slice(0, 10).map((skill: any, idx: number) => (
                    <p key={idx} className="text-xs text-gray-800">• {typeof skill === 'string' ? skill : skill.name || ''}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {profile.certifications && profile.certifications.length > 0 && (
              <div className="mb-12">
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-gray-700">
                  Certifications
                </h3>
                <div className="space-y-2">
                  {profile.certifications.map((cert: any, idx: number) => (
                    <p key={idx} className="text-xs text-gray-800">{typeof cert === 'string' ? cert : cert.name || ''}</p>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div>
                <h3 className="text-xs uppercase tracking-widest font-semibold mb-4 text-gray-700">
                  Languages
                </h3>
                <div className="space-y-2">
                  {profile.languages.map((lang: any, idx: number) => (
                    <p key={idx} className="text-xs text-gray-800">{typeof lang === 'string' ? lang : lang.name || ''}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveTemplate;
