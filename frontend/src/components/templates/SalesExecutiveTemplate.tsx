import React from 'react';
import { TemplateProps } from './types';

const SalesExecutiveTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  return (
    <div className="w-full bg-white p-10" style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#000000' }}>
      {/* Header */}
      <div className="pb-4 mb-6 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold mb-1">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-base font-semibold mb-2">{profile.personalInfo.title}</p>
        )}
        <div className="text-sm space-y-1">
          {profile.contact?.email && <div>Email: {profile.contact.email}</div>}
          {profile.contact?.phone && <div>Phone: {profile.contact.phone}</div>}
          {profile.contact?.linkedin && <div>LinkedIn: {profile.contact.linkedin}</div>}
          {profile.contact?.address && (
            <div>
              Location: {typeof profile.contact.address === 'string'
                ? profile.contact.address
                : `${profile.contact.address?.city}, ${profile.contact.address?.country}`}
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Key Achievements */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            KEY ACHIEVEMENTS
          </h2>
          {profile.achievements.map((achievement: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">
              ✓ {typeof achievement === 'string' ? achievement : achievement.description || ''}
            </p>
          ))}
        </div>
      )}

      {/* Core Competencies */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            CORE COMPETENCIES
          </h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' • ')}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold">{exp.title}</h3>
                <span className="text-sm whitespace-nowrap ml-4">
                  {exp.startDate && typeof exp.startDate === 'string'
                    ? exp.startDate.slice(0, 4)
                    : exp.startDate instanceof Date
                    ? exp.startDate.getFullYear()
                    : ''}
                  {' - '}
                  {exp.endDate && typeof exp.endDate === 'string'
                    ? exp.endDate.slice(0, 4)
                    : exp.endDate instanceof Date
                    ? exp.endDate.getFullYear()
                    : 'Present'}
                </span>
              </div>
              <p className="text-sm font-semibold mb-2">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            EDUCATION
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold">{edu.degree}</h3>
                <span className="text-sm whitespace-nowrap ml-4">
                  {edu.startDate && typeof edu.startDate === 'string'
                    ? edu.startDate.slice(0, 4)
                    : edu.startDate instanceof Date
                    ? edu.startDate.getFullYear()
                    : ''}
                </span>
              </div>
              <p className="text-sm">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            CERTIFICATIONS
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">
              • {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
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

export default SalesExecutiveTemplate;
