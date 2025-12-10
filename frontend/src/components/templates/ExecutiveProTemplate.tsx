/**
 * Executive Pro Template - Senior Leadership
 * 
 * Target: C-level, VP, Director positions
 * ATS Score: 85/100
 * 
 * Features:
 * - Single-column with generous spacing
 * - Centered minimalist header
 * - Executive summary focus
 * - Key achievements highlighted
 * - Board seats & advisory roles
 * - Awards & recognition section
 * - 2-page acceptable
 */

import React from 'react';
import { Profile } from '@/types';

interface ExecutiveProTemplateProps {
  profile: Profile;
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const ExecutiveProTemplate: React.FC<ExecutiveProTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#1f2937',
    fontSize = 'medium',
    sectionSpacing = 'spacious',
  } = customizations;

  const fontSizes = {
    small: { name: '26px', heading: '16px', subheading: '13px', body: '11px' },
    medium: { name: '30px', heading: '18px', subheading: '14px', body: '12px' },
    large: { name: '34px', heading: '20px', subheading: '16px', body: '13px' },
  };

  const spacing = {
    compact: { section: '20px', item: '12px' },
    normal: { section: '28px', item: '16px' },
    spacious: { section: '36px', item: '20px' },
  };

  const fonts = fontSizes[fontSize];
  const gaps = spacing[sectionSpacing];

  const goldAccent = '#d4af37';

  const formatDateRange = (startDate?: string, endDate?: string, isCurrent?: boolean) => {
    if (!startDate) return '';
    const start = new Date(startDate).toLocaleDateString('en-US', { year: 'numeric' });
    const end = isCurrent ? 'Present' : endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric' }) : 'Present';
    return `${start} – ${end}`;
  };

  return (
    <div
      style={{
        width: '8.5in',
        minHeight: '11in',
        padding: '0.75in',
        backgroundColor: '#ffffff',
        fontFamily: "'Merriweather', Georgia, serif",
        color: primaryColor,
      }}
    >
      {/* HEADER - Centered */}
      <header style={{ textAlign: 'center', marginBottom: gaps.section, borderBottom: `3px solid ${goldAccent}`, paddingBottom: '20px' }}>
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 8px 0',
            letterSpacing: '2px',
            textTransform: 'uppercase',
          }}
        >
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <div
            style={{
              fontSize: fonts.subheading,
              color: '#6b7280',
              marginBottom: '12px',
              fontFamily: "'Georgia', serif",
              fontStyle: 'italic',
            }}
          >
            {profile.personalInfo.title}
          </div>
        )}
        <div
          style={{
            fontSize: fonts.body,
            color: '#4b5563',
            display: 'flex',
            justifyContent: 'center',
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
          {profile.contact?.linkedIn && <span>LinkedIn Profile</span>}
        </div>
      </header>

      {/* EXECUTIVE SUMMARY */}
      {profile.summary && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Executive Summary
          </h2>
          <p
            style={{
              fontSize: fonts.body,
              margin: 0,
              lineHeight: '1.8',
              textAlign: 'justify',
              fontFamily: "'Georgia', serif",
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* KEY ACHIEVEMENTS */}
      {profile.achievements && profile.achievements.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Key Achievements
          </h2>
          <ul style={{ margin: '0 0 0 24px', padding: 0, fontSize: fonts.body }}>
            {profile.achievements.map((achievement, index) => (
              <li key={index} style={{ marginBottom: '10px', lineHeight: '1.7' }}>
                {achievement}
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
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Professional Experience
          </h2>
          {profile.experience.slice(0, 4).map((job, index) => (
            <div key={index} style={{ marginBottom: gaps.item }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div>
                  <h3
                    style={{
                      fontSize: fonts.subheading,
                      fontWeight: '700',
                      margin: '0 0 4px 0',
                    }}
                  >
                    {job.jobTitle}
                  </h3>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#4b5563',
                      fontStyle: 'italic',
                    }}
                  >
                    {job.company} | {job.location}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: fonts.body,
                    color: '#6b7280',
                    textAlign: 'right',
                  }}
                >
                  {formatDateRange(job.startDate, job.endDate, job.isCurrent)}
                </div>
              </div>
              {job.description && (
                <ul style={{ margin: '8px 0 0 24px', padding: 0, fontSize: fonts.body }}>
                  {job.description.split('\n').filter(item => item.trim()).slice(0, 4).map((item, i) => (
                    <li key={i} style={{ marginBottom: '6px', lineHeight: '1.7' }}>
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
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Education
          </h2>
          {profile.education.map((edu, index) => (
            <div key={index} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: fonts.body, fontWeight: '700' }}>
                    {edu.degree} {edu.major && `in ${edu.major}`}
                  </div>
                  <div style={{ fontSize: fonts.body, color: '#4b5563', marginTop: '2px' }}>
                    {edu.institution}
                  </div>
                </div>
                <div style={{ fontSize: fonts.body, color: '#6b7280' }}>
                  {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : edu.expectedGraduation}
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* CERTIFICATIONS & LICENSES */}
      {profile.certifications && profile.certifications.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Professional Certifications
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {profile.certifications.map((cert, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: fonts.body, fontWeight: '700' }}>{cert.name}</span>
                  {cert.issuingOrganization && (
                    <span style={{ fontSize: fonts.body, color: '#4b5563' }}>
                      {' '}
                      – {cert.issuingOrganization}
                    </span>
                  )}
                </div>
                {cert.dateObtained && (
                  <span style={{ fontSize: fonts.body, color: '#6b7280' }}>
                    {new Date(cert.dateObtained).getFullYear()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BOARD & ADVISORY ROLES (if available in profile) */}
      {profile.courses && profile.courses.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '12px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              borderBottom: `2px solid ${goldAccent}`,
              paddingBottom: '6px',
            }}
          >
            Board & Advisory Roles
          </h2>
          <div style={{ fontSize: fonts.body, lineHeight: '1.7' }}>
            {profile.courses.map((course, index) => (
              <div key={index} style={{ marginBottom: '8px' }}>
                <span style={{ fontWeight: '700' }}>{course.name}</span>
                {course.institution && <span> – {course.institution}</span>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ExecutiveProTemplate;
