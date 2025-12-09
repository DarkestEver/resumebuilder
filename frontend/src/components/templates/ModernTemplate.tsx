import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const ModernTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#2563eb';
  const textColor = customizations?.colors?.text || '#333333';
  const font = customizations?.font || 'sans-serif';

  const sectionTitleStyle = {
    color: primaryColor,
    borderBottom: `2px solid ${primaryColor}`,
  };

  return (
    <div className="w-full bg-white p-8" style={{ color: textColor, fontFamily: font }}>
      {/* Header */}
      <div className="flex justify-between items-center pb-4 mb-6 border-b-2" style={{ borderColor: primaryColor }}>
        <div>
          <h1 className="text-4xl font-bold" style={{ color: primaryColor }}>
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <p className="text-lg text-gray-600">{profile.personalInfo.title}</p>
          )}
        </div>
        <div className="text-sm text-right">
          {profile.contact?.email && (
            <div className="flex items-center justify-end mb-1">
              <span className="mr-2">{profile.contact.email}</span>
              <Mail size={14} />
            </div>
          )}
          {profile.contact?.phone && (
            <div className="flex items-center justify-end mb-1">
              <span className="mr-2">{profile.contact.phone}</span>
              <Phone size={14} />
            </div>
          )}
          {profile.contact?.address && (
            <div className="flex items-center justify-end mb-1">
              <span className="mr-2">
                {typeof profile.contact.address === 'string'
                  ? profile.contact.address
                  : `${profile.contact.address?.city}, ${profile.contact.address?.country}`}
              </span>
              <MapPin size={14} />
            </div>
          )}
          {profile.contact?.linkedin && (
            <div className="flex items-center justify-end">
              <span className="mr-2">{profile.contact.linkedin}</span>
              <Linkedin size={14} />
            </div>
          )}
        </div>
      </div>

      {/* Professional Summary */}
      {profile.summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            PROFESSIONAL SUMMARY
          </h2>
          <p className="text-sm leading-relaxed">{profile.summary}</p>
        </div>
      )}

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            SKILLS
          </h2>
          <div className="flex flex-wrap">
            {profile.skills.map((skill: any, idx: number) => (
              <span key={idx} className="text-sm bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
                {typeof skill === 'string' ? skill : skill.name || ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Experience */}
      {profile.experience && profile.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            PROFESSIONAL EXPERIENCE
          </h2>
          {profile.experience.map((exp: any, idx: number) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.title}</h3>
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                  {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                </span>
              </div>
              <p className="font-semibold text-sm mb-1" style={{ color: primaryColor }}>{exp.company}</p>
              <ul className="list-disc list-inside text-sm mt-1 leading-relaxed">
                {exp.description?.split('\n').map((item: string, i: number) => item && <li key={i}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {profile.education && profile.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            EDUCATION
          </h2>
          {profile.education.map((edu: any, idx: number) => (
            <div key={idx} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-base">{edu.degree}</h3>
                  <p className="text-sm italic">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap ml-4">
                  {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                </span>
              </div>
              {edu.gpa && <p className="text-sm mt-1">GPA: {edu.gpa}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            PROJECTS
          </h2>
          {profile.projects.map((project: any, idx: number) => (
            <div key={idx} className="mb-3">
              <h3 className="font-bold text-base">{project.name}</h3>
              <p className="text-sm leading-relaxed">{project.description}</p>
              {project.link && <a href={project.link} className="text-sm" style={{ color: primaryColor }}>View Project</a>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {profile.certifications && profile.certifications.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
            CERTIFICATIONS
          </h2>
          {profile.certifications.map((cert: any, idx: number) => (
            <div key={idx} className="mb-2">
              <p className="text-sm">
                <span className="font-semibold">{typeof cert === 'string' ? cert : cert.name || ''}</span>
                {cert.issuer && ` - ${cert.issuer}`}
                {cert.date && ` (${new Date(cert.date).getFullYear()})`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {profile.languages && profile.languages.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-2 pb-1" style={sectionTitleStyle}>
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
