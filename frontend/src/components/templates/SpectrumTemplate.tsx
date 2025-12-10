/**
 * Spectrum Template - Creative Bold
 * 
 * Target: Graphic design, marketing, media, advertising
 * ATS Score: 60/100
 * 
 * Features:
 * - Asymmetric split-screen (40-60)
 * - Diagonal color block header
 * - Portfolio links prominent
 * - Creative section dividers
 * - Software/tools section with visual elements
 */

import React from 'react';
import { Profile } from '@/types';
import { Palette, Award, Briefcase, GraduationCap, Code } from 'lucide-react';

interface SpectrumTemplateProps {
  profile: Profile;
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const SpectrumTemplate: React.FC<SpectrumTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#a855f7',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '26px', heading: '15px', subheading: '12px', body: '10px' },
    medium: { name: '30px', heading: '17px', subheading: '13px', body: '11px' },
    large: { name: '34px', heading: '19px', subheading: '15px', body: '12px' },
  };

  const spacing = {
    compact: { section: '18px', item: '10px' },
    normal: { section: '22px', item: '12px' },
    spacious: { section: '28px', item: '16px' },
  };

  const fonts = fontSizes[fontSize];
  const gaps = spacing[sectionSpacing];

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    if (!startDate) return '';
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    const end = isCurrent ? 'Present' : endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present';
    return `${start} - ${end}`;
  };

  return (
    <div
      style={{
        width: '8.5in',
        minHeight: '11in',
        display: 'flex',
        backgroundColor: '#ffffff',
        fontFamily: "'Raleway', 'Arial', sans-serif",
        position: 'relative',
      }}
    >
      {/* LEFT SIDEBAR - 40% */}
      <aside
        style={{
          width: '40%',
          backgroundColor: primaryColor,
          color: '#ffffff',
          padding: '40px 28px',
          position: 'relative',
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
        }}
      >
        {/* NAME & TITLE */}
        <div style={{ marginBottom: gaps.section }}>
          <h1
            style={{
              fontSize: fonts.name,
              fontWeight: '800',
              margin: '0 0 6px 0',
              lineHeight: '1.1',
            }}
          >
            {profile.personalInfo?.firstName}
            <br />
            {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <div
              style={{
                fontSize: fonts.subheading,
                fontWeight: '600',
                opacity: 0.9,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {profile.personalInfo.title}
            </div>
          )}
        </div>

        {/* CONTACT */}
        <div style={{ marginBottom: gaps.section, fontSize: fonts.body, lineHeight: '1.6' }}>
          {profile.contact?.email && <div style={{ marginBottom: '6px' }}>{profile.contact.email}</div>}
          {profile.contact?.phone && <div style={{ marginBottom: '6px' }}>{profile.contact.phone}</div>}
          {profile.contact?.location && (
            <div style={{ marginBottom: '6px' }}>
              {profile.contact.location.city}, {profile.contact.location.state}
            </div>
          )}
          {profile.contact?.website && <div style={{ marginBottom: '6px' }}>{profile.contact.website}</div>}
        </div>

        {/* CREATIVE TOOLS/SKILLS */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: gaps.section }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: fonts.heading,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              <Palette size={18} />
              <span>Creative Tools</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {profile.skills.map((skill, index) => (
                <div
                  key={index}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '20px',
                    fontSize: fonts.body,
                    fontWeight: '600',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATIONS */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: gaps.section }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: fonts.heading,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              <Award size={18} />
              <span>Certifications</span>
            </div>
            <div style={{ fontSize: fonts.body, lineHeight: '1.6' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '700' }}>{cert.name}</div>
                  {cert.issuingOrganization && (
                    <div style={{ opacity: 0.9, fontSize: '0.95em' }}>{cert.issuingOrganization}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EDUCATION */}
        {profile.education && profile.education.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px',
                fontSize: fonts.heading,
                fontWeight: '700',
                textTransform: 'uppercase',
              }}
            >
              <GraduationCap size={18} />
              <span>Education</span>
            </div>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: '10px', fontSize: fonts.body }}>
                <div style={{ fontWeight: '700' }}>{edu.degree}</div>
                <div style={{ opacity: 0.9 }}>{edu.institution}</div>
                <div style={{ opacity: 0.8, fontSize: '0.95em' }}>
                  {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : edu.expectedGraduation}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT - 60% */}
      <main
        style={{
          width: '60%',
          padding: '40px',
          paddingLeft: '50px',
          color: '#1f2937',
        }}
      >
        {/* PROFILE */}
        {profile.summary && (
          <section style={{ marginBottom: gaps.section }}>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: primaryColor,
                }}
              />
              Creative Profile
            </h2>
            <p
              style={{
                fontSize: fonts.body,
                margin: 0,
                lineHeight: '1.6',
                color: '#4b5563',
              }}
            >
              {profile.summary}
            </p>
          </section>
        )}

        {/* PROJECTS/PORTFOLIO */}
        {profile.projects && profile.projects.length > 0 && (
          <section style={{ marginBottom: gaps.section }}>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: primaryColor,
                }}
              />
              Featured Work
            </h2>

            {profile.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: gaps.item }}>
                <h3
                  style={{
                    fontSize: fonts.subheading,
                    fontWeight: '700',
                    margin: '0 0 4px 0',
                    color: '#1f2937',
                  }}
                >
                  {project.name}
                </h3>
                {project.description && (
                  <p
                    style={{
                      fontSize: fonts.body,
                      margin: '0 0 6px 0',
                      color: '#4b5563',
                      lineHeight: '1.5',
                    }}
                  >
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: fonts.body,
                          padding: '2px 10px',
                          backgroundColor: '#f3f4f6',
                          color: primaryColor,
                          borderRadius: '4px',
                          fontWeight: '600',
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* EXPERIENCE */}
        {profile.experience && profile.experience.length > 0 && (
          <section style={{ marginBottom: gaps.section }}>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  backgroundColor: primaryColor,
                }}
              />
              Experience
            </h2>

            {profile.experience.map((job, index) => (
              <div key={index} style={{ marginBottom: gaps.item }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>
                    <h3
                      style={{
                        fontSize: fonts.subheading,
                        fontWeight: '700',
                        margin: 0,
                        color: '#1f2937',
                      }}
                    >
                      {job.jobTitle}
                    </h3>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#6b7280',
                        marginTop: '2px',
                      }}
                    >
                      {job.company} • {job.location}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#9ca3af',
                      fontStyle: 'italic',
                    }}
                  >
                    {formatDateRange(job.startDate, job.endDate, job.isCurrent)}
                  </div>
                </div>

                {job.description && (
                  <ul
                    style={{
                      margin: '6px 0 0 20px',
                      padding: 0,
                      fontSize: fonts.body,
                    }}
                  >
                    {job.description.split('\n').filter(item => item.trim()).map((item, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#4b5563', lineHeight: '1.5' }}>
                        {item.trim().replace(/^[•\-*]\s*/, '')}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default SpectrumTemplate;
