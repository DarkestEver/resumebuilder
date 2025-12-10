// @ts-nocheck
import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

const EuropassTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#003399';
  const secondaryColor = customizations?.colors?.secondary || '#FFCC00';
  const accentColor = customizations?.colors?.accent || '#0055AA';
  const textColor = customizations?.colors?.text || '#000000';
  const font = customizations?.font || 'Arial, sans-serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Europass Standard Header */}
      <div style={{ 
        background: primaryColor,
        padding: '28px 48px',
        color: 'white',
        borderBottom: `8px solid ${secondaryColor}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
              CURRICULUM VITAE
            </div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '700',
              marginBottom: '4px',
              letterSpacing: '0.5px'
            }}>
              {profile.personalInfo?.firstName?.toUpperCase()} {profile.personalInfo?.lastName?.toUpperCase()}
            </h1>
            {profile.personalInfo?.title && (
              <div style={{ 
                fontSize: '16px',
                fontWeight: '400',
                opacity: 0.95
              }}>
                {profile.personalInfo.title}
              </div>
            )}
          </div>
          {profile.personalInfo?.photo && (
            <div style={{
              width: '100px',
              height: '120px',
              border: `3px solid ${secondaryColor}`,
              overflow: 'hidden'
            }}>
              <img 
                src={profile.personalInfo.photo} 
                alt="Photo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', minHeight: '500px' }}>
        {/* Left Column - Personal Information */}
        <div style={{ 
          padding: '32px 24px',
          background: '#F5F5F5',
          borderRight: `4px solid ${secondaryColor}`
        }}>
          {/* Personal Information */}
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ 
              fontSize: '14px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              textTransform: 'uppercase',
              borderBottom: `2px solid ${secondaryColor}`,
              paddingBottom: '6px'
            }}>
              Personal Information
            </h2>
            <div style={{ fontSize: '12px', lineHeight: '1.8' }}>
              {profile.contact?.email && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: primaryColor }}>Email</div>
                  <div style={{ wordBreak: 'break-word' }}>{profile.contact.email}</div>
                </div>
              )}
              {profile.contact?.phone && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: primaryColor }}>Telephone</div>
                  <div>{profile.contact.phone}</div>
                </div>
              )}
              {profile.contact?.location?.city && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: primaryColor }}>Address</div>
                  <div>
                    {profile.contact.location.city}
                    {profile.contact.location.state && `, ${profile.contact.location.state}`}
                  </div>
                </div>
              )}
              {profile.contact?.website && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: primaryColor }}>Website</div>
                  <div style={{ wordBreak: 'break-word' }}>{profile.contact.website}</div>
                </div>
              )}
              {profile.contact?.linkedIn && (
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontWeight: '600', color: primaryColor }}>LinkedIn</div>
                  <div style={{ wordBreak: 'break-word' }}>{profile.contact.linkedIn}</div>
                </div>
              )}
            </div>
          </div>

          {/* Languages */}
          {profile.languages && profile.languages.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '14px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '12px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${secondaryColor}`,
                paddingBottom: '6px'
              }}>
                Language Skills
              </h2>
              <div style={{ fontSize: '12px' }}>
                {profile.languages.map((lang, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <div style={{ fontWeight: '600', color: primaryColor }}>
                      {typeof lang === 'string' ? lang : lang.language}
                    </div>
                    {typeof lang === 'object' && lang.proficiency && (
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        {lang.proficiency}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '14px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '12px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${secondaryColor}`,
                paddingBottom: '6px'
              }}>
                Skills
              </h2>
              <div style={{ fontSize: '11px', lineHeight: '1.6' }}>
                {profile.skills.map((skill, index) => (
                  <div key={index} style={{ 
                    marginBottom: '6px',
                    padding: '4px 8px',
                    background: 'white',
                    border: `1px solid ${accentColor}30`
                  }}>
                    {typeof skill === 'string' ? skill : skill.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Digital Skills */}
          {profile.courses && profile.courses.length > 0 && (
            <div>
              <h2 style={{ 
                fontSize: '14px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '12px',
                textTransform: 'uppercase',
                borderBottom: `2px solid ${secondaryColor}`,
                paddingBottom: '6px'
              }}>
                Digital Skills
              </h2>
              <div style={{ fontSize: '11px' }}>
                {profile.courses.slice(0, 5).map((course, index) => (
                  <div key={index} style={{ marginBottom: '8px' }}>
                    • {course.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Professional Content */}
        <div style={{ padding: '32px 40px' }}>
          {/* Profile */}
          {profile.summary && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Profile
              </h2>
              <p style={{ 
                fontSize: '13px',
                lineHeight: '1.8',
                textAlign: 'justify',
                color: '#333'
              }}>
                {profile.summary}
              </p>
            </div>
          )}

          {/* Work Experience */}
          {profile.experience && profile.experience.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Work Experience
              </h2>
              {profile.experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: '20px',
                  paddingBottom: '20px',
                  borderBottom: index < profile.experience!.length - 1 ? '1px solid #DDD' : 'none'
                }}>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: '600', marginBottom: '4px' }}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: primaryColor, marginBottom: '3px' }}>
                    {exp.position}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#666', marginBottom: '6px' }}>
                    {exp.company}
                    {exp.location && <span> • {exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#444', marginTop: '6px' }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ 
                      marginTop: '8px',
                      paddingLeft: '18px',
                      fontSize: '12px',
                      lineHeight: '1.7'
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
          )}

          {/* Education and Training */}
          {profile.education && profile.education.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Education and Training
              </h2>
              {profile.education.map((edu, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: index < profile.education!.length - 1 ? '1px solid #DDD' : 'none'
                }}>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: '600', marginBottom: '4px' }}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: primaryColor, marginBottom: '3px' }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}>
                    {edu.institution}
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
          )}

          {/* Certifications */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Certifications
              </h2>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{ fontWeight: '700', color: primaryColor }}>
                    {cert.name}
                  </div>
                  <div style={{ color: '#666', marginTop: '2px' }}>
                    {cert.issuer}
                    {cert.date && (
                      <span> • {new Date(cert.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {profile.projects && profile.projects.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Projects
              </h2>
              {profile.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: '14px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: primaryColor }}>
                    {project.name}
                  </div>
                  {project.description && (
                    <div style={{ fontSize: '12px', lineHeight: '1.6', color: '#444', marginTop: '4px' }}>
                      {project.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Achievements */}
          {profile.achievements && profile.achievements.length > 0 && (
            <div>
              <h2 style={{ 
                fontSize: '16px',
                fontWeight: '700',
                color: primaryColor,
                marginBottom: '10px',
                textTransform: 'uppercase'
              }}>
                Honors and Awards
              </h2>
              <ul style={{ paddingLeft: '18px', fontSize: '12px', lineHeight: '1.8' }}>
                {profile.achievements.map((achievement, index) => (
                  <li key={index} style={{ marginBottom: '6px', color: '#444' }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        borderTop: `4px solid ${secondaryColor}`,
        padding: '12px 48px',
        textAlign: 'center',
        fontSize: '10px',
        color: '#999',
        background: '#F5F5F5'
      }}>
        Europass Curriculum Vitae • European Union Standard Format
      </div>
    </div>
  );
};

export default EuropassTemplate;
