import React from 'react';
import { TemplateProps } from './types';

const OnePageCompactTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  return (
    <div className="w-full bg-white p-6" style={{ fontFamily: 'Arial, sans-serif', color: '#000000', fontSize: '11px' }}>
      {/* Header - Compact */}
      <div className="pb-2 mb-3 border-b-2 border-gray-900">
        <h1 className="text-xl font-bold mb-0.5">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-xs mb-1 font-semibold">{profile.personalInfo.title}</p>
        )}
        <div className="text-xs">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span className="mx-1">|</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.address && (
            <>
              <span className="mx-1">|</span>
              <span>
                {typeof profile.contact.address === 'string'
                  ? profile.contact.address
                  : `${profile.contact.address?.city}, ${profile.contact.address?.state}`}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Professional Summary - Compact */}
      {profile.summary && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            SUMMARY
          </h2>
          <p className="text-xs leading-tight">{profile.summary}</p>
        </div>
      )}

      {/* Skills - Compact */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            SKILLS
          </h2>
          <p className="text-xs leading-tight">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' • ')}
          </p>
        </div>
      )}

      {/* Professional Experience - Compact */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            EXPERIENCE
          </h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-2">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold">{exp.title}</h3>
                <span className="text-xs whitespace-nowrap ml-2">
                  {exp.startDate && typeof exp.startDate === 'string'
                    ? exp.startDate.slice(0, 4)
                    : exp.startDate instanceof Date
                    ? exp.startDate.getFullYear()
                    : ''}
                  -
                  {exp.endDate && typeof exp.endDate === 'string'
                    ? exp.endDate.slice(0, 4)
                    : exp.endDate instanceof Date
                    ? exp.endDate.getFullYear()
                    : 'Now'}
                </span>
              </div>
              <p className="text-xs font-semibold mb-0.5">{exp.company}</p>
              <p className="text-xs leading-tight">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects - Compact */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            PROJECTS
          </h2>
          {profile.projects.map((proj: any, idx: number) => (
            <p key={idx} className="text-xs mb-1 leading-tight">
              <span className="font-bold">{proj.name}</span>
              {proj.description && <span>. {proj.description}</span>}
            </p>
          ))}
        </div>
      )}

      {/* Education - Compact */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            EDUCATION
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-1">
              <div className="flex justify-between items-start">
                <h3 className="text-xs font-bold">{edu.degree}</h3>
                <span className="text-xs whitespace-nowrap ml-2">
                  {edu.startDate && typeof edu.startDate === 'string'
                    ? edu.startDate.slice(0, 4)
                    : edu.startDate instanceof Date
                    ? edu.startDate.getFullYear()
                    : ''}
                </span>
              </div>
              <p className="text-xs">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {/* Certifications - Compact */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            CERTIFICATIONS
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <p key={idx} className="text-xs mb-0.5 leading-tight">
              • {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Achievements - Compact */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="mb-3">
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            ACHIEVEMENTS
          </h2>
          {profile.achievements.map((achievement: any, idx: number) => (
            <p key={idx} className="text-xs mb-0.5 leading-tight">
              • {typeof achievement === 'string' ? achievement : achievement.description || ''}
            </p>
          ))}
        </div>
      )}

      {/* Languages - Compact */}
      {profile.languages && profile.languages.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase mb-1 border-b border-gray-900 pb-0.5">
            LANGUAGES
          </h2>
          <p className="text-xs leading-tight">
            {profile.languages.map((lang: any) => 
              typeof lang === 'string' ? lang : `${lang.name || ''} (${lang.proficiency || ''})`
            ).join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};

export default OnePageCompactTemplate;
