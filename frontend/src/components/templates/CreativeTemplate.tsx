import React from 'react';
import { TemplateProps } from './types';

const CreativeTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const accentColor = customizations?.colors?.accent || '#ff6b6b';
  const bgColor = customizations?.colors?.background || '#f8f9fa';

  return (
    <div className="w-full bg-white" style={{ backgroundColor: bgColor }}>
      {/* Hero Section */}
      <div className="p-12" style={{ backgroundColor: '#2c3e50', color: '#fff' }}>
        <h1 className="text-4xl font-bold mb-2">
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        <p className="text-lg mb-6" style={{ color: accentColor }}>
          {profile.personalInfo?.title || 'Creative Professional'}
        </p>
        <p className="text-sm max-w-2xl leading-relaxed opacity-90">{profile.summary}</p>
      </div>

      {/* Main Content */}
      <div className="p-12">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="col-span-2">
            {/* Experience */}
            {profile.experience && profile.experience.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b-4" style={{ borderColor: accentColor }}>
                  Experience
                </h2>
                {profile.experience.map((exp: any, idx: number) => (
                  <div key={idx} className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold">{exp.title}</h3>
                    <p className="text-sm" style={{ color: accentColor }}>
                      {exp.company}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {exp.startDate && typeof exp.startDate === 'string'
                        ? exp.startDate.slice(0, 7)
                        : exp.startDate instanceof Date
                        ? exp.startDate.toISOString().slice(0, 7)
                        : ''} –{' '}
                      {exp.endDate && typeof exp.endDate === 'string'
                        ? exp.endDate.slice(0, 7)
                        : exp.endDate instanceof Date
                        ? exp.endDate.toISOString().slice(0, 7)
                        : 'Present'}
                    </p>
                    <p className="text-sm mt-3 text-gray-700">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {profile.education && profile.education.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b-4" style={{ borderColor: accentColor }}>
                  Education
                </h2>
                {profile.education.map((edu: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <h3 className="text-lg font-bold">{edu.degree}</h3>
                    <p className="text-sm text-gray-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {profile.projects && profile.projects.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b-4" style={{ borderColor: accentColor }}>
                  Projects
                </h2>
                {profile.projects.map((proj: any, idx: number) => (
                  <div key={idx} className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-lg font-bold">{proj.name}</h3>
                    <p className="text-sm mt-2 text-gray-700">{proj.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div>
            {/* Skills */}
            {profile.skills && profile.skills.length > 0 && (
              <div className="mb-10 p-6 rounded-lg" style={{ backgroundColor: `${accentColor}15` }}>
                <h3 className="font-bold mb-4 text-lg" style={{ color: accentColor }}>
                  Skills
                </h3>
                <div className="space-y-2">
                  {profile.skills.map((skill: any, idx: number) => (
                    <div key={idx} className="text-sm">{typeof skill === 'string' ? skill : skill.name || ''}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="mb-10 p-6 rounded-lg bg-gray-50">
              <h3 className="font-bold mb-4">Contact</h3>
              <div className="space-y-3 text-xs">
                {profile.contact?.email && (
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium">{profile.contact.email}</p>
                  </div>
                )}
                {profile.contact?.phone && (
                  <div>
                    <p className="text-gray-600">Phone</p>
                    <p className="font-medium">{profile.contact.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Languages */}
            {profile.languages && profile.languages.length > 0 && (
              <div className="p-6 rounded-lg" style={{ backgroundColor: `${accentColor}10` }}>
                <h3 className="font-bold mb-4">Languages</h3>
                <div className="space-y-2 text-xs">
                  {profile.languages.map((lang: any, idx: number) => (
                    <p key={idx}>{typeof lang === 'string' ? lang : lang.name || ''}</p>
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

export default CreativeTemplate;
