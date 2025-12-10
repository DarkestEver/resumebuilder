// @ts-nocheck
import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Scale, FileText, Award, Briefcase } from 'lucide-react';

const LegalCounselTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#1C1C1C';
  const secondaryColor = customizations?.colors?.secondary || '#8B7355';
  const accentColor = customizations?.colors?.accent || '#B8956A';
  const textColor = customizations?.colors?.text || '#2A2A2A';
  const font = customizations?.font || 'Garamond, Georgia, serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Formal Header with Traditional Legal Styling */}
      <div style={{ 
        borderTop: `6px solid ${primaryColor}`,
        borderBottom: `2px solid ${accentColor}`,
        padding: '32px 56px 24px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '42px', 
            fontWeight: '400',
            marginBottom: '8px',
            letterSpacing: '1px',
            color: primaryColor
          }}>
            {profile.personalInfo?.firstName?.toUpperCase()} {profile.personalInfo?.lastName?.toUpperCase()}
          </h1>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '16px',
              fontWeight: '400',
              marginBottom: '20px',
              color: secondaryColor,
              letterSpacing: '0.5px'
            }}>
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            fontSize: '13px',
            color: '#555'
          }}>
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
            {profile.contact?.location?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} />
                <span>{profile.contact.location.city}, {profile.contact.location.state}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 56px' }}>
        {/* Professional Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Professional Summary
            </h2>
            <p style={{ 
              fontSize: '14px',
              lineHeight: '1.8',
              textAlign: 'justify',
              fontFamily: 'Georgia, serif'
            }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Bar Admissions & Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Scale size={18} />
              Bar Admissions & Certifications
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '14px 18px',
                  background: '#FAFAF8',
                  border: `1px solid ${accentColor}40`,
                  borderLeft: `3px solid ${secondaryColor}`
                }}>
                  <div style={{ 
                    fontSize: '15px',
                    fontWeight: '600',
                    color: primaryColor,
                    marginBottom: '4px'
                  }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginBottom: '2px' }}>
                    {cert.issuer}
                  </div>
                  {cert.date && (
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      Admitted: {new Date(cert.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      {cert.credentialId && ` • License No: ${cert.credentialId}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Briefcase size={18} />
              Legal Experience
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: index < profile.experience!.length - 1 ? `1px solid ${accentColor}40` : 'none'
              }}>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '12px', color: '#777', fontStyle: 'italic' }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                    {exp.company}
                    {exp.location && <span style={{ color: '#888', fontWeight: '400' }}> • {exp.location}</span>}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ 
                    fontSize: '13px', 
                    lineHeight: '1.7', 
                    marginTop: '10px',
                    color: '#444',
                    textAlign: 'justify',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ 
                    marginTop: '10px',
                    paddingLeft: '22px',
                    fontSize: '13px',
                    lineHeight: '1.7'
                  }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: '5px', color: '#444' }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Education
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '18px',
                padding: '16px',
                background: '#FAFAF8',
                border: `1px solid ${accentColor}30`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: primaryColor }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#777', textAlign: 'right', fontStyle: 'italic' }}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </div>
                </div>
                {(edu.gpa || edu.honors) && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    {edu.gpa && edu.honors && <span> • </span>}
                    {edu.honors && <span>{edu.honors}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Publications & Articles */}
        {profile.publications && profile.publications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={18} />
              Publications & Legal Writing
            </h2>
            {profile.publications.map((pub, index) => (
              <div key={index} style={{ 
                marginBottom: '14px',
                fontSize: '13px',
                lineHeight: '1.7',
                paddingLeft: '18px',
                borderLeft: `2px solid ${accentColor}`
              }}>
                <div style={{ fontWeight: '600', color: primaryColor, fontStyle: 'italic' }}>
                  "{pub.title}"
                </div>
                <div style={{ color: '#666', marginTop: '3px', fontFamily: 'Georgia, serif' }}>
                  {pub.publisher}, {new Date(pub.date).getFullYear()}
                  {pub.authors && pub.authors.length > 0 && (
                    <span> • {pub.authors.join(', ')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Practice Areas / Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Practice Areas & Expertise
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '10px 16px',
                  background: `linear-gradient(135deg, ${accentColor}15, ${secondaryColor}10)`,
                  border: `1px solid ${secondaryColor}30`,
                  fontSize: '13px',
                  fontWeight: '600',
                  color: primaryColor
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Affiliations */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={18} />
              Professional Affiliations & Honors
            </h2>
            <ul style={{ 
              paddingLeft: '22px',
              fontSize: '13px',
              lineHeight: '1.8'
            }}>
              {profile.achievements.map((achievement, index) => (
                <li key={index} style={{ marginBottom: '6px', color: '#444' }}>
                  <span style={{ fontWeight: '600', color: primaryColor }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666' }}> – {achievement.description}</span>
                  )}
                  {typeof achievement === 'object' && achievement.date && (
                    <span style={{ color: '#888', fontSize: '12px' }}>
                      {' '}({new Date(achievement.date).getFullYear()})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '6px',
              borderBottom: `2px solid ${secondaryColor}`,
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Languages
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px' }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ fontSize: '13px' }}>
                  <span style={{ fontWeight: '600', color: primaryColor }}>
                    {typeof lang === 'string' ? lang : lang.language}
                  </span>
                  {typeof lang === 'object' && lang.proficiency && (
                    <span style={{ color: '#666', marginLeft: '6px', fontStyle: 'italic' }}>
                      ({lang.proficiency})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `2px solid ${accentColor}`,
        padding: '12px 56px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#888',
        fontStyle: 'italic'
      }}>
        References available upon request
      </div>
    </div>
  );
};

export default LegalCounselTemplate;
