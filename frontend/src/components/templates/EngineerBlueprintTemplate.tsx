import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Wrench, Award, Briefcase, Code } from 'lucide-react';

const EngineerBlueprintTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#1A4D7A';
  const secondaryColor = customizations?.colors?.secondary || '#2E6BA0';
  const accentColor = customizations?.colors?.accent || '#00A8CC';
  const textColor = customizations?.colors?.text || '#2A2A2A';
  const font = customizations?.font || 'Roboto, Arial, sans-serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Technical Header with Blueprint Aesthetic */}
      <div style={{ 
        background: `linear-gradient(90deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        padding: '32px 48px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '200px',
          height: '200px',
          background: `radial-gradient(circle, ${accentColor}20 0%, transparent 70%)`,
          borderRadius: '50%'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <Wrench size={28} style={{ color: accentColor }} />
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '700',
              letterSpacing: '-0.5px',
              margin: 0
            }}>
              {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
            </h1>
          </div>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '18px',
              fontWeight: '500',
              marginBottom: '16px',
              opacity: 0.95,
              paddingLeft: '40px'
            }}>
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '13px',
            paddingLeft: '40px'
          }}>
            {profile.contact?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={16} />
                <span>{profile.contact.email}</span>
              </div>
            )}
            {profile.contact?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={16} />
                <span>{profile.contact.phone}</span>
              </div>
            )}
            {profile.contact?.location?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} />
                <span>{profile.contact.location.city}, {profile.contact.location.state}</span>
              </div>
            )}
            {profile.contact?.linkedIn && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>LinkedIn: {profile.contact.linkedIn}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>
        {/* Professional Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Professional Summary
            </h2>
            <p style={{ 
              fontSize: '14px',
              lineHeight: '1.7',
              textAlign: 'justify',
              padding: '0 12px'
            }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Technical Skills - Priority for Engineers */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Code size={19} />
              Technical Skills
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '10px',
              padding: '0 12px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '10px 14px',
                  background: `linear-gradient(135deg, ${accentColor}15, ${secondaryColor}10)`,
                  border: `1px solid ${accentColor}40`,
                  fontSize: '12px',
                  fontWeight: '600',
                  color: primaryColor,
                  textAlign: 'center',
                  borderRadius: '4px'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Briefcase size={19} />
              Professional Experience
            </h2>
            <div style={{ padding: '0 12px' }}>
              {profile.experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: '22px',
                  paddingBottom: '22px',
                  borderBottom: index < profile.experience!.length - 1 ? `2px solid #E8E8E8` : 'none'
                }}>
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '16px',
                    marginBottom: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                        {exp.position}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '13px', 
                        color: '#666',
                        background: `${accentColor}10`,
                        padding: '4px 10px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {exp.startDate} – {exp.endDate || 'Present'}
                      </div>
                      {exp.location && (
                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                          {exp.location}
                        </div>
                      )}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '13px', lineHeight: '1.6', marginTop: '8px', color: '#444' }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ 
                      marginTop: '8px',
                      paddingLeft: '20px',
                      fontSize: '13px',
                      lineHeight: '1.6'
                    }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: '4px', color: '#444' }}>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects / Engineering Work */}
        {profile.projects && profile.projects.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Engineering Projects
            </h2>
            <div style={{ padding: '0 12px', display: 'grid', gap: '14px' }}>
              {profile.projects.map((project, index) => (
                <div key={index} style={{ 
                  padding: '14px',
                  background: '#F9FAFB',
                  border: `1px solid ${accentColor}30`,
                  borderLeft: `4px solid ${secondaryColor}`,
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: primaryColor }}>
                      {project.name}
                    </div>
                    {(project.startDate || project.endDate) && (
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        {project.startDate} – {project.endDate || 'Ongoing'}
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <p style={{ fontSize: '13px', lineHeight: '1.6', color: '#444', marginTop: '6px' }}>
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
                          fontSize: '11px',
                          padding: '3px 8px',
                          background: `${accentColor}20`,
                          color: primaryColor,
                          borderRadius: '3px',
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

        {/* Certifications & Licenses */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={19} />
              Certifications & Licenses
            </h2>
            <div style={{ padding: '0 12px', display: 'grid', gap: '10px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '12px 14px',
                  background: '#F9FAFB',
                  border: `1px solid ${secondaryColor}40`,
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: primaryColor }}>
                      {cert.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                      {cert.issuer}
                      {cert.credentialId && <span> • ID: {cert.credentialId}</span>}
                    </div>
                  </div>
                  {cert.date && (
                    <div style={{ 
                      fontSize: '11px',
                      color: '#666',
                      background: `${accentColor}15`,
                      padding: '4px 10px',
                      borderRadius: '3px'
                    }}>
                      {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Education
            </h2>
            <div style={{ padding: '0 12px' }}>
              {profile.education.map((edu, index) => (
                <div key={index} style={{ 
                  marginBottom: '14px',
                  padding: '12px 14px',
                  background: '#F9FAFB',
                  border: `1px solid ${accentColor}30`,
                  borderRadius: '4px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '700', color: primaryColor }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                        {edu.institution}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', textAlign: 'right' }}>
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </div>
                  </div>
                  {(edu.gpa || edu.honors) && (
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                      {edu.gpa && edu.honors && <span> • </span>}
                      {edu.honors && <span>{edu.honors}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Patents (if applicable) */}
        {profile.patents && profile.patents.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Patents
            </h2>
            <div style={{ padding: '0 12px' }}>
              {profile.patents.map((patent, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  fontSize: '13px',
                  lineHeight: '1.6',
                  paddingLeft: '16px',
                  borderLeft: `2px solid ${accentColor}`
                }}>
                  <div style={{ fontWeight: '700', color: primaryColor }}>
                    {patent.title}
                  </div>
                  <div style={{ color: '#666', marginTop: '2px' }}>
                    Patent No: {patent.patentNumber} • Filed: {new Date(patent.date).getFullYear()}
                  </div>
                  {patent.description && (
                    <div style={{ color: '#555', marginTop: '4px', fontSize: '12px' }}>
                      {patent.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '19px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              paddingLeft: '12px',
              borderLeft: `4px solid ${accentColor}`,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Languages
            </h2>
            <div style={{ padding: '0 12px', display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ 
                  fontSize: '13px',
                  padding: '6px 12px',
                  background: `${accentColor}15`,
                  borderRadius: '4px'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {typeof lang === 'string' ? lang : lang.language}
                  </span>
                  {typeof lang === 'object' && lang.proficiency && (
                    <span style={{ color: '#666', marginLeft: '6px' }}>
                      ({lang.proficiency})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EngineerBlueprintTemplate;
