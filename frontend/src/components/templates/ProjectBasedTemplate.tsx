import React from 'react';
import { TemplateProps } from './types';

const ProjectBasedTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  return (
    <div className="w-full bg-white p-10" style={{ fontFamily: 'Helvetica, Arial, sans-serif', color: '#000000' }}>
      {/* Header */}
      <div className="pb-4 mb-6 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold mb-1">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-base mb-2 font-semibold">{profile.personalInfo.title}</p>
        )}
        <div className="text-sm">
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span className="mx-2">|</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.address && (
            <>
              <span className="mx-2">|</span>
              <span>
                {typeof profile.contact.address === 'string'
                  ? profile.contact.address
                  : `${profile.contact.address?.city}, ${profile.contact.address?.state}`}
              </span>
            </>
          )}
          {profile.links?.portfolio && (
            <>
              <span className="mx-2">|</span>
              <span>Portfolio: {profile.links.portfolio.replace('https://', '')}</span>
            </>
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

      {/* Core Skills & Technologies */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            CORE SKILLS & TECHNOLOGIES
          </h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' • ')}
          </p>
        </div>
      )}

      {/* Featured Projects - Primary Section */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-3 border-b-2 border-gray-900 pb-1">
            FEATURED PROJECTS & CASE STUDIES
          </h2>
          {profile.projects.map((proj: any, idx: number) => (
            <div key={idx} className="mb-5 pb-4 border-b border-gray-300 last:border-b-0">
              <h3 className="text-sm font-bold mb-1">{proj.name}</h3>
              {proj.description && (
                <p className="text-sm leading-relaxed mb-2">{proj.description}</p>
              )}
              {proj.technologies && (
                <p className="text-sm mb-1">
                  <span className="font-semibold">Technologies:</span> {proj.technologies}
                </p>
              )}
              {proj.link && (
                <p className="text-sm">
                  <span className="font-semibold">Link:</span> {proj.link}
                </p>
              )}
            </div>
          ))}
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

      {/* Key Achievements */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold uppercase mb-2 border-b border-gray-900 pb-1">
            KEY ACHIEVEMENTS & IMPACT
          </h2>
          {profile.achievements.map((achievement: any, idx: number) => (
            <p key={idx} className="text-sm mb-2">
              ✓ {typeof achievement === 'string' ? achievement : achievement.description || ''}
            </p>
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
              • {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div>
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

export default ProjectBasedTemplate;
