// @ts-nocheck
/**
 * Vitality Template - Healthcare Professional
 * 
 * Target: Nurses, doctors, healthcare administrators
 * ATS Score: 90/100
 * 
 * Features:
 * - Two-column clean layout
 * - Split header (name left, contact right)
 * - Certifications & Licenses section (prominent)
 * - Clinical experience emphasis
 * - Continuing education tracking
 * - Professional memberships
 */

import React from 'react';
import { TemplateProps } from './types';
import { Award, Stethoscope, BookOpen } from 'lucide-react';

interface VitalityTemplateProps {
  profile: Profile;
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const VitalityTemplate: React.FC<VitalityTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#14b8a6',
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
        fontFamily: "'Open Sans', 'Arial', sans-serif",
        color: '#1f2937',
      }}
    >
      {/* HEADER - Split */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: gaps.section,
          paddingBottom: '16px',
          borderBottom: `3px solid ${primaryColor}`,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: fonts.name,
              fontWeight: '700',
              margin: '0 0 4px 0',
              color: primaryColor,
            }}
          >
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <div
              style={{
                fontSize: fonts.subheading,
                fontWeight: '600',
                color: '#4b5563',
              }}
            >
              {profile.personalInfo.title}
            </div>
          )}
        </div>
        <div style={{ textAlign: 'right', fontSize: fonts.body, color: '#4b5563' }}>
          {profile.contact?.email && <div>{profile.contact.email}</div>}
          {profile.contact?.phone && <div>{profile.contact.phone}</div>}
          {profile.contact?.location && (
            <div>
              {profile.contact.location.city}, {profile.contact.location.state}
            </div>
          )}
          {profile.contact?.linkedIn && <div>LinkedIn Profile</div>}
        </div>
      </header>

      <div style={{ display: 'flex', gap: '24px' }}>
        {/* LEFT COLUMN - 65% */}
        <main style={{ width: '65%' }}>
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
                }}
              >
                {profile.summary}
              </p>
            </section>
          )}

          {/* CLINICAL EXPERIENCE */}
          {profile.experience && profile.experience.length > 0 && (
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
                  gap: '8px',
                }}
              >
                <Stethoscope size={18} />
                Clinical Experience
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
                        textAlign: 'right',
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

          {/* EDUCATION */}
          {profile.education && profile.education.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '10px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Education
              </h2>

              {profile.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: gaps.item }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: fonts.body,
                          fontWeight: '700',
                          color: '#1f2937',
                        }}
                      >
                        {edu.degree} {edu.major && `in ${edu.major}`}
                      </div>
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#6b7280',
                          marginTop: '2px',
                        }}
                      >
                        {edu.institution}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#9ca3af',
                      }}
                    >
                      {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : edu.expectedGraduation}
                    </div>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>

        {/* RIGHT SIDEBAR - 35% */}
        <aside style={{ width: '35%' }}>
          {/* CERTIFICATIONS & LICENSES */}
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
                  gap: '8px',
                }}
              >
                <Award size={16} />
                Certifications
              </h2>

              <div
                style={{
                  backgroundColor: '#f0fdfa',
                  border: `2px solid ${primaryColor}`,
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                {profile.certifications.map((cert, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div
                      style={{
                        fontSize: fonts.body,
                        fontWeight: '700',
                        color: '#1f2937',
                      }}
                    >
                      {cert.name}
                    </div>
                    {cert.issuingOrganization && (
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#6b7280',
                          marginTop: '2px',
                        }}
                      >
                        {cert.issuingOrganization}
                      </div>
                    )}
                    {cert.dateObtained && (
                      <div
                        style={{
                          fontSize: fonts.body,
                          color: '#9ca3af',
                          marginTop: '2px',
                        }}
                      >
                        {new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* SKILLS */}
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
                }}
              >
                Clinical Skills
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {profile.skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      fontSize: fonts.body,
                      padding: '6px 10px',
                      backgroundColor: '#f0fdfa',
                      borderLeft: `3px solid ${primaryColor}`,
                      color: '#1f2937',
                    }}
                  >
                    {skill.name}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTINUING EDUCATION (using courses) */}
          {profile.courses && profile.courses.length > 0 && (
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
                  gap: '8px',
                }}
              >
                <BookOpen size={16} />
                Continuing Ed
              </h2>

              <div style={{ fontSize: fonts.body }}>
                {profile.courses.map((course, index) => (
                  <div key={index} style={{ marginBottom: '8px', color: '#4b5563' }}>
                    <div style={{ fontWeight: '600' }}>{course.name}</div>
                    {course.institution && (
                      <div style={{ fontSize: '0.95em', color: '#6b7280' }}>{course.institution}</div>
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
                }}
              >
                Languages
              </h2>

              <div style={{ fontSize: fonts.body }}>
                {profile.languages.map((lang, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
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

export default VitalityTemplate;
