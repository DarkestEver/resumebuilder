/**
 * Dynamic Template Renderer
 * Renders resume templates based on configuration objects
 */

import React from 'react';
import { TemplateConfiguration } from '@/types/templateConfig';
import { TemplateProps } from './types';

interface DynamicTemplateProps extends TemplateProps {
  config: TemplateConfiguration;
}

const DynamicTemplate: React.FC<DynamicTemplateProps> = ({ profile, customizations, config }) => {
  const { layout, colors, fonts, spacing, header, sections } = config;

  // Generate inline styles from configuration
  const pageStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: colors.background,
    padding: spacing.padding.page,
    fontFamily: fonts.primaryFont,
    color: colors.primary,
    fontSize: fonts.sizes.body,
    lineHeight: spacing.lineHeight.body,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: fonts.sizes.name,
    fontWeight: fonts.weights.bold,
    marginBottom: '0.25rem',
    color: colors.primary,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: fonts.sizes.title,
    fontWeight: fonts.weights.semibold,
    marginBottom: '0.5rem',
    color: colors.secondary,
  };

  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: fonts.sizes.sectionHeader,
    fontWeight: fonts.weights.bold,
    textTransform: 'uppercase',
    marginBottom: spacing.margins.sectionHeader,
    marginTop: spacing.padding.section,
    color: colors.accent,
  };

  // Render header based on configuration
  const renderHeader = () => {
    const contactItems: string[] = [];
    
    if (header.includeContact && profile.contact) {
      if (profile.contact.email) {
        contactItems.push(header.showLabels ? `Email: ${profile.contact.email}` : profile.contact.email);
      }
      if (profile.contact.phone) {
        contactItems.push(header.showLabels ? `Phone: ${profile.contact.phone}` : profile.contact.phone);
      }
      if (profile.contact.alternatePhone) {
        contactItems.push(header.showLabels ? `Alt Phone: ${profile.contact.alternatePhone}` : profile.contact.alternatePhone);
      }
      if (profile.contact.address) {
        const addr = typeof profile.contact.address === 'string'
          ? profile.contact.address
          : [
              profile.contact.address?.street,
              profile.contact.address?.apartment,
              profile.contact.address?.city,
              profile.contact.address?.state,
              profile.contact.address?.zipCode,
              profile.contact.address?.country
            ].filter(Boolean).join(', ');
        if (addr) contactItems.push(header.showLabels ? `Address: ${addr}` : addr);
      }
    }

    if (header.includeLinks && profile.links) {
      if (profile.links.linkedin) {
        contactItems.push(header.showLabels ? `LinkedIn: ${profile.links.linkedin.replace('https://', '')}` : profile.links.linkedin.replace('https://', ''));
      }
      if (profile.links.portfolio) {
        contactItems.push(header.showLabels ? `Portfolio: ${profile.links.portfolio.replace('https://', '')}` : profile.links.portfolio.replace('https://', ''));
      }
    }

    const contactText = header.contactFormat === 'inline'
      ? contactItems.join(` ${header.separator || '|'} `)
      : contactItems.join('\n');

    const headerContainerStyle: React.CSSProperties = {
      textAlign: header.style === 'centered' ? 'center' : 'left',
      marginBottom: spacing.padding.section,
      paddingBottom: spacing.padding.subsection,
      borderBottom: `2px solid ${colors.accent}`,
    };

    return (
      <div style={headerContainerStyle}>
        {/* Profile Photo */}
        {header.includePhoto && profile.personalInfo?.photo && (
          <div style={{
            textAlign: header.style === 'centered' ? 'center' : 'left',
            marginBottom: '1rem',
          }}>
            <img 
              src={profile.personalInfo.photo} 
              alt="Profile" 
              style={{
                width: header.photoSize || '100px',
                height: header.photoSize || '100px',
                objectFit: 'cover',
                borderRadius: header.photoShape === 'circle' ? '50%' : 
                             header.photoShape === 'rounded' ? '12px' : '0',
                border: `3px solid ${colors.accent}`,
                display: header.style === 'centered' ? 'inline-block' : 'block',
              }}
            />
          </div>
        )}

        {header.includeName && (
          <h1 style={nameStyle}>
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
        )}
        {header.includeTitle && profile.personalInfo?.title && (
          <p style={titleStyle}>{profile.personalInfo.title}</p>
        )}
        {contactItems.length > 0 && (
          <div style={{ fontSize: fonts.sizes.small, color: colors.secondary, whiteSpace: header.contactFormat === 'inline' ? 'normal' : 'pre-line' }}>
            {contactText}
          </div>
        )}
      </div>
    );
  };

  // Render section based on type and style
  const renderSectionHeader = (section: any) => {
    const style: React.CSSProperties = { ...sectionHeaderStyle };
    
    switch (section.style) {
      case 'underline':
        style.borderBottom = `1px solid ${colors.accent}`;
        style.paddingBottom = '0.25rem';
        break;
      case 'border-bottom':
        style.borderBottom = `1px solid ${colors.accent}`;
        style.paddingBottom = '0.5rem';
        break;
      case 'border-top-bottom':
        style.borderTop = `2px solid ${colors.accent}`;
        style.borderBottom = `2px solid ${colors.accent}`;
        style.padding = '0.5rem 0';
        style.textAlign = 'center';
        break;
      case 'background':
        style.backgroundColor = colors.sectionBg || '#F3F4F6';
        style.padding = '0.5rem';
        style.borderRadius = '6px';
        break;
      case 'minimal':
        // No extra styling
        break;
    }

    return (
      <h2 style={style}>
        {section.label}
      </h2>
    );
  };

  const renderSection = (section: any) => {
    if (!section.enabled) return null;

    const sectionStyle: React.CSSProperties = {
      marginBottom: spacing.padding.section,
    };

    switch (section.type) {
      case 'summary':
        return profile.summary ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            <p style={{ fontSize: fonts.sizes.body, lineHeight: spacing.lineHeight.body, color: colors.primary }}>
              {profile.summary}
            </p>
          </div>
        ) : null;

      case 'skills':
        return profile.skills && profile.skills.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            <p style={{ fontSize: fonts.sizes.body, lineHeight: spacing.lineHeight.body }}>
              {profile.skills.map((skill: any) => typeof skill === 'string' ? skill : skill.name || '').join(section.variant === 'pipe-separated' ? ' | ' : ' • ')}
            </p>
          </div>
        ) : null;

      case 'experience':
        return profile.experience && profile.experience.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            {profile.experience.map((exp: any, idx: number) => (
              <div key={idx} style={{ marginBottom: spacing.padding.subsection }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: fonts.sizes.body, fontWeight: fonts.weights.bold, color: colors.primary }}>{exp.title}</h3>
                  <span style={{ fontSize: fonts.sizes.small, color: colors.secondary, whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {exp.startDate && typeof exp.startDate === 'string' ? exp.startDate.slice(0, 4) : exp.startDate instanceof Date ? exp.startDate.getFullYear() : ''}
                    {' - '}
                    {exp.endDate && typeof exp.endDate === 'string' ? exp.endDate.slice(0, 4) : exp.endDate instanceof Date ? exp.endDate.getFullYear() : 'Present'}
                  </span>
                </div>
                <p style={{ fontSize: fonts.sizes.body, fontWeight: fonts.weights.semibold, marginBottom: '0.5rem', color: colors.secondary }}>
                  {exp.company}
                </p>
                <p style={{ fontSize: fonts.sizes.body, lineHeight: spacing.lineHeight.body, color: colors.primary }}>
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        ) : null;

      case 'education':
        return profile.education && profile.education.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            {profile.education.map((edu: any, idx: number) => (
              <div key={idx} style={{ marginBottom: spacing.padding.subsection }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                  <h3 style={{ fontSize: fonts.sizes.body, fontWeight: fonts.weights.bold, color: colors.primary }}>{edu.degree}</h3>
                  <span style={{ fontSize: fonts.sizes.small, color: colors.secondary, whiteSpace: 'nowrap', marginLeft: '1rem' }}>
                    {edu.startDate && typeof edu.startDate === 'string' ? edu.startDate.slice(0, 4) : edu.startDate instanceof Date ? edu.startDate.getFullYear() : ''}
                  </span>
                </div>
                <p style={{ fontSize: fonts.sizes.body, color: colors.secondary }}>{edu.institution}</p>
                {edu.gpa && <p style={{ fontSize: fonts.sizes.small, color: colors.secondary }}>GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        ) : null;

      case 'projects':
        return profile.projects && profile.projects.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            {profile.projects.map((proj: any, idx: number) => (
              <div key={idx} style={{ marginBottom: spacing.margins.paragraph }}>
                <p style={{ fontSize: fonts.sizes.body, color: colors.primary }}>
                  <span style={{ fontWeight: fonts.weights.bold }}>{proj.name}</span>
                  {proj.description && <span>. {proj.description}</span>}
                </p>
              </div>
            ))}
          </div>
        ) : null;

      case 'certifications':
        return profile.certifications && profile.certifications.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            {profile.certifications.map((cert: any, idx: number) => (
              <p key={idx} style={{ fontSize: fonts.sizes.body, marginBottom: spacing.margins.list, color: colors.primary }}>
                • {typeof cert === 'string' ? cert : `${cert.name || ''}${cert.issuer ? ' - ' + cert.issuer : ''}${cert.date ? ' (' + cert.date + ')' : ''}`}
              </p>
            ))}
          </div>
        ) : null;

      case 'achievements':
        return profile.achievements && profile.achievements.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            {profile.achievements.map((achievement: any, idx: number) => (
              <p key={idx} style={{ fontSize: fonts.sizes.body, marginBottom: spacing.margins.list, color: colors.primary }}>
                • {typeof achievement === 'string' ? achievement : achievement.description || ''}
              </p>
            ))}
          </div>
        ) : null;

      case 'languages':
        return profile.languages && profile.languages.length > 0 ? (
          <div key={section.id} style={sectionStyle}>
            {renderSectionHeader(section)}
            <p style={{ fontSize: fonts.sizes.body, color: colors.primary }}>
              {profile.languages.map((lang: any) => 
                typeof lang === 'string' ? lang : `${lang.name || ''} (${lang.proficiency || ''})`
              ).join(', ')}
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  // Render signature
  const renderSignature = () => {
    if (!profile.signature) return null;

    return (
      <div style={{
        marginTop: spacing.padding.section,
        paddingTop: spacing.padding.section,
        borderTop: `1px solid ${colors.secondary}`,
      }}>
        {profile.signature.image && (
          <img 
            src={profile.signature.image} 
            alt="Signature" 
            style={{
              maxWidth: '200px',
              height: 'auto',
              marginBottom: '0.5rem',
            }}
          />
        )}
        {profile.signature.name && (
          <p style={{ 
            fontSize: fonts.sizes.body, 
            fontWeight: fonts.weights.semibold, 
            color: colors.primary,
            marginBottom: '0.25rem',
          }}>
            {profile.signature.name}
          </p>
        )}
        <div style={{ 
          fontSize: fonts.sizes.small, 
          color: colors.secondary,
          display: 'flex',
          gap: '1rem',
        }}>
          {profile.signature.place && <span>Place: {profile.signature.place}</span>}
          {profile.signature.date && (
            <span>Date: {typeof profile.signature.date === 'string' 
              ? profile.signature.date 
              : new Date(profile.signature.date).toLocaleDateString()
            }</span>
          )}
        </div>
      </div>
    );
  };

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Render layout based on type
  const renderLayout = () => {
    switch (layout.type) {
      case 'two-column':
      case 'two-column-wide':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: layout.type === 'two-column-wide' ? '70% 30%' : '50% 50%', gap: '2rem' }}>
            <div>
              {sortedSections.slice(0, Math.ceil(sortedSections.length / 2)).map(section => renderSection(section))}
            </div>
            <div>
              {sortedSections.slice(Math.ceil(sortedSections.length / 2)).map(section => renderSection(section))}
            </div>
          </div>
        );

      case 'sidebar-left':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '30% 70%', gap: '2rem' }}>
            <div style={{ backgroundColor: colors.sectionBg || '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              {sortedSections.slice(0, 4).map(section => renderSection(section))}
            </div>
            <div>
              {sortedSections.slice(4).map(section => renderSection(section))}
            </div>
          </div>
        );

      case 'sidebar-right':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: '2rem' }}>
            <div>
              {sortedSections.slice(0, Math.ceil(sortedSections.length * 0.7)).map(section => renderSection(section))}
            </div>
            <div style={{ backgroundColor: colors.sectionBg || '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
              {sortedSections.slice(Math.ceil(sortedSections.length * 0.7)).map(section => renderSection(section))}
            </div>
          </div>
        );

      case 'three-column':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '33.33% 33.33% 33.33%', gap: '1.5rem' }}>
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i}>
                {sortedSections
                  .filter((_, idx) => idx % 3 === i)
                  .map(section => renderSection(section))}
              </div>
            ))}
          </div>
        );

      case 'modern-card':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {sortedSections.map(section => (
              <div key={section.id} style={{
                backgroundColor: colors.sectionBg || '#f9f9f9',
                padding: '1.5rem',
                borderRadius: '12px',
                border: `1px solid ${colors.accent}20`,
              }}>
                {renderSection(section)}
              </div>
            ))}
          </div>
        );

      case 'timeline':
        return (
          <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: `3px solid ${colors.accent}` }}>
            {sortedSections.map(section => (
              <div key={section.id} style={{ position: 'relative', marginBottom: '2rem' }}>
                <div style={{
                  position: 'absolute',
                  left: '-2.5rem',
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: colors.accent,
                  border: `3px solid ${colors.background}`,
                }} />
                {renderSection(section)}
              </div>
            ))}
          </div>
        );

      case 'compact-dense':
        return (
          <div style={{ fontSize: fonts.sizes.small, lineHeight: spacing.lineHeight.tight }}>
            {sortedSections.map(section => renderSection(section))}
          </div>
        );

      case 'single-column':
      default:
        return (
          <div>
            {sortedSections.map(section => renderSection(section))}
          </div>
        );
    }
  };

  return (
    <div style={pageStyle}>
      {renderHeader()}
      {renderLayout()}
      {renderSignature()}
    </div>
  );
};

export default DynamicTemplate;
