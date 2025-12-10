// @ts-nocheck
/**
 * Velocity Template - Startup/Tech Dynamic
 * 
 * Target: Startups, tech companies, modern workplaces
 * ATS Score: 70/100
 * 
 * Features:
 * - Header + Two-column layout
 * - Full-width gradient banner header
 * - Projects-first approach
 * - GitHub/portfolio links prominent
 * - Skills with proficiency indicators
 * - Modern, energetic design
 */

import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, ExternalLink } from 'lucide-react';

interface VelocityTemplateProps {
  profile: TemplateProps['profile'];
  customizations?: {
    primaryColor?: string;
    fontSize?: 'small' | 'medium' | 'large';
    sectionSpacing?: 'compact' | 'normal' | 'spacious';
  };
}

const VelocityTemplate: React.FC<VelocityTemplateProps> = ({ profile, customizations = {} }) => {
  const {
    primaryColor = '#14b8a6',
    fontSize = 'medium',
    sectionSpacing = 'normal',
  } = customizations;

  const fontSizes = {
    small: { name: '28px', heading: '16px', subheading: '13px', body: '10px' },
    medium: { name: '32px', heading: '18px', subheading: '14px', body: '11px' },
    large: { name: '36px', heading: '20px', subheading: '16px', body: '12px' },
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
        fontFamily: "'Poppins', 'Segoe UI', sans-serif",
        color: '#1f2937',
      }}
    >
      {/* HEADER - Gradient Banner */}
      <header
        style={{
          background: `linear-gradient(135deg, ${primaryColor} 0%, #0ea5e9 100%)`,
          color: '#ffffff',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: fonts.name,
            fontWeight: '700',
            margin: '0 0 8px 0',
            letterSpacing: '1px',
          }}
        >
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <div
            style={{
              fontSize: fonts.subheading,
              fontWeight: '500',
              opacity: 0.95,
              marginBottom: '16px',
            }}
          >
            {profile.personalInfo.title}
          </div>
        )}
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap',
            fontSize: fonts.body,
            marginTop: '12px',
          }}
        >
          {profile.contact?.email && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} />
              <span>{profile.contact.email}</span>
            </div>
          )}
          {profile.contact?.phone && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} />
              <span>{profile.contact.phone}</span>
            </div>
          )}
          {profile.contact?.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={14} />
              <span>{profile.contact.location.city}, {profile.contact.location.state}</span>
            </div>
          )}
          {profile.contact?.github && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Github size={14} />
              <span>{profile.contact.github}</span>
            </div>
          )}
          {profile.contact?.linkedIn && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Linkedin size={14} />
              <span>LinkedIn</span>
            </div>
          )}
          {profile.contact?.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} />
              <span>Portfolio</span>
            </div>
          )}
        </div>
      </header>

      <div style={{ display: 'flex', padding: '32px 40px' }}>
        <aside style={{ width: '35%', paddingRight: '24px' }}>
          {profile.skills && profile.skills.length > 0 && (
            <section style={{ marginBottom: gaps.section }}>
              <h2
                style={{
                  fontSize: fonts.heading,
                  fontWeight: '700',
                  marginBottom: '12px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Technical Skills
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.skills.map((skill, index) => (
                  <div key={index}>
                    <div
                      style={{
                        fontSize: fonts.body,
                        fontWeight: '600',
                        marginBottom: '4px',
                        color: '#374151',
                      }}
                    >
                      {skill.name}
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: '#e5e7eb',
                        borderRadius: '4px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: skill.level === 'Expert' ? '100%' : skill.level === 'Advanced' ? '85%' : skill.level === 'Intermediate' ? '65%' : '45%',
                          height: '100%',
                          background: `linear-gradient(90deg, ${primaryColor}, #0ea5e9)`,
                        }}
                      />
                    </div>
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
                  marginBottom: '12px',
                  color: primaryColor,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Certifications
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {profile.certifications.map((cert, index) => (
                  <div key={index}>
                    <div style={{ fontSize: fonts.body, fontWeight: '700', color: '#1f2937' }}>
                      {cert.name}
                    </div>
                    <div style={{ fontSize: fonts.body, color: '#6b7280', marginTop: '2px' }}>
                      {cert.issuingOrganization}
                    </div>
                  </div>
                ))}
              </div>
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
                  letterSpacing: '0.5px',
                }}
              >
                Education
              </h2>
              {profile.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: gaps.item }}>
                  <div style={{ fontSize: fonts.body, fontWeight: '700', color: '#1f2937' }}>
                    {edu.degree}
                  </div>
                  <div style={{ fontSize: fonts.body, color: '#6b7280', marginTop: '2px' }}>
                    {edu.institution}
                  </div>
                  <div style={{ fontSize: fonts.body, color: '#9ca3af', marginTop: '2px' }}>
                    {edu.graduationDate ? new Date(edu.graduationDate).getFullYear() : edu.expectedGraduation}
                  </div>
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* RIGHT COLUMN - 65% */}
        <main style={{ width: '65%', paddingLeft: '24px', borderLeft: `2px solid #e5e7eb` }}>
          {/* SUMMARY */}
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
                About Me
              </h2>
              <p style={{ fontSize: fonts.body, margin: 0, lineHeight: '1.6', color: '#4b5563' }}>
                {profile.summary}
              </p>
            </section>
          )}

          {/* PROJECTS */}
          {profile.projects && profile.projects.length > 0 && (
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
                Featured Projects
              </h2>
              {profile.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: gaps.item }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3
                      style={{
                        fontSize: fonts.subheading,
                        fontWeight: '700',
                        margin: 0,
                        color: '#1f2937',
                      }}
                    >
                      {project.name}
                    </h3>
                    {project.url && (
                      <ExternalLink size={14} style={{ color: primaryColor }} />
                    )}
                  </div>
                  {project.description && (
                    <p
                      style={{
                        fontSize: fonts.body,
                        margin: '4px 0',
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
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap',
                        marginTop: '6px',
                      }}
                    >
                      {project.technologies.map((tech, i) => (
                        <span
                          key={i}
                          style={{
                            fontSize: fonts.body,
                            padding: '2px 8px',
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
                  letterSpacing: '0.5px',
                }}
              >
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
                      <div style={{ fontSize: fonts.body, color: '#6b7280', marginTop: '2px' }}>
                        {job.company} • {job.location}
                      </div>
                    </div>
                    <div style={{ fontSize: fonts.body, color: '#9ca3af', fontStyle: 'italic' }}>
                      {formatDateRange(job.startDate, job.endDate, job.isCurrent)}
                    </div>
                  </div>
                  {job.description && (
                    <ul style={{ margin: '6px 0 0 20px', padding: 0, fontSize: fonts.body }}>
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
    </div>
  );
};

export default VelocityTemplate;
