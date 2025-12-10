// @ts-nocheck
/**
 * Oslo Template - Modern Picture Resume
 * 
 * Target: Creative roles, personal branding, modern workplaces
 * ATS Score: 75/100 (two-column layout, photo)
 * 
 * Features:
 * - Two-column layout (30-70 split)
 * - Professional photo in sidebar
 * - Icon support for contact/skills
 * - Clean visual hierarchy
 * - Modern typography (Montserrat + Open Sans)
 * - Color customization support
 * 
 * Best For: Creative industries, personal branding, modern companies
 */

import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Calendar } from 'lucide-react';

interface OsloTemplateProps {
  profile: TemplateProps['profile'];
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
    includePhoto?: boolean;
  };
}

const OsloTemplate: React.FC<OsloTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#1e3a8a', // Navy blue default
    fontSize = 'medium',
    sectionSpacing = 'normal',
    includePhoto = true,
  } = customizations;

  const fontSizes = {
    small: { name: '22px', heading: '14px', subheading: '12px', body: '10px' },
    medium: { name: '26px', heading: '16px', subheading: '13px', body: '11px' },
    large: { name: '30px', heading: '18px', subheading: '15px', body: '12px' },
  };

  const spacing = {
    compact: { section: '16px', item: '10px' },
    normal: { section: '20px', item: '12px' },
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
        backgroundColor: '#ffffff',
        fontFamily: "'Open Sans', 'Segoe UI', Arial, sans-serif",
        color: '#2d3748',
        display: 'flex',
      }}
    >
      {/* LEFT SIDEBAR - 30% */}
      <aside
        style={{
          width: '30%',
          backgroundColor: primaryColor,
          color: '#ffffff',
          padding: '40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: gaps.section,
        }}
      >
        {/* PHOTO */}
        {includePhoto && profile.personalInfo?.photo && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <div
              style={{
                width: '140px',
                height: '140px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid rgba(255, 255, 255, 0.3)',
                backgroundColor: '#ffffff',
              }}
            >
              <img
                src={profile.personalInfo?.photo}
                alt={`${profile.personalInfo?.firstName} ${profile.personalInfo?.lastName}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        )}

        {/* CONTACT INFORMATION */}
        <section>
          <h2
            style={{
              fontSize: fonts.heading,
              fontWeight: '700',
              marginBottom: '12px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
              paddingBottom: '8px',
            }}
          >
            Contact
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: fonts.body }}>
            {profile.contact?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={14} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>{profile.contact.email}</span>
              </div>
            )}
            {profile.contact?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={14} style={{ flexShrink: 0 }} />
                <span>{profile.contact.phone}</span>
              </div>
            )}
            {profile.contact?.location && (profile.contact.location.city || profile.contact.location.state) && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={14} style={{ flexShrink: 0 }} />
                <span>
                  {profile.contact.location.city}
                  {profile.contact.location.city && profile.contact.location.state && ', '}
                  {profile.contact.location.state}
                </span>
              </div>
            )}
            {profile.contact?.website && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Globe size={14} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>{profile.contact.website}</span>
              </div>
            )}
            {profile.contact?.linkedIn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Linkedin size={14} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>{profile.contact.linkedIn}</span>
              </div>
            )}
            {profile.contact?.github && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Github size={14} style={{ flexShrink: 0 }} />
                <span style={{ wordBreak: 'break-word' }}>{profile.contact.github}</span>
              </div>
            )}
          </div>
        </section>

        {/* SKILLS */}
        {profile.skills && profile.skills.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '8px',
              }}
            >
              Skills
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.skills.map((skill, index) => (
                <div key={index}>
                  <div
                    style={{
                      fontSize: fonts.body,
                      marginBottom: '4px',
                      fontWeight: '600',
                    }}
                  >
                    {skill.name}
                  </div>
                  {skill.level && (
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '80%' : skill.level === 'Intermediate' ? '60%' : '40%',
                          height: '100%',
                          backgroundColor: '#ffffff',
                          transition: 'width 0.3s ease',
                        }}
                      />
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
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '8px',
              }}
            >
              Languages
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: fonts.body }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{lang.language}</span>
                  <span style={{ fontWeight: '600' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* INTERESTS */}
        {profile.interests && profile.interests.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                paddingBottom: '8px',
              }}
            >
              Interests
            </h2>

            <div
              style={{
                fontSize: fonts.body,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {profile.interests.map((interest, index) => (
                <span key={index} style={{ lineHeight: '1.6' }}>
                  {interest}
                  {index < profile.interests!.length - 1 && ','}
                </span>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* RIGHT MAIN CONTENT - 70% */}
      <main
        style={{
          width: '70%',
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          gap: gaps.section,
        }}
      >
        {/* HEADER - Name & Title */}
        <header>
          <h1
            style={{
              fontSize: fonts.name,
              fontWeight: '700',
              margin: '0 0 8px 0',
              color: primaryColor,
              fontFamily: "'Montserrat', 'Arial Black', sans-serif",
              letterSpacing: '0.5px',
            }}
          >
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <div
              style={{
                fontSize: fonts.subheading,
                color: '#64748b',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {profile.personalInfo.title}
            </div>
          )}
        </header>

        {/* PROFESSIONAL SUMMARY */}
        {profile.summary && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: '6px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Profile
            </h2>
            <p
              style={{
                fontSize: fonts.body,
                margin: 0,
                lineHeight: '1.6',
                color: '#4a5568',
              }}
            >
              {profile.summary}
            </p>
          </section>
        )}

        {/* WORK EXPERIENCE */}
        {profile.experience && profile.experience.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: '6px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Experience
            </h2>

            {profile.experience.map((job, index) => (
              <div key={index} style={{ marginBottom: gaps.item }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <h3
                      style={{
                        fontSize: fonts.subheading,
                        fontWeight: '700',
                        margin: '0 0 3px 0',
                        color: '#1a202c',
                      }}
                    >
                      {job.jobTitle}
                    </h3>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#4a5568',
                        fontWeight: '600',
                      }}
                    >
                      {job.company}
                      {job.location && ` • ${job.location}`}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#718096',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      flexShrink: 0,
                      marginLeft: '10px',
                    }}
                  >
                    <Calendar size={12} />
                    <span>{formatDateRange(job.startDate, job.endDate, job.isCurrent)}</span>
                  </div>
                </div>

                {job.description && (
                  <ul
                    style={{
                      margin: '6px 0 0 20px',
                      padding: 0,
                      fontSize: fonts.body,
                      color: '#4a5568',
                    }}
                  >
                    {job.description.split('\n').filter(item => item.trim()).map((item, i) => (
                      <li key={i} style={{ marginBottom: '4px', lineHeight: '1.5' }}>
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
                letterSpacing: '1px',
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: '6px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Education
            </h2>

            {profile.education.map((edu, index) => (
              <div key={index} style={{ marginBottom: gaps.item }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div>
                    <h3
                      style={{
                        fontSize: fonts.subheading,
                        fontWeight: '700',
                        margin: '0 0 3px 0',
                        color: '#1a202c',
                      }}
                    >
                      {edu.degree} {edu.major && `in ${edu.major}`}
                    </h3>
                    <div
                      style={{
                        fontSize: fonts.body,
                        color: '#4a5568',
                        fontWeight: '600',
                      }}
                    >
                      {edu.institution}
                      {edu.location && ` • ${edu.location}`}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: fonts.body,
                      color: '#718096',
                      flexShrink: 0,
                      marginLeft: '10px',
                    }}
                  >
                    {edu.graduationDate
                      ? new Date(edu.graduationDate).getFullYear()
                      : edu.expectedGraduation}
                  </div>
                </div>

                {edu.gpa && parseFloat(edu.gpa) >= 3.5 && (
                  <div style={{ fontSize: fonts.body, color: '#4a5568', marginTop: '3px' }}>
                    GPA: {edu.gpa}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {profile.projects && profile.projects.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: '6px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Projects
            </h2>

            {profile.projects.map((project, index) => (
              <div key={index} style={{ marginBottom: gaps.item }}>
                <h3
                  style={{
                    fontSize: fonts.subheading,
                    fontWeight: '700',
                    margin: '0 0 4px 0',
                    color: '#1a202c',
                  }}
                >
                  {project.name}
                </h3>
                {project.description && (
                  <p
                    style={{
                      fontSize: fonts.body,
                      margin: 0,
                      color: '#4a5568',
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
                      color: '#718096',
                      marginTop: '4px',
                      fontStyle: 'italic',
                    }}
                  >
                    Technologies: {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* CERTIFICATIONS */}
        {profile.certifications && profile.certifications.length > 0 && (
          <section>
            <h2
              style={{
                fontSize: fonts.heading,
                fontWeight: '700',
                marginBottom: '10px',
                color: primaryColor,
                textTransform: 'uppercase',
                letterSpacing: '1px',
                borderBottom: `2px solid ${primaryColor}`,
                paddingBottom: '6px',
                fontFamily: "'Montserrat', sans-serif",
              }}
            >
              Certifications
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: fonts.body, fontWeight: '700', color: '#1a202c' }}>
                      {cert.name}
                    </span>
                    {cert.issuingOrganization && (
                      <span style={{ fontSize: fonts.body, color: '#4a5568' }}>
                        {' '}
                        • {cert.issuingOrganization}
                      </span>
                    )}
                  </div>
                  {cert.dateObtained && (
                    <span
                      style={{
                        fontSize: fonts.body,
                        color: '#718096',
                        flexShrink: 0,
                        marginLeft: '10px',
                      }}
                    >
                      {new Date(cert.dateObtained).getFullYear()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default OsloTemplate;
