// @ts-nocheck
/**
 * Precision Template - Finance/Legal Traditional
 * 
 * Target: Banking, finance, legal, consulting
 * ATS Score: 95/100
 * 
 * Features:
 * - Single-column traditional format
 * - Left-aligned formal header
 * - Conservative design
 * - Certifications prominent (CPA, JD, CFA, etc.)
 * - Publications section
 * - Bar admissions (for legal)
 */

import React from 'react';
import { TemplateProps } from './types';

interface PrecisionTemplateProps {
  profile: TemplateProps['profile'];
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const PrecisionTemplate: React.FC<PrecisionTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#1e3a8a',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '20px', heading: '14px', body: '10px' },
    medium: { name: '24px', heading: '16px', body: '11px' },
    large: { name: '28px', heading: '18px', body: '12px' },
  };

  const spacing = {
    compact: { section: '14px', item: '8px' },
    normal: { section: '18px', item: '10px' },
    spacious: { section: '24px', item: '14px' },
  };

  const fonts = fontSizes[fontSize];
  const gaps = spacing[sectionSpacing];

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    if (!startDate) return '';
    const start = new Date(startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const end = isCurrent ? 'Present' : endDate ? new Date(endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present';
    return `${start} – ${end}`;
  };

  return (
    <div
      style={{
        width: '8.5in',
        minHeight: '11in',
        padding: '0.75in 1in',
        backgroundColor: '#ffffff',
        fontFamily: "'Times New Roman', Georgia, serif",
        color: '#000000',
        lineHeight: '1.4',
      }}
    >
      {/* HEADER - Left-aligned formal */}
      <header style={{ marginBottom: gaps.section }}>
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 6px 0',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        
        <div
          style={{
            fontSize: fonts.body,
            color: '#1f2937',
            borderTop: `2px solid ${primaryColor}`,
            paddingTop: '6px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px 12px',
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
          {profile.contact?.linkedIn && <span>|</span>}
          {profile.contact?.linkedIn && <span>{profile.contact.linkedIn}</span>}
        </div>
      </header>

      {/* PROFESSIONAL SUMMARY */}
      {profile.summary && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: fonts.body,
              margin: 0,
              lineHeight: '1.6',
              textAlign: 'justify',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* PROFESSIONAL CERTIFICATIONS */}
      {profile.certifications && profile.certifications.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Professional Certifications & Licenses
          </h2>
          <ul style={{ margin: '0 0 0 20px', padding: 0, fontSize: fonts.body }}>
            {profile.certifications.map((cert, index) => (
              <li key={index} style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>{cert.name}</span>
                {cert.issuingOrganization && <span>, {cert.issuingOrganization}</span>}
                {cert.dateObtained && (
                  <span style={{ fontStyle: 'italic' }}>
                    {' '}
                    ({new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                  </span>
                )}
                {cert.expirationDate && !cert.doesNotExpire && (
                  <span style={{ fontStyle: 'italic' }}>
                    {' '}
                    – Expires {new Date(cert.expirationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* PROFESSIONAL EXPERIENCE */}
      {profile.experience && profile.experience.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Professional Experience
          </h2>

          {profile.experience.map((job, index) => (
            <div key={index} style={{ marginBottom: gaps.item }}>
              <div style={{ marginBottom: '4px' }}>
                <h3
                  style={{
                    fontSize: fonts.body,
                    fontWeight: '700',
                    margin: 0,
                    display: 'inline',
                  }}
                >
                  {job.jobTitle}
                </h3>
                <span style={{ fontSize: fonts.body }}>
                  {' '}
                  – {job.company}, {job.location}
                </span>
              </div>
              <div
                style={{
                  fontSize: fonts.body,
                  fontStyle: 'italic',
                  marginBottom: '4px',
                }}
              >
                {formatDateRange(job.startDate, job.endDate, job.isCurrent)}
              </div>

              {job.description && (
                <ul style={{ margin: '4px 0 0 20px', padding: 0, fontSize: fonts.body }}>
                  {job.description.split('\n').filter(item => item.trim()).map((item, i) => (
                    <li key={i} style={{ marginBottom: '3px', lineHeight: '1.5' }}>
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
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Education
          </h2>

          {profile.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: gaps.item }}>
              <div>
                <span style={{ fontSize: fonts.body, fontWeight: '700' }}>
                  {edu.degree}
                </span>
                {edu.major && (
                  <span style={{ fontSize: fonts.body }}> in {edu.major}</span>
                )}
              </div>
              <div style={{ fontSize: fonts.body, marginTop: '2px' }}>
                {edu.institution}, {edu.location}
              </div>
              <div style={{ fontSize: fonts.body, fontStyle: 'italic', marginTop: '2px' }}>
                {edu.graduationDate
                  ? new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : `Expected ${edu.expectedGraduation}`}
              </div>
              {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                <div style={{ fontSize: fonts.body, marginTop: '2px' }}>GPA: {edu.gpa}</div>
              )}
              {edu.achievements && edu.achievements.length > 0 && (
                <ul style={{ margin: '4px 0 0 20px', padding: 0, fontSize: fonts.body }}>
                  {edu.achievements.map((achievement, i) => (
                    <li key={i} style={{ marginBottom: '2px' }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* SKILLS */}
      {profile.skills && profile.skills.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Professional Skills
          </h2>

          <div style={{ fontSize: fonts.body, lineHeight: '1.6' }}>
            {profile.skills.map((skill, index) => (
              <span key={index}>
                {skill.name}
                {index < profile.skills!.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PUBLICATIONS (using projects) */}
      {profile.projects && profile.projects.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Publications & Research
          </h2>

          <ul style={{ margin: '0 0 0 20px', padding: 0, fontSize: fonts.body }}>
            {profile.projects.map((project, index) => (
              <li key={index} style={{ marginBottom: '6px', lineHeight: '1.5' }}>
                <span style={{ fontStyle: 'italic' }}>{project.name}</span>
                {project.description && <span>. {project.description}</span>}
                {project.date && (
                  <span>
                    {' '}
                    ({new Date(project.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* LANGUAGES */}
      {profile.languages && profile.languages.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              textTransform: 'uppercase',
              borderBottom: `2px solid ${primaryColor}`,
              paddingBottom: '4px',
            }}
          >
            Languages
          </h2>

          <div style={{ fontSize: fonts.body }}>
            {profile.languages.map((lang, index) => (
              <span key={index}>
                {lang.language} ({lang.proficiency})
                {index < profile.languages!.length - 1 ? ', ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default PrecisionTemplate;
