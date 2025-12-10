import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Crown, TrendingUp, Award, Briefcase } from 'lucide-react';

const CXOTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#1A1A1A';
  const secondaryColor = customizations?.colors?.secondary || '#2C2C2C';
  const accentColor = customizations?.colors?.accent || '#B8860B';
  const goldAccent = customizations?.colors?.gold || '#D4AF37';
  const textColor = customizations?.colors?.text || '#1A1A1A';
  const font = customizations?.font || 'Times New Roman, serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Executive Header with Premium Styling */}
      <div style={{ 
        borderTop: `6px solid ${goldAccent}`,
        borderBottom: `3px solid ${accentColor}`,
        padding: '48px 60px 36px',
        background: 'white',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          top: '0',
          right: '60px',
          width: '120px',
          height: '6px',
          background: `linear-gradient(90deg, ${goldAccent}, transparent)`
        }} />
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '46px', 
            fontWeight: '400',
            marginBottom: '8px',
            letterSpacing: '2px',
            color: primaryColor,
            fontFamily: 'Times New Roman, serif'
          }}>
            {profile.personalInfo?.firstName?.toUpperCase()} {profile.personalInfo?.lastName?.toUpperCase()}
          </h1>
          {profile.personalInfo?.title && (
            <div style={{ 
              fontSize: '20px',
              fontWeight: '400',
              marginBottom: '24px',
              color: accentColor,
              letterSpacing: '1px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Crown size={22} style={{ color: goldAccent }} />
              {profile.personalInfo.title}
            </div>
          )}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '28px',
            fontSize: '13px',
            color: '#666'
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
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 60px' }}>
        {/* Executive Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              EXECUTIVE PROFILE
            </h2>
            <div style={{
              padding: '20px 32px',
              background: '#FAFAFA',
              border: `1px solid ${goldAccent}30`,
              borderLeft: `4px solid ${goldAccent}`,
              borderRight: `4px solid ${goldAccent}`
            }}>
              <p style={{ 
                fontSize: '15px',
                lineHeight: '2',
                textAlign: 'justify',
                color: '#333',
                fontFamily: 'Georgia, serif'
              }}>
                {profile.summary}
              </p>
            </div>
          </div>
        )}

        {/* Leadership Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              LEADERSHIP EXPERIENCE
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '28px',
                paddingBottom: '28px',
                borderBottom: index < profile.experience!.length - 1 ? `2px solid ${goldAccent}20` : 'none'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ 
                    fontSize: '19px',
                    fontWeight: '600',
                    color: primaryColor,
                    marginBottom: '4px',
                    fontFamily: 'Times New Roman, serif'
                  }}>
                    {exp.position}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: accentColor }}>
                      {exp.company}
                      {exp.location && <span style={{ color: '#888', fontWeight: '400', fontSize: '14px' }}> • {exp.location}</span>}
                    </div>
                    <div style={{ 
                      fontSize: '13px',
                      color: 'white',
                      background: accentColor,
                      padding: '6px 16px',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </div>
                  </div>
                </div>
                {exp.description && (
                  <p style={{ 
                    fontSize: '14px', 
                    lineHeight: '1.9', 
                    marginTop: '12px',
                    color: '#444',
                    textAlign: 'justify',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <div style={{ 
                      fontSize: '14px',
                      fontWeight: '700',
                      color: accentColor,
                      marginBottom: '8px',
                      letterSpacing: '0.5px'
                    }}>
                      KEY ACCOMPLISHMENTS:
                    </div>
                    <ul style={{ 
                      marginTop: '10px',
                      paddingLeft: '24px',
                      fontSize: '14px',
                      lineHeight: '1.9'
                    }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ 
                          marginBottom: '8px',
                          color: '#444',
                          position: 'relative'
                        }}>
                          <span style={{
                            position: 'absolute',
                            left: '-20px',
                            color: goldAccent,
                            fontWeight: '700'
                          }}>
                            ◆
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

        {/* Core Competencies */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              CORE COMPETENCIES
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              padding: '0 20px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '14px 20px',
                  background: `linear-gradient(135deg, ${goldAccent}08, ${accentColor}05)`,
                  border: `1px solid ${goldAccent}40`,
                  fontSize: '14px',
                  fontWeight: '600',
                  color: primaryColor,
                  textAlign: 'center',
                  letterSpacing: '0.5px'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              EDUCATION
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '18px',
                padding: '20px',
                background: '#FAFAFA',
                border: `1px solid ${goldAccent}30`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '17px', fontWeight: '700', color: primaryColor }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: accentColor, marginTop: '4px' }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', color: '#666', textAlign: 'right' }}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </div>
                </div>
                {(edu.gpa || edu.honors) && (
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
                    {edu.gpa && <span style={{ fontWeight: '600' }}>GPA: {edu.gpa}</span>}
                    {edu.gpa && edu.honors && <span> • </span>}
                    {edu.honors && <span style={{ fontStyle: 'italic' }}>{edu.honors}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Board Memberships / Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <Award size={22} style={{ color: goldAccent }} />
              BOARD MEMBERSHIPS & CERTIFICATIONS
            </h2>
            <div style={{ display: 'grid', gap: '14px', padding: '0 20px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '18px 24px',
                  background: '#FAFAFA',
                  border: `1px solid ${goldAccent}40`,
                  borderLeft: `4px solid ${accentColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {cert.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>
                      {cert.issuer}
                    </div>
                  </div>
                  {cert.date && (
                    <div style={{ 
                      fontSize: '13px',
                      color: primaryColor,
                      background: `${goldAccent}20`,
                      padding: '8px 16px',
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

        {/* Publications / Achievements */}
        {profile.publications && profile.publications.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '22px',
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              PUBLICATIONS & THOUGHT LEADERSHIP
            </h2>
            <div style={{ padding: '0 20px' }}>
              {profile.publications.map((pub, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  paddingLeft: '24px',
                  borderLeft: `3px solid ${goldAccent}`
                }}>
                  <div style={{ fontWeight: '700', color: primaryColor, fontStyle: 'italic', fontFamily: 'Georgia, serif' }}>
                    "{pub.title}"
                  </div>
                  <div style={{ color: '#666', marginTop: '4px' }}>
                    {pub.publisher}, {new Date(pub.date).getFullYear()}
                    {pub.authors && pub.authors.length > 0 && (
                      <span> • {pub.authors.join(', ')}</span>
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
              fontWeight: '600',
              color: primaryColor,
              marginBottom: '14px',
              textAlign: 'center',
              letterSpacing: '1px',
              paddingBottom: '10px',
              borderBottom: `2px solid ${goldAccent}`,
              fontFamily: 'Times New Roman, serif'
            }}>
              AWARDS & RECOGNITION
            </h2>
            <div style={{ padding: '0 20px' }}>
              {profile.achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  marginBottom: '14px',
                  padding: '16px 20px',
                  background: `${goldAccent}08`,
                  borderLeft: `4px solid ${goldAccent}`,
                  fontSize: '14px',
                  lineHeight: '1.8'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666' }}> – {achievement.description}</span>
                  )}
                  {typeof achievement === 'object' && achievement.date && (
                    <span style={{ color: '#888', fontSize: '13px', marginLeft: '10px' }}>
                      ({new Date(achievement.date).getFullYear()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Premium Footer */}
      <div style={{ 
        borderTop: `3px solid ${goldAccent}`,
        padding: '20px 60px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#999',
        background: '#FAFAFA'
      }}>
        <div style={{ marginBottom: '6px', fontSize: '10px', letterSpacing: '1px' }}>
          CONFIDENTIAL EXECUTIVE RESUME
        </div>
        References and detailed performance metrics available upon request
      </div>
    </div>
  );
};

export default CXOTemplate;
