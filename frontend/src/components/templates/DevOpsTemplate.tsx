import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Terminal, Server, GitBranch, Award } from 'lucide-react';

const DevOpsTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#2D3561';
  const secondaryColor = customizations?.colors?.secondary || '#4A5899';
  const accentColor = customizations?.colors?.accent || '#00D9FF';
  const textColor = customizations?.colors?.text || '#2A2A2A';
  const font = customizations?.font || 'Fira Code, Consolas, monospace';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Tech-Focused Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        padding: '32px 48px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Fira Code, monospace'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '100%',
          height: '100%',
          background: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.4
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '14px', color: accentColor, marginBottom: '8px', fontWeight: '600' }}>
            $ whoami
          </div>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700',
            marginBottom: '6px',
            letterSpacing: '-0.5px'
          }}>
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '17px',
              fontWeight: '500',
              marginBottom: '18px',
              color: accentColor
            }}>
              <Terminal size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '12px',
            opacity: 0.95
          }}>
            {profile.contact?.email && (
              <div>📧 {profile.contact.email}</div>
            )}
            {profile.contact?.phone && (
              <div>📱 {profile.contact.phone}</div>
            )}
            {profile.contact?.location?.city && (
              <div>📍 {profile.contact.location.city}, {profile.contact.location.state}</div>
            )}
            {profile.contact?.github && (
              <div>
                <GitBranch size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                {profile.contact.github}
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>
        {/* Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> cat summary.txt
            </h2>
            <div style={{
              padding: '14px 18px',
              background: '#F5F5F5',
              border: `2px solid ${accentColor}40`,
              borderLeft: `4px solid ${accentColor}`,
              fontFamily: 'Arial, sans-serif',
              fontSize: '13px',
              lineHeight: '1.8'
            }}>
              {profile.summary}
            </div>
          </div>
        )}

        {/* Technical Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> ls -la /skills/
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '10px 12px',
                  background: `${accentColor}10`,
                  border: `1px solid ${accentColor}40`,
                  fontSize: '11px',
                  fontWeight: '600',
                  color: primaryColor,
                  textAlign: 'center',
                  fontFamily: 'Fira Code, monospace',
                  borderRadius: '4px'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> git log --experience
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '22px',
                padding: '16px',
                background: '#FAFAFA',
                border: `1px solid ${accentColor}30`,
                borderRadius: '6px'
              }}>
                <div style={{ 
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                  fontFamily: 'Arial, sans-serif'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '15px',
                      fontWeight: '700',
                      color: primaryColor
                    }}>
                      <Server size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                      {exp.company}
                      {exp.location && <span style={{ color: '#666', fontWeight: '400' }}> • {exp.location}</span>}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '12px',
                    color: 'white',
                    background: accentColor,
                    padding: '4px 10px',
                    borderRadius: '4px',
                    height: 'fit-content',
                    fontFamily: 'Fira Code, monospace'
                  }}>
                    {exp.startDate} → {exp.endDate || 'Now'}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ 
                    fontSize: '13px',
                    lineHeight: '1.7',
                    marginTop: '8px',
                    color: '#444',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ 
                    marginTop: '10px',
                    paddingLeft: '20px',
                    fontSize: '12px',
                    lineHeight: '1.7',
                    fontFamily: 'Arial, sans-serif'
                  }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ marginBottom: '4px', color: '#444' }}>
                        <span style={{ color: accentColor, fontWeight: '700' }}>✓</span> {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {profile.projects && profile.projects.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> npm list --projects
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {profile.projects.map((project, index) => (
                <div key={index} style={{ 
                  padding: '14px',
                  background: '#FAFAFA',
                  border: `2px solid ${secondaryColor}30`,
                  borderLeft: `4px solid ${accentColor}`,
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '700',
                      color: primaryColor,
                      fontFamily: 'Fira Code, monospace'
                    }}>
                      📦 {project.name}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div style={{ fontSize: '11px', color: '#666', fontFamily: 'Fira Code, monospace' }}>
                        {project.startDate} → {project.endDate || 'Active'}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p style={{ 
                      fontSize: '12px',
                      lineHeight: '1.6',
                      color: '#555',
                      marginTop: '6px',
                      fontFamily: 'Arial, sans-serif'
                    }}>
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div style={{ 
                      marginTop: '8px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px'
                    }}>
                      {project.technologies.map((tech, i) => (
                        <span key={i} style={{
                          fontSize: '10px',
                          padding: '3px 8px',
                          background: `${accentColor}15`,
                          color: primaryColor,
                          borderRadius: '3px',
                          fontFamily: 'Fira Code, monospace',
                          fontWeight: '600'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> cat /etc/education
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '12px',
                padding: '14px',
                background: '#FAFAFA',
                border: `1px solid ${secondaryColor}40`,
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: primaryColor }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '11px',
                    color: '#666',
                    fontFamily: 'Fira Code, monospace'
                  }}>
                    {edu.startDate} → {edu.endDate || 'Now'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '18px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Fira Code, monospace'
            }}>
              <span style={{ color: accentColor }}>{'>'}</span> docker images --certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '12px',
                  background: `linear-gradient(135deg, ${accentColor}10, ${secondaryColor}05)`,
                  border: `1px solid ${accentColor}40`,
                  borderRadius: '4px'
                }}>
                  <div style={{ 
                    fontSize: '13px',
                    fontWeight: '700',
                    color: primaryColor,
                    fontFamily: 'Fira Code, monospace'
                  }}>
                    <Award size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#666', marginTop: '4px' }}>
                    {cert.issuer}
                    {cert.date && (
                      <span style={{ marginLeft: '8px' }}>
                        ({new Date(cert.date).getFullYear()})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `2px solid ${accentColor}40`,
        padding: '12px 48px',
        background: '#F5F5F5',
        fontFamily: 'Fira Code, monospace',
        fontSize: '11px',
        color: '#999'
      }}>
        $ exit 0
      </div>
    </div>
  );
};

export default DevOpsTemplate;
