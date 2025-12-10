import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, TrendingUp, DollarSign, Award, Briefcase } from 'lucide-react';

const FinancierTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#0F2027';
  const secondaryColor = customizations?.colors?.secondary || '#203A43';
  const accentColor = customizations?.colors?.accent || '#2C5364';
  const goldAccent = customizations?.colors?.gold || '#D4AF37';
  const textColor = customizations?.colors?.text || '#1A1A1A';
  const font = customizations?.font || 'Merriweather, Georgia, serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Executive Finance Header */}
      <div style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 50%, ${accentColor} 100%)`,
        padding: '40px 52px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          border: `2px solid ${goldAccent}40`,
          borderRadius: '50%'
        }} />
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          width: '120px',
          height: '120px',
          border: `1px solid ${goldAccent}30`,
          borderRadius: '50%'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ 
            fontSize: '40px', 
            fontWeight: '700',
            marginBottom: '6px',
            letterSpacing: '0.5px',
            fontFamily: 'Merriweather, serif'
          }}>
            {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
          </h1>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '18px',
              fontWeight: '400',
              marginBottom: '20px',
              color: goldAccent,
              letterSpacing: '0.5px'
            }}>
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: '22px',
            fontSize: '13px',
            opacity: 0.95
          }}>
            {profile.contact?.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} />
                <span>{profile.contact.email}</span>
              </div>
            )}
            {profile.contact?.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} />
                <span>{profile.contact.phone}</span>
              </div>
            )}
            {profile.contact?.location?.city && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} />
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

      <div style={{ padding: '36px 52px' }}>
        {/* Executive Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif'
            }}>
              EXECUTIVE SUMMARY
            </h2>
            <p style={{ 
              fontSize: '14px',
              lineHeight: '1.8',
              textAlign: 'justify',
              color: '#333'
            }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Professional Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <TrendingUp size={20} />
              PROFESSIONAL EXPERIENCE
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '24px',
                paddingBottom: '24px',
                borderBottom: index < profile.experience!.length - 1 ? `1px solid ${goldAccent}30` : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: primaryColor }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '13px',
                      color: '#666',
                      background: `${goldAccent}15`,
                      padding: '6px 14px',
                      borderRadius: '4px',
                      border: `1px solid ${goldAccent}40`,
                      fontWeight: '600'
                    }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </div>
                    {exp.location && (
                      <div style={{ fontSize: '12px', color: '#777', marginTop: '6px' }}>
                        {exp.location}
                      </div>
                    )}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ 
                    fontSize: '13px', 
                    lineHeight: '1.7', 
                    marginTop: '10px',
                    color: '#444',
                    textAlign: 'justify'
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
                      <li key={i} style={{ 
                        marginBottom: '6px',
                        color: '#444',
                        position: 'relative'
                      }}>
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Core Competencies */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <DollarSign size={20} />
              CORE COMPETENCIES
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '12px 16px',
                  background: `linear-gradient(135deg, ${goldAccent}08, ${accentColor}05)`,
                  border: `1px solid ${goldAccent}40`,
                  fontSize: '13px',
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

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif'
            }}>
              EDUCATION
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '16px',
                padding: '16px',
                background: '#FAFAFA',
                border: `1px solid ${goldAccent}30`,
                borderLeft: `4px solid ${secondaryColor}`,
                borderRadius: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', textAlign: 'right' }}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </div>
                </div>
                {(edu.gpa || edu.honors) && (
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '6px' }}>
                    {edu.gpa && <span style={{ fontWeight: '600' }}>GPA: {edu.gpa}</span>}
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
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={20} />
              PROFESSIONAL CERTIFICATIONS
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '14px 16px',
                  background: '#FAFAFA',
                  border: `1px solid ${goldAccent}40`,
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: primaryColor }}>
                      {cert.name}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666', marginTop: '3px' }}>
                      {cert.issuer}
                      {cert.credentialId && <span style={{ marginLeft: '8px' }}>• ID: {cert.credentialId}</span>}
                    </div>
                  </div>
                  {cert.date && (
                    <div style={{ 
                      fontSize: '12px',
                      color: primaryColor,
                      background: `${goldAccent}20`,
                      padding: '6px 12px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements & Awards */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif'
            }}>
              ACHIEVEMENTS & RECOGNITION
            </h2>
            <div style={{ paddingLeft: '16px' }}>
              {profile.achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  paddingLeft: '20px',
                  position: 'relative',
                  fontSize: '13px',
                  lineHeight: '1.7'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '6px',
                    width: '8px',
                    height: '8px',
                    background: goldAccent,
                    borderRadius: '50%'
                  }} />
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666' }}> – {achievement.description}</span>
                  )}
                  {typeof achievement === 'object' && achievement.date && (
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px' }}>
                      ({new Date(achievement.date).getFullYear()})
                    </span>
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
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `2px solid ${goldAccent}`,
              letterSpacing: '0.5px',
              fontFamily: 'Merriweather, serif'
            }}>
              LANGUAGES
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ 
                  fontSize: '14px',
                  padding: '8px 14px',
                  background: `${goldAccent}10`,
                  border: `1px solid ${goldAccent}30`,
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

      {/* Professional Footer */}
      <div style={{ 
        borderTop: `3px solid ${goldAccent}`,
        padding: '16px 52px',
        textAlign: 'center',
        background: `linear-gradient(90deg, ${primaryColor}05, transparent, ${primaryColor}05)`,
        fontSize: '11px',
        color: '#999'
      }}>
        Professional references and detailed financial achievements available upon request
      </div>
    </div>
  );
};

export default FinancierTemplate;
