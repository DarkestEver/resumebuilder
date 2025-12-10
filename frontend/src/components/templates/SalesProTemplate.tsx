// @ts-nocheck
import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, TrendingUp, Target, Award, BarChart3 } from 'lucide-react';

const SalesProTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#C72C41';
  const secondaryColor = customizations?.colors?.secondary || '#EE4540';
  const accentColor = customizations?.colors?.accent || '#F9A826';
  const textColor = customizations?.colors?.text || '#2A2A2A';
  const font = customizations?.font || 'Montserrat, Arial, sans-serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Dynamic Sales-Focused Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        padding: '36px 48px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '0',
          width: '100%',
          height: '100%',
          background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.3
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
            <TrendingUp size={32} style={{ color: accentColor }} />
            <h1 style={{ 
              fontSize: '38px', 
              fontWeight: '800',
              letterSpacing: '-0.5px',
              margin: 0
            }}>
              {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
            </h1>
          </div>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '19px',
              fontWeight: '600',
              marginBottom: '18px',
              paddingLeft: '44px',
              color: accentColor
            }}>
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '20px',
            fontSize: '13px',
            paddingLeft: '44px'
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
        {/* Performance Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <Target size={22} />
              Performance Profile
            </h2>
            <div style={{
              padding: '16px 20px',
              background: `linear-gradient(135deg, ${accentColor}15, ${secondaryColor}08)`,
              borderLeft: `4px solid ${accentColor}`,
              borderRadius: '6px'
            }}>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.8',
                color: '#444'
              }}>
                {profile.summary}
              </p>
            </div>
          </div>
        )}

        {/* Professional Experience with Metrics Focus */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <BarChart3 size={22} />
              Sales Track Record
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '24px',
                padding: '20px',
                background: '#FAFAFA',
                borderRadius: '8px',
                border: `2px solid ${index % 2 === 0 ? primaryColor : secondaryColor}30`,
                borderLeft: `6px solid ${index % 2 === 0 ? primaryColor : secondaryColor}`
              }}>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: '16px',
                  marginBottom: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: primaryColor }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                      {exp.company}
                      {exp.location && <span style={{ fontWeight: '400', color: '#666' }}> • {exp.location}</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      color: 'white',
                      background: primaryColor,
                      padding: '6px 14px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      fontWeight: '600'
                    }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <p style={{ fontSize: '13px', lineHeight: '1.7', marginTop: '10px', color: '#444' }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      fontSize: '13px', 
                      fontWeight: '700', 
                      color: primaryColor,
                      marginBottom: '8px'
                    }}>
                      KEY ACHIEVEMENTS:
                    </div>
                    <ul style={{ 
                      marginTop: '8px',
                      paddingLeft: '20px',
                      fontSize: '13px',
                      lineHeight: '1.8'
                    }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ 
                          marginBottom: '6px',
                          color: '#444',
                          position: 'relative'
                        }}>
                          <span style={{ 
                            color: accentColor,
                            fontWeight: '700',
                            marginRight: '6px'
                          }}>
                            ▸
                          </span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Core Sales Competencies */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Core Competencies
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '12px 16px',
                  background: index % 3 === 0 
                    ? `${primaryColor}15` 
                    : index % 3 === 1 
                      ? `${secondaryColor}15`
                      : `${accentColor}20`,
                  border: `2px solid ${index % 3 === 0 
                    ? primaryColor 
                    : index % 3 === 1 
                      ? secondaryColor
                      : accentColor}50`,
                  fontSize: '13px',
                  fontWeight: '700',
                  color: index % 3 === 0 
                    ? primaryColor 
                    : index % 3 === 1 
                      ? secondaryColor
                      : '#C68500',
                  textAlign: 'center',
                  borderRadius: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Education
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {profile.education.map((edu, index) => (
                <div key={index} style={{ 
                  padding: '16px',
                  background: '#FAFAFA',
                  border: `2px solid ${accentColor}40`,
                  borderRadius: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                        {edu.institution}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', fontWeight: '600' }}>
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={22} />
              Certifications
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '14px',
                  background: `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}05)`,
                  border: `2px solid ${primaryColor}30`,
                  borderRadius: '6px'
                }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: primaryColor }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                    {cert.issuer}
                    {cert.date && (
                      <span style={{ marginLeft: '8px', color: '#888' }}>
                        ({new Date(cert.date).getFullYear()})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Recognition */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Awards & Recognition
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {profile.achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  padding: '12px 16px',
                  background: `${accentColor}20`,
                  borderLeft: `4px solid ${primaryColor}`,
                  borderRadius: '4px',
                  fontSize: '13px',
                  lineHeight: '1.7'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    🏆 {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666', marginLeft: '8px' }}>– {achievement.description}</span>
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

export default SalesProTemplate;
