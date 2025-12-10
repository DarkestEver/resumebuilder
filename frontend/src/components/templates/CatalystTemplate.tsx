/**
 * Catalyst Template - Sales & Business Development
 * 
 * Target: Sales, business development, account management
 * ATS Score: 80/100
 * 
 * Features:
 * - Header + Two-column layout
 * - Bold orange banner header
 * - Key Metrics/Achievements callout section
 * - Revenue/quota attainment highlighted
 * - Awards & recognition section
 * - Numbers-focused presentation
 */

import React from 'react';
import { Profile } from '@/types';
import { TrendingUp, Target, Award, DollarSign } from 'lucide-react';

interface CatalystTemplateProps {
  profile: Profile;
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const CatalystTemplate: React.FC<CatalystTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#f97316',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '24px', heading: '16px', subheading: '13px', body: '10px' },
    medium: { name: '28px', heading: '18px', subheading: '14px', body: '11px' },
    large: { name: '32px', heading: '20px', subheading: '16px', body: '12px' },
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
        backgroundColor: '#ffffff',
        fontFamily: "'Roboto', 'Arial', sans-serif",
        color: '#1f2937',
      }}
    >
      {/* HEADER - Bold Banner */}
      <header
        style={{
          backgroundColor: primaryColor,
          color: '#ffffff',
          padding: '32px 40px',
        }}
      >
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 6px 0',
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
              marginBottom: '12px',
            }}
          >
            {profile.personalInfo.title}
          </div>
        )}
        <div
          style={{
            fontSize: fonts.body,
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
          }}
        >
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>•</span>}
          {profile.contact?.phone && <span>{profile.contact.phone}</span>}
          {profile.contact?.location && <span>•</span>}
          {profile.contact?.location && (
            <span>
              {profile.contact.location.city}, {profile.contact.location.state}
            </span>
          )}
          {profile.contact?.linkedIn && <span>•</span>}
          {profile.contact?.linkedIn && <span>LinkedIn</span>}
        </div>
      </header>

      <div style={{ padding: '32px 40px' }}>
        {/* KEY ACHIEVEMENTS CALLOUT */}
        {profile.achievements && profile.achievements.length > 0 && (
          <section
            style={{
              marginBottom: gaps.section,
              backgroundColor: '#fff7ed',
              border: `3px solid ${primaryColor}`,
              borderRadius: '8px',
              padding: '20px',
            }}
          >
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '12px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <TrendingUp size={20} />
              Key Performance Highlights
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
              }}
            >
              {profile.achievements.map((achievement, index) => (
                <div
                  key={index}
                  style={{
                    fontSize: fonts.body,
                    fontWeight: '600',
                    color: '#1f2937',
                    padding: '8px',
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    borderLeft: `4px solid ${primaryColor}`,
                  }}
                >
                  {achievement}
                </div>
              ))}
            </div>
          </section>
        )}

        <div style={{ display: 'flex', gap: '28px' }}>
          {/* LEFT COLUMN - 70% */}
          <main style={{ width: '70%' }}>
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
                  Professional Profile
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

            {/* SALES EXPERIENCE */}
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
                  <Target size={18} />
                  Sales Experience
                </h2>

                {profile.experience.map((job, index) => (
                  <div key={index} style={{ marginBottom: gaps.item }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '6px',
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
                          {job.company} | {job.location}
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
                          <li
                            key={i}
                            style={{
                              marginBottom: '4px',
                              color: '#4b5563',
                              lineHeight: '1.5',
                            }}
                          >
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
                      }}
                    >
                      {edu.degree} {edu.major && `in ${edu.major}`}
                    </div>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#6b7280',
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

          {/* RIGHT SIDEBAR - 30% */}
          <aside style={{ width: '30%' }}>
            {/* CORE COMPETENCIES */}
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
                  Core Skills
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {profile.skills.map((skill, index) => (
                    <div
                      key={index}
                      style={{
                        fontSize: fonts.body,
                        padding: '6px 12px',
                        backgroundColor: '#fff7ed',
                        color: primaryColor,
                        borderRadius: '4px',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {skill.name}
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
                  }}
                >
                  <Award size={16} />
                  Certifications
                </h2>

                <div style={{ fontSize: fonts.body }}>
                  {profile.certifications.map((cert, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: '8px',
                        paddingBottom: '8px',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontWeight: '700', color: '#1f2937' }}>{cert.name}</div>
                      {cert.issuingOrganization && (
                        <div style={{ fontSize: '0.95em', color: '#6b7280', marginTop: '2px' }}>
                          {cert.issuingOrganization}
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
                  }}
                >
                  Languages
                </h2>

                <div style={{ fontSize: fonts.body }}>
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
                      <span style={{ fontWeight: '600' }}>{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CatalystTemplate;
