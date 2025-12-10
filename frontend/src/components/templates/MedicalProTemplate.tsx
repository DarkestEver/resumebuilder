// @ts-nocheck
import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Award, Briefcase, GraduationCap, FileText } from 'lucide-react';

const MedicalProTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#0A4D68';
  const secondaryColor = customizations?.colors?.secondary || '#088395';
  const accentColor = customizations?.colors?.accent || '#05BFDB';
  const textColor = customizations?.colors?.text || '#1A1A1A';
  const font = customizations?.font || 'Inter, system-ui, sans-serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Header with Medical Professional Styling */}
      <div style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        padding: '40px 48px',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          {profile.personalInfo?.photo && (
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '4px solid white',
              flexShrink: 0
            }}>
              <img 
                src={profile.personalInfo.photo} 
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontSize: '36px', 
              fontWeight: '700',
              marginBottom: '8px',
              letterSpacing: '-0.5px'
            }}>
              {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
            </h1>
            {profile.personalInfo?.title && (
              <div style={{ 
                fontSize: '18px',
                fontWeight: '500',
                marginBottom: '16px',
                opacity: 0.95
              }}>
                {profile.personalInfo.title}
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '20px',
              fontSize: '14px'
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
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '32px 48px' }}>
        {/* Professional Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`
            }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p style={{ 
              fontSize: '14px',
              lineHeight: '1.7',
              textAlign: 'justify'
            }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Certifications - Priority for Medical Professionals */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={20} />
              LICENSES & CERTIFICATIONS
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '16px',
                  background: '#F8FAFB',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${secondaryColor}`
                }}>
                  <div style={{ 
                    fontSize: '16px',
                    fontWeight: '600',
                    color: primaryColor,
                    marginBottom: '4px'
                  }}>
                    {cert.name}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', marginBottom: '4px' }}>
                    {cert.issuer}
                  </div>
                  {cert.date && (
                    <div style={{ fontSize: '12px', color: '#777' }}>
                      Issued: {new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {cert.expiryDate && ` • Expires: ${new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                    </div>
                  )}
                  {cert.credentialId && (
                    <div style={{ fontSize: '12px', color: '#777', marginTop: '4px' }}>
                      Credential ID: {cert.credentialId}
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
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Briefcase size={20} />
              PROFESSIONAL EXPERIENCE
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: index < profile.experience!.length - 1 ? '1px solid #E5E5E5' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor }}>
                      {exp.company}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', textAlign: 'right' }}>
                    <div>{exp.startDate} - {exp.endDate || 'Present'}</div>
                    {exp.location && <div>{exp.location}</div>}
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
                      <li key={i} style={{ marginBottom: '4px', color: '#444' }}>{achievement}</li>
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
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <GraduationCap size={20} />
              EDUCATION & TRAINING
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '16px',
                padding: '16px',
                background: '#F8FAFB',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor }}>
                  {edu.institution}
                </div>
                {edu.gpa && (
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    GPA: {edu.gpa}
                  </div>
                )}
                {edu.honors && (
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                    {edu.honors}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Publications (Important for Medical Professionals) */}
        {profile.publications && profile.publications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <FileText size={20} />
              PUBLICATIONS & RESEARCH
            </h2>
            {profile.publications.map((pub, index) => (
              <div key={index} style={{ 
                marginBottom: '12px',
                fontSize: '13px',
                lineHeight: '1.6',
                paddingLeft: '16px',
                borderLeft: `2px solid ${accentColor}`
              }}>
                <div style={{ fontWeight: '600', color: primaryColor }}>
                  {pub.title}
                </div>
                <div style={{ color: '#666', marginTop: '2px' }}>
                  {pub.publisher} • {new Date(pub.date).getFullYear()}
                  {pub.authors && pub.authors.length > 0 && (
                    <span> • {pub.authors.join(', ')}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`
            }}>
              CORE COMPETENCIES
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '12px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '10px 16px',
                  background: `linear-gradient(135deg, ${accentColor}15, ${secondaryColor}10)`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: primaryColor,
                  textAlign: 'center'
                }}>
                  {typeof skill === 'string' ? skill : skill.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`
            }}>
              LANGUAGES
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ fontSize: '14px' }}>
                  <span style={{ fontWeight: '600', color: primaryColor }}>
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

        {/* Professional Memberships */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: `3px solid ${accentColor}`
            }}>
              PROFESSIONAL MEMBERSHIPS & ACHIEVEMENTS
            </h2>
            <ul style={{ 
              paddingLeft: '20px',
              fontSize: '13px',
              lineHeight: '1.8'
            }}>
              {profile.achievements.map((achievement, index) => (
                <li key={index} style={{ marginBottom: '6px', color: '#444' }}>
                  <span style={{ fontWeight: '600', color: primaryColor }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666' }}> - {achievement.description}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalProTemplate;
