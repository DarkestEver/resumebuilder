import React from 'react';
import { TemplateProps } from './types';

const AcademicTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  return (
    <div className="w-full bg-white p-10" style={{ fontFamily: 'Times New Roman, Georgia, serif', color: '#000000' }}>
      {/* Header */}
      <div className="text-center pb-4 mb-6 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold mb-1">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-base mb-2">{profile.personalInfo.title}</p>
        )}
        <div className="text-sm">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span className="mx-2">•</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.address && (
            <>
              <span className="mx-2">•</span>
              <span>
                {typeof profile.contact.address === 'string'
                  ? profile.contact.address
                  : `${profile.contact.address?.city}, ${profile.contact.address?.country}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Research Interests / Summary */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            RESEARCH INTERESTS
          </h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
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
                  {edu.endDate && (
                    <>
                      {' - '}
                      {typeof edu.endDate === 'string'
                        ? edu.endDate.slice(0, 4)
                        : edu.endDate instanceof Date
                        ? edu.endDate.getFullYear()
                        : ''}
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm font-semibold">{edu.institution}</p>
              {edu.field && <p className="text-sm italic">Field: {edu.field}</p>}
              {edu.gpa && <p className="text-sm">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Academic Experience / Teaching */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            ACADEMIC EXPERIENCE
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
              <p className="text-sm font-semibold italic mb-1">{exp.company}</p>
              <p className="text-sm leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Publications */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            PUBLICATIONS & RESEARCH
          </h2>
          {profile.projects.map((proj: any, idx: number) => (
            <div key={idx} className="mb-3">
              <p className="text-sm">
                <span className="font-semibold">{proj.name}</span>
                {proj.description && <span>. {proj.description}</span>}
                {proj.link && <span className="italic"> {proj.link}</span>}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills / Research Methods */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            RESEARCH SKILLS & METHODS
          </h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(', ')}
          </p>
        </div>
      )}

      {/* Awards & Honors */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            AWARDS & HONORS
          </h2>
          {profile.achievements.map((achievement: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">
              • {typeof achievement === 'string' ? achievement : achievement.description || ''}
            </p>
          ))}
        </div>
      )}

      {/* Certifications / Professional Development */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            CERTIFICATIONS & TRAINING
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">
              {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
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

export default AcademicTemplate;
