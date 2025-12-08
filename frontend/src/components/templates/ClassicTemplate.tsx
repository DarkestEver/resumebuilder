import React from 'react';
import { TemplateProps } from './types';

const ClassicTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const fontFamily = customizations?.font?.family || 'Georgia, serif';

  return (
    <div className="w-full bg-white p-10" style={{ fontFamily, color: '#000000' }}>
      {/* Header - ATS Optimized */}
      <div className="pb-4 mb-6 border-b-2 border-black">
        <h1 className="text-3xl font-bold mb-1">
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
        </div>
      </div>

      {/* Summary - ATS Optimized */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Skills - ATS Optimized */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-2">SKILLS</h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' • ')}
          </p>
        </div>
      )}

      {/* Experience - ATS Optimized */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase border-b border-black pb-1 mb-2">
            PROFESSIONAL EXPERIENCE
          </h2>
          {profile.experience.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-sm">{exp.title}</p>
                <span className="text-sm whitespace-nowrap ml-4">
                  {exp.startDate && typeof exp.startDate === 'string'
                    ? exp.startDate.slice(0, 4)
                    : exp.startDate instanceof Date
                    ? exp.startDate.getFullYear()
                    : ''}{' '}
                  - {' '}
                  {exp.endDate && typeof exp.endDate === 'string'
                    ? exp.endDate.slice(0, 4)
                    : exp.endDate instanceof Date
                    ? exp.endDate.getFullYear()
                    : 'Present'}
                </span>
              </div>
              <p className="text-sm font-semibold">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-1 mb-3">
            Education
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between">
                <p className="font-bold text-sm">{edu.degree}</p>
                <span className="text-xs">
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
              <p className="text-sm">{edu.institution}</p>
              {edu.gpa && <p className="text-xs">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-1 mb-3">
            Skills
          </h2>
          <p className="text-sm">
            {profile.skills.map((s: any) => typeof s === 'string' ? s : (s.name || '')).filter(Boolean).join(', ')}
          </p>
        </div>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-1 mb-3">
            Certifications
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <p key={idx} className="text-sm">
              {typeof cert === 'string' ? cert : `${cert.name || ''} - ${cert.issuer || ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide border-b border-black pb-1 mb-3">
            Languages
          </h2>
          {profile.languages.map((lang: any, idx: number) => (
            <p key={idx} className="text-sm">
              {typeof lang === 'string' ? lang : `${lang.name || ''} - ${lang.proficiency || ''}`}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
