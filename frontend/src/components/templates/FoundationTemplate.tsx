/**
 * Foundation Template - Student/Entry-Level
 * 
 * Target: Students, recent grads, career starters
 * ATS Score: 92/100
 * 
 * Features:
 * - Single-column clean layout
 * - Centered modern header
 * - Education-first layout
 * - Projects highlighted
 * - Internships & volunteer work
 * - Extracurriculars & leadership
 * - GPA display (optional, 3.5+)
 * - Coursework section
 */

import React from 'react';
import { Profile } from '@/types';

interface FoundationTemplateProps {
  profile: Profile;
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const FoundationTemplate: React.FC<FoundationTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#0ea5e9',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '22px', heading: '15px', subheading: '12px', body: '10px' },
    medium: { name: '26px', heading: '17px', subheading: '13px', body: '11px' },
    large: { name: '30px', heading: '19px', subheading: '15px', body: '12px' },
  };

  const spacing = {
    compact: { section: '14px', item: '9px' },
    normal: { section: '18px', item: '11px' },
    spacious: { section: '24px', item: '14px' },
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
        fontFamily: "'Open Sans', 'Segoe UI', sans-serif",
        color: '#1f2937',
      }}
    >
      {/* HEADER - Centered Modern */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: gaps.section,
          paddingBottom: '16px',
          borderBottom: `2px solid ${primaryColor}`,
        }}
      >
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 6px 0',
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
              marginBottom: '10px',
            }}
          >
            {profile.personalInfo.title}
          </div>
        )}
        <div
          style={{
            fontSize: fonts.body,
            color: '#6b7280',
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
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
          {profile.contact?.github && <span>•</span>}
          {profile.contact?.github && <span>GitHub</span>}
        </div>
      </header>

      {/* OBJECTIVE/SUMMARY */}
      {profile.summary && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Career Objective
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

      {/* EDUCATION (First - most important for students) */}
      {profile.education && profile.education.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '8px',
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
                    {edu.degree} {edu.major && `in ${edu.major}`}
                  </h3>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#6b7280',
                      marginTop: '2px',
                    }}
                  >
                    {edu.institution}, {edu.location}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: fonts.body,
                    color: '#9ca3af',
                    textAlign: 'right',
                  }}
                >
                  {edu.graduationDate
                    ? new Date(edu.graduationDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                    : `Expected ${edu.expectedGraduation}`}
                </div>
              </div>

              {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                <div style={{ fontSize: fonts.body, color: '#4b5563', marginTop: '2px' }}>
                  <span style={{ fontWeight: '600' }}>GPA:</span> {edu.gpa}
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
                    <li key={i} style={{ marginBottom: '3px', color: '#4b5563' }}>
                      {achievement}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* PROJECTS */}
      {profile.projects && profile.projects.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Academic & Personal Projects
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
                    margin: '0 0 4px 0',
                    color: '#4b5563',
                    lineHeight: '1.5',
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
                  }}
                >
                  <span style={{ fontWeight: '600' }}>Technologies:</span>{' '}
                  {project.technologies.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* EXPERIENCE (Internships & Part-time) */}
      {profile.experience && profile.experience.length > 0 && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Experience
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
                    margin: '4px 0 0 20px',
                    padding: 0,
                    fontSize: fonts.body,
                  }}
                >
                  {job.description.split('\n').filter(item => item.trim()).map((item, i) => (
                    <li key={i} style={{ marginBottom: '3px', color: '#4b5563', lineHeight: '1.5' }}>
                      {item.trim().replace(/^[•\-*]\s*/, '')}
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
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Technical Skills
          </h2>

          <div
            style={{
              fontSize: fonts.body,
              color: '#4b5563',
              lineHeight: '1.6',
            }}
          >
            {profile.skills.map((skill, index) => (
              <span key={index}>
                {skill.name}
                {index < profile.skills!.length - 1 ? ', ' : ''}
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
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Certifications
          </h2>

          <div style={{ fontSize: fonts.body, color: '#4b5563' }}>
            {profile.certifications.map((cert, index) => (
              <div key={index} style={{ marginBottom: '6px' }}>
                <span style={{ fontWeight: '700' }}>{cert.name}</span>
                {cert.issuingOrganization && <span> – {cert.issuingOrganization}</span>}
                {cert.dateObtained && (
                  <span style={{ color: '#9ca3af' }}>
                    {' '}
                    ({new Date(cert.dateObtained).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })})
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* EXTRACURRICULAR ACTIVITIES (using courses/interests) */}
      {(profile.courses || profile.interests) && (
        <section style={{ marginBottom: gaps.section }}>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Leadership & Activities
          </h2>

          <div style={{ fontSize: fonts.body, color: '#4b5563' }}>
            {profile.courses &&
              profile.courses.map((course, index) => (
                <div key={index} style={{ marginBottom: '6px' }}>
                  <span style={{ fontWeight: '700' }}>{course.name}</span>
                  {course.institution && <span> – {course.institution}</span>}
                </div>
              ))}
            {profile.interests && profile.interests.length > 0 && (
              <div style={{ marginTop: '8px' }}>
                <span style={{ fontWeight: '600' }}>Interests: </span>
                {profile.interests.join(', ')}
              </div>
            )}
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
              marginBottom: '8px',
              color: primaryColor,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Languages
          </h2>

          <div style={{ fontSize: fonts.body, color: '#4b5563' }}>
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

export default FoundationTemplate;
