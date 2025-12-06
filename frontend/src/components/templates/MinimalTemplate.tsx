import React from 'react';
import { TemplateProps } from './types';

const MinimalTemplate: React.FC<TemplateProps> = ({ profile }) => {
  return (
    <div className="w-full bg-white p-12" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#000' }}>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light mb-1">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        <p className="text-xs uppercase tracking-widest text-gray-600 mb-4">
          {profile.personalInfo?.title || 'Professional'}
        </p>
        <div className="flex gap-4 text-xs text-gray-600">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
        </div>
      </div>

      {/* Summary */}
      {profile.summary && (
        <div className="mb-8 pb-8 border-b border-gray-300">
          <p className="text-sm leading-relaxed text-gray-800">{profile.summary}</p>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-8 pb-8 border-b border-gray-300">
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Experience</h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{exp.title}</span>
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
              <p className="text-xs text-gray-600">{exp.company}</p>
              <p className="text-xs mt-2 text-gray-700">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-8 pb-8 border-b border-gray-300">
          <h2 className="text-xs uppercase tracking-widest font-semibold mb-4">Education</h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{edu.degree}</span>
                <span className="text-xs text-gray-500">
                  {edu.startDate && typeof edu.startDate === 'string'
                    ? edu.startDate.slice(0, 4)
                    : edu.startDate instanceof Date
                    ? edu.startDate.getFullYear()
                    : ''}
                </span>
              </div>
              <p className="text-xs text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills & Languages */}
      <div className="grid grid-cols-2 gap-8">
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold mb-3">Skills</h2>
            <div className="space-y-2">
              {profile.skills.map((skill: any, idx: number) => (
                <p key={idx} className="text-xs">{typeof skill === 'string' ? skill : skill.name || ''}</p>
              ))}
            </div>
          </div>
        )}

        {profile.languages && profile.languages.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest font-semibold mb-3">Languages</h2>
            <div className="space-y-2">
              {profile.languages.map((lang: any, idx: number) => (
                <p key={idx} className="text-xs">{typeof lang === 'string' ? lang : lang.name || ''}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MinimalTemplate;
