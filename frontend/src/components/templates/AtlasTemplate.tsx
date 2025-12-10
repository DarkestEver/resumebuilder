// @ts-nocheck
/**
 * Atlas Template - Gold Standard ATS Resume
 * 
 * Target: Any role requiring ATS optimization
 * ATS Score: 100/100
 * 
 * Features:
 * - Single-column layout (maximum ATS compatibility)
 * - No graphics, tables, or complex formatting
 * - Standard section headings
 * - Clean bullet points
 * - Professional typography (system fonts)
 * - Black text on white background
 * 
 * Best For: Large corporations, traditional industries, ATS-heavy companies
 */

import React from 'react';
import { TemplateProps } from './types';

interface AtlasTemplateProps {
  profile: TemplateProps['profile'];
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
    includePhoto?: boolean;
  };
}

const AtlasTemplate: React.FC<AtlasTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#000000',
    fontSize = 'medium',
    sectionSpacing = 'normal',
    includePhoto = false,
  } = customizations;

  // Font sizes based on user preference
  const fontSizes = {
    small: { name: '20px', heading: '14px', body: '10px' },
    medium: { name: '24px', heading: '16px', body: '11px' },
    large: { name: '28px', heading: '18px', body: '12px' },
  };

  // Section spacing based on user preference
  const spacing = {
    compact: { section: '12px', item: '8px' },
    normal: { section: '16px', item: '10px' },
    spacious: { section: '24px', item: '14px' },
  };

  const fonts = fontSizes[fontSize];
  const gaps = spacing[sectionSpacing];

  // Helper: Format phone number
  const formatPhone = (phone?: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  // Helper: Format date range
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
        fontFamily: 'Arial, Helvetica, sans-serif',
        color: '#000000',
        lineHeight: '1.4',
      }}
    >
      {/* HEADER - Contact Information */}
      <header style={{ marginBottom: gaps.section }}>
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 4px 0',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {profile.personalInfo?.firstName || 'Your'} {profile.personalInfo?.lastName || 'Name'}
        </h1>

        <div
          style={{
            fontSize: fonts.body,
            color: '#333333',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px 16px',
          }}
        >
          {profile.contact?.email && <span>{profile.contact.email}</span>}
          {profile.contact?.phone && <span>{formatPhone(profile.contact.phone)}</span>}
          {profile.contact?.location?.city && profile.contact?.location?.state && (
            <span>
              {profile.contact.location.city}, {profile.contact.location.state}
            </span>
          )}
          {profile.contact?.linkedIn && <span>{profile.contact.linkedIn}</span>}
          {profile.contact?.website && <span>{profile.contact.website}</span>}
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
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Professional Summary
          </h2>
          <p
            style={{
              fontSize: fonts.body,
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            {profile.summary}
          </p>
        </section>
      )}

      {/* WORK EXPERIENCE */}
      {profile.experience && profile.experience.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Work Experience
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
                      fontSize: fonts.body,
                      fontWeight: '700',
                      margin: 0,
                    }}
                  >
                    {job.jobTitle}
                  </h3>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#333333',
                      margin: '2px 0',
                    }}
                  >
                    {job.company}
                    {job.location && ` - ${job.location}`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: fonts.body,
                    color: '#555555',
                    fontStyle: 'italic',
                    textAlign: 'right',
                  }}
                >
                  {formatDateRange(job.startDate, job.endDate, job.isCurrent)}
                </div>
              </div>

              {job.description && (
                <ul
                  style={{
                    margin: '4px 0 0 20px',
                    padding: 0,
                    fontSize: fonts.body,
                  }}
                >
                  {job.description.split('\n').filter(item => item.trim()).map((item, i) => (
                    <li key={i} style={{ marginBottom: '3px' }}>
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
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
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
                  marginBottom: '2px',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: fonts.body,
                      fontWeight: '700',
                      margin: 0,
                    }}
                  >
                    {edu.degree} {edu.major && `in ${edu.major}`}
                  </h3>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#333333',
                      margin: '2px 0',
                    }}
                  >
                    {edu.institution}
                    {edu.location && ` - ${edu.location}`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: fonts.body,
                    color: '#555555',
                    fontStyle: 'italic',
                    textAlign: 'right',
                  }}
                >
                  {edu.graduationDate
                    ? new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : 'Expected ' + edu.expectedGraduation}
                </div>
              </div>

              {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                <div style={{ fontSize: fonts.body, color: '#333333' }}>
                  GPA: {edu.gpa}
                </div>
              )}

              {edu.achievements && edu.achievements.length > 0 && (
                <ul
                  style={{
                    margin: '4px 0 0 20px',
                    padding: 0,
                    fontSize: fonts.body,
                  }}
                >
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
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Skills
          </h2>

          <div style={{ fontSize: fonts.body }}>
            {profile.skills.map((skill, index) => (
              <span key={index}>
                {skill.name}
                {index < profile.skills!.length - 1 ? ' • ' : ''}
              </span>
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
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Certifications
          </h2>

          {profile.certifications.map((cert, index) => (
            <div key={index} style={{ marginBottom: '6px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span style={{ fontSize: fonts.body, fontWeight: '700' }}>{cert.name}</span>
                  {cert.issuingOrganization && (
                    <span style={{ fontSize: fonts.body, color: '#333333' }}>
                      {' '}
                      - {cert.issuingOrganization}
                    </span>
                  )}
                </div>
                {cert.dateObtained && (
                  <span
                    style={{
                      fontSize: fonts.body,
                      color: '#555555',
                      fontStyle: 'italic',
                    }}
                  >
                    {new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS (if applicable) */}
      {profile.projects && profile.projects.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Projects
          </h2>

          {profile.projects.map((project, index) => (
            <div key={index} style={{ marginBottom: gaps.item }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '2px',
                }}
              >
                <h3
                  style={{
                    fontSize: fonts.body,
                    fontWeight: '700',
                    margin: 0,
                  }}
                >
                  {project.name}
                </h3>
                {project.date && (
                  <span
                    style={{
                      fontSize: fonts.body,
                      color: '#555555',
                      fontStyle: 'italic',
                    }}
                  >
                    {new Date(project.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>

              {project.description && (
                <p
                  style={{
                    fontSize: fonts.body,
                    margin: '4px 0 0 0',
                  }}
                >
                  {project.description}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {/* LANGUAGES (if applicable) */}
      {profile.languages && profile.languages.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              margin: '0 0 8px 0',
              textTransform: 'uppercase',
              borderBottom: '2px solid #000000',
              paddingBottom: '4px',
            }}
          >
            Languages
          </h2>

          <div style={{ fontSize: fonts.body }}>
            {profile.languages.map((lang, index) => (
              <span key={index}>
                {lang.language}
                {lang.proficiency && ` (${lang.proficiency})`}
                {index < profile.languages!.length - 1 ? ' • ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default AtlasTemplate;
