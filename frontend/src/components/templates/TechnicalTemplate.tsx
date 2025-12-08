import React from 'react';
import { TemplateProps } from './types';

const TechnicalTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#0066cc';

  // Debug logging
  console.log('TechnicalTemplate - profile:', profile);
  console.log('TechnicalTemplate - customizations:', customizations);

  if (!profile) {
    return (
      <div className="w-full bg-white p-10">
        <p className="text-center text-gray-500">No profile data available</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-10" style={{ fontFamily: 'Consolas, monospace', color: '#000000' }}>
      {/* Header - ATS Optimized */}
      <div className="mb-6 pb-4 border-b-2 border-gray-900">
        <h1 className="text-3xl font-bold mb-1">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <p className="text-base mb-2">{profile.personalInfo?.title}</p>
        )}
        <div className="text-sm space-y-1">
          {profile.contact?.email && <div>Email: {profile.contact.email}</div>}
          {profile.contact?.phone && <div>Phone: {profile.contact.phone}</div>}
          {profile.contact?.alternatePhone && <div>Alt Phone: {profile.contact.alternatePhone}</div>}
          {profile.contact?.address && (
            <div>
              Address: {typeof profile.contact.address === 'string' 
                ? profile.contact.address 
                : [
                    profile.contact.address?.street,
                    profile.contact.address?.apartment,
                    profile.contact.address?.city,
                    profile.contact.address?.state,
                    profile.contact.address?.zipCode,
                    profile.contact.address?.country
                  ].filter(Boolean).join(', ')
              }
            </div>
          )}
          {profile.contact?.github && <div>GitHub: {profile.contact.github}</div>}
          {profile.contact?.linkedin && <div>LinkedIn: {profile.contact.linkedin}</div>}
          {profile.contact?.portfolio && <div>Portfolio: {profile.contact.portfolio}</div>}
        </div>
      </div>

      {/* Technical Summary - ATS Optimized */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            TECHNICAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Technical Skills - ATS Optimized */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            TECHNICAL SKILLS
          </h2>
          <p className="text-sm leading-relaxed">
            {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(' | ')}
          </p>
        </div>
      )}

      {/* Professional Experience - ATS Optimized */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            PROFESSIONAL EXPERIENCE
          </h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-5">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-sm">{exp.title}</p>
                <span className="text-sm whitespace-nowrap ml-4">
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
              <p className="text-sm font-semibold">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Projects - ATS Optimized */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            PROJECTS
          </h2>
          {profile.projects.map((proj: any, idx: number) => (
            <div key={idx} className="mb-4">
              <p className="font-bold text-sm">{proj.name}</p>
              <p className="text-sm mt-1 leading-relaxed">{proj.description}</p>
              {proj.technologies && (
                <p className="text-sm mt-1">
                  Technologies: {Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}
                </p>
              )}
              {proj.link && <p className="text-sm">Link: {proj.link}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Education - ATS Optimized */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            EDUCATION
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-3">
              <p className="font-bold text-sm">{edu.degree}</p>
              <p className="text-sm">{edu.institution}</p>
              {edu.year && <p className="text-sm">Year: {edu.year}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications - ATS Optimized */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            CERTIFICATIONS
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">
              {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}`}
            </p>
          ))}
        </div>
      )}

      {/* Open Source Contributions */}
      {profile.achievements && profile.achievements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-base font-bold mb-2 border-b border-gray-900 pb-1">
            ACHIEVEMENTS
          </h2>
          {profile.achievements.map((achievement: any, idx: number) => (
            <p key={idx} className="text-sm mb-1">• {typeof achievement === 'string' ? achievement : achievement.description || ''}</p>
          ))}
        </div>
      )}

      {/* Signature */}
      {profile.signature && (
        <div className="mt-8 pt-6 border-t border-gray-300">
          {profile.signature.image && (
            <img src={profile.signature.image} alt="Signature" className="max-w-[200px] h-auto mb-2" />
          )}
          {profile.signature.name && (
            <p className="text-sm font-semibold mb-1">{profile.signature.name}</p>
          )}
          <div className="text-xs text-gray-600 flex gap-4">
            {profile.signature.place && <span>Place: {profile.signature.place}</span>}
            {profile.signature.date && (
              <span>Date: {typeof profile.signature.date === 'string' 
                ? profile.signature.date 
                : new Date(profile.signature.date).toLocaleDateString()
              }</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalTemplate;
