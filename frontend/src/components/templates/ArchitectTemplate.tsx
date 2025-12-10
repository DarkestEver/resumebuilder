// @ts-nocheck
/**
 * Architect Template - Project-Based Resume
 * 
 * Target: Architects, engineers, project managers
 * ATS Score: 85/100
 * 
 * Features:
 * - Timeline-based layout
 * - Left-aligned professional header
 * - Project portfolio section (prominent)
 * - Timeline visualization
 * - Technical skills matrix
 * - Tools & software proficiency
 * - CAD/technical certifications
 */

import React from 'react';
import { TemplateProps } from './types';
import { Ruler, Award, Wrench } from 'lucide-react';

interface ArchitectTemplateProps {
  profile: TemplateProps['profile'];
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const ArchitectTemplate: React.FC<ArchitectTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#64748b',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '22px', heading: '15px', subheading: '12px', body: '10px' },
    medium: { name: '26px', heading: '17px', subheading: '13px', body: '11px' },
    large: { name: '30px', heading: '19px', subheading: '15px', body: '12px' },
  };

  const spacing = {
    compact: { section: '16px', item: '10px' },
    normal: { section: '20px', item: '12px' },
    spacious: { section: '26px', item: '16px' },
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
        padding: '0.75in',
        backgroundColor: '#ffffff',
        fontFamily: "'Roboto Slab', Georgia, serif",
        color: '#1f2937',
      }}
    >
      {/* HEADER - Left-aligned Professional */}
      <header style={{ marginBottom: gaps.section }}>
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 6px 0',
            color: primaryColor,
            letterSpacing: '0.5px',
          }}
        >
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <div
            style={{
              fontSize: fonts.subheading,
              fontWeight: '600',
              color: '#6b7280',
              marginBottom: '10px',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {profile.personalInfo.title}
          </div>
        )}
        <div
          style={{
            fontSize: fonts.body,
            color: '#4b5563',
            borderTop: `2px solid ${primaryColor}`,
            paddingTop: '8px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '6px 14px',
            fontFamily: "'Roboto', sans-serif",
          }}
        >
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>|</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.location && <span>|</span>}
          {profile.contact?.location && (
            <span>
              {profile.contact.location.city}, {profile.contact.location.state}
            </span>
          )}
          {profile.contact?.website && <span>|</span>}
          {profile.contact?.website && <span>Portfolio: {profile.contact.website}</span>}
        </div>
      </header>

      {/* PROFESSIONAL SUMMARY */}
      {profile.summary && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '10px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: fonts.body,
              margin: 0,
              lineHeight: '1.6',
              color: '#4b5563',
              fontFamily: "'Roboto', sans-serif",
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      <div style={{ display: 'flex', gap: '28px' }}>
        {/* LEFT COLUMN - 68% */}
        <main style={{ width: '68%' }}>
          {/* PROJECT PORTFOLIO */}
          {profile.projects && profile.projects.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                <Ruler size={18} />
                Featured Projects
              </h2>

              <div style={{ position: 'relative', paddingLeft: '24px' }}>
                {/* Timeline line */}
                <div
                  style={{
                    position: 'absolute',
                    left: '0',
                    top: '10px',
                    bottom: '0',
                    width: '2px',
                    backgroundColor: primaryColor,
                  }}
                />

                {profile.projects.map((project, index) => (
                  <div key={index} style={{ marginBottom: gaps.item, position: 'relative' }}>
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-29px',
                        top: '6px',
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: primaryColor,
                        border: '2px solid #ffffff',
                      }}
                    />

                    <h3
                      style={{
                        fontSize: fonts.subheading,
                        fontWeight: '700',
                        margin: '0 0 4px 0',
                        color: '#1f2937',
                        fontFamily: "'Roboto', sans-serif",
                      }}
                    >
                      {project.name}
                    </h3>
                    {project.date && (
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#9ca3af',
                          marginBottom: '4px',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </div>
                    )}
                    {project.description && (
                      <p
                        style={{
                          fontSize: fonts.body,
                          margin: '0 0 6px 0',
                          color: '#4b5563',
                          lineHeight: '1.5',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#6b7280',
                          fontStyle: 'italic',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        <span style={{ fontWeight: '600' }}>Tools:</span> {project.technologies.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* PROFESSIONAL EXPERIENCE */}
          {profile.experience && profile.experience.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Professional Experience
              </h2>

              {profile.experience.map((job, index) => (
                <div key={index} style={{ marginBottom: gaps.item }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: fonts.subheading,
                          fontWeight: '700',
                          margin: 0,
                          color: '#1f2937',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {job.jobTitle}
                      </h3>
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#6b7280',
                          marginTop: '2px',
                          fontFamily: "'Roboto', sans-serif",
                        }}
                      >
                        {job.company} • {job.location}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#9ca3af',
                        textAlign: 'right',
                        fontFamily: "'Roboto', sans-serif",
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
                        fontFamily: "'Roboto', sans-serif",
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

          {/* EDUCATION */}
          {profile.education && profile.education.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Education
              </h2>

              {profile.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '10px' }}>
                  <div
                    style={{
                      fontSize: fonts.body,
                      fontWeight: '700',
                      color: '#1f2937',
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {edu.degree} {edu.major && `in ${edu.major}`}
                  </div>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#6b7280',
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    {edu.institution}
                    {edu.graduationDate && (
                      <span> • {new Date(edu.graduationDate).getFullYear()}</span>
                    )}
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {/* RIGHT SIDEBAR - 32% */}
        <aside style={{ width: '32%' }}>
          {/* TECHNICAL SKILLS */}
          {profile.skills && profile.skills.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                <Wrench size={16} />
                Tech Stack
              </h2>

              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: `1px solid ${primaryColor}`,
                  borderRadius: '6px',
                  padding: '12px',
                }}
              >
                {profile.skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: fonts.body,
                      marginBottom: '8px',
                      paddingBottom: '8px',
                      borderBottom: index < profile.skills!.length - 1 ? '1px solid #e2e8f0' : 'none',
                      fontFamily: "'Roboto', sans-serif",
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#1f2937' }}>{skill.name}</div>
                    {skill.level && (
                      <div
                        style={{
                          marginTop: '4px',
                          width: '100%',
                          height: '6px',
                          backgroundColor: '#e2e8f0',
                          borderRadius: '3px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width:
                              skill.level === 'Expert'
                                ? '100%'
                                : skill.level === 'Advanced'
                                ? '80%'
                                : skill.level === 'Intermediate'
                                ? '60%'
                                : '40%',
                            height: '100%',
                            backgroundColor: primaryColor,
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CERTIFICATIONS */}
          {profile.certifications && profile.certifications.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                <Award size={16} />
                Certifications
              </h2>

              <div style={{ fontSize: fonts.body, fontFamily: "'Roboto', sans-serif" }}>
                {profile.certifications.map((cert, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '10px',
                      paddingBottom: '10px',
                      borderBottom: index < profile.certifications!.length - 1 ? '1px solid #e5e7eb' : 'none',
                    }}
                  >
                    <div style={{ fontWeight: '700', color: '#1f2937' }}>{cert.name}</div>
                    {cert.issuingOrganization && (
                      <div style={{ fontSize: '0.95em', color: '#6b7280', marginTop: '2px' }}>
                        {cert.issuingOrganization}
                      </div>
                    )}
                    {cert.dateObtained && (
                      <div style={{ fontSize: '0.9em', color: '#9ca3af', marginTop: '2px' }}>
                        {new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LANGUAGES */}
          {profile.languages && profile.languages.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  fontFamily: "'Roboto', sans-serif",
                }}
              >
                Languages
              </h2>

              <div style={{ fontSize: fonts.body, fontFamily: "'Roboto', sans-serif" }}>
                {profile.languages.map((lang, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '6px',
                      color: '#4b5563',
                    }}
                  >
                    <span>{lang.language}</span>
                    <span style={{ fontWeight: '600', color: primaryColor }}>{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default ArchitectTemplate;
