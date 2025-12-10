import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, Palette, Award, Briefcase, Camera } from 'lucide-react';

const CreativePortfolioTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#FF6B6B';
  const secondaryColor = customizations?.colors?.secondary || '#4ECDC4';
  const accentColor = customizations?.colors?.accent || '#FFE66D';
  const textColor = customizations?.colors?.text || '#2C2C2C';
  const font = customizations?.font || 'Poppins, sans-serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Creative Header with Asymmetric Design */}
      <div style={{ 
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
        padding: '48px 48px 32px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '10%',
          width: '120px',
          height: '120px',
          background: `${accentColor}30`,
          borderRadius: '50%',
          transform: 'rotate(45deg)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '5%',
          width: '80px',
          height: '80px',
          border: `3px solid ${accentColor}50`,
          borderRadius: '20px'
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {profile.personalInfo?.photo && (
            <div style={{
              width: '140px',
              height: '140px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: `4px solid ${accentColor}`,
              flexShrink: 0,
              transform: 'rotate(-3deg)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
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
              fontSize: '44px', 
              fontWeight: '800',
              marginBottom: '8px',
              letterSpacing: '-1px'
            }}>
              {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
            </h1>
            {profile.personalInfo?.title && (
              <div style={{ 
                fontSize: '20px',
                fontWeight: '500',
                marginBottom: '18px',
                opacity: 0.95
              }}>
                {profile.personalInfo.title}
              </div>
            )}
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap',
              gap: '18px',
              fontSize: '13px'
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
                  <span>{profile.contact.location.city}</span>
                </div>
              )}
              {profile.contact?.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Palette size={16} />
                  <span>{profile.contact.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px 48px' }}>
        {/* Creative Statement */}
        {profile.summary && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Creative Vision
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <p style={{ 
              fontSize: '15px',
              lineHeight: '1.8',
              color: '#555',
              marginTop: '20px'
            }}>
              {profile.summary}
            </p>
          </div>
        )}

        {/* Portfolio Projects - Priority for Creatives */}
        {profile.projects && profile.projects.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Portfolio Highlights
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <div style={{ display: 'grid', gap: '24px', marginTop: '20px' }}>
              {profile.projects.map((project, index) => (
                <div key={index} style={{ 
                  padding: '24px',
                  background: index % 2 === 0 
                    ? `linear-gradient(135deg, ${primaryColor}08, ${secondaryColor}05)`
                    : `linear-gradient(135deg, ${secondaryColor}08, ${accentColor}10)`,
                  borderRadius: '16px',
                  border: `2px solid ${index % 2 === 0 ? primaryColor : secondaryColor}20`,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    width: '80px',
                    height: '80px',
                    background: `${accentColor}20`,
                    borderRadius: '50%'
                  }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ 
                        fontSize: '20px', 
                        fontWeight: '700', 
                        color: index % 2 === 0 ? primaryColor : secondaryColor
                      }}>
                        <Camera size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
                        {project.name}
                      </div>
                      {(project.startDate || project.endDate) && (
                        <div style={{ fontSize: '13px', color: '#777' }}>
                          {project.startDate} – {project.endDate || 'Ongoing'}
                        </div>
                      )}
                    </div>
                    {project.description && (
                      <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#555', marginTop: '12px' }}>
                        {project.description}
                      </p>
                    )}
                    {project.technologies && project.technologies.length > 0 && (
                      <div style={{ 
                        marginTop: '14px', 
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        {project.technologies.map((tech, i) => (
                          <span key={i} style={{
                            fontSize: '12px',
                            padding: '6px 14px',
                            background: 'white',
                            color: index % 2 === 0 ? primaryColor : secondaryColor,
                            borderRadius: '20px',
                            fontWeight: '600',
                            border: `2px solid ${index % 2 === 0 ? primaryColor : secondaryColor}30`
                          }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <a href={project.link} style={{
                        display: 'inline-block',
                        marginTop: '12px',
                        fontSize: '13px',
                        color: index % 2 === 0 ? primaryColor : secondaryColor,
                        fontWeight: '600',
                        textDecoration: 'none'
                      }}>
                        View Project →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Work Experience
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <div style={{ marginTop: '20px' }}>
              {profile.experience.map((exp, index) => (
                <div key={index} style={{ 
                  marginBottom: '24px',
                  paddingBottom: '24px',
                  borderBottom: index < profile.experience!.length - 1 ? `2px dashed ${accentColor}50` : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: primaryColor }}>
                        {exp.position}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                        {exp.company}
                      </div>
                    </div>
                    <div style={{ 
                      fontSize: '13px',
                      color: '#666',
                      background: `${accentColor}30`,
                      padding: '6px 12px',
                      borderRadius: '20px',
                      height: 'fit-content'
                    }}>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </div>
                  </div>
                  {exp.description && (
                    <p style={{ fontSize: '14px', lineHeight: '1.7', marginTop: '10px', color: '#555' }}>
                      {exp.description}
                    </p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ 
                      marginTop: '10px',
                      paddingLeft: '20px',
                      fontSize: '14px',
                      lineHeight: '1.7'
                    }}>
                      {exp.achievements.map((achievement, i) => (
                        <li key={i} style={{ marginBottom: '6px', color: '#555' }}>
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

        {/* Skills & Tools */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ 
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Skills & Tools
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              marginTop: '20px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '12px 20px',
                  background: index % 3 === 0 
                    ? `${primaryColor}15` 
                    : index % 3 === 1 
                      ? `${secondaryColor}15`
                      : `${accentColor}30`,
                  color: index % 3 === 0 
                    ? primaryColor 
                    : index % 3 === 1 
                      ? secondaryColor
                      : '#D4A017',
                  borderRadius: '25px',
                  fontSize: '13px',
                  fontWeight: '600',
                  border: `2px solid ${index % 3 === 0 
                    ? primaryColor 
                    : index % 3 === 1 
                      ? secondaryColor
                      : accentColor}40`
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
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              Education
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <div style={{ marginTop: '20px', display: 'grid', gap: '16px' }}>
              {profile.education.map((edu, index) => (
                <div key={index} style={{ 
                  padding: '18px',
                  background: `${secondaryColor}08`,
                  borderRadius: '12px',
                  border: `2px solid ${secondaryColor}30`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <div>
                      <div style={{ fontSize: '17px', fontWeight: '700', color: primaryColor }}>
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                        {edu.institution}
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </div>
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
              fontSize: '26px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              position: 'relative',
              display: 'inline-block'
            }}>
              <Award size={26} style={{ display: 'inline', marginRight: '10px', verticalAlign: 'middle' }} />
              Awards & Recognition
              <div style={{
                position: 'absolute',
                bottom: '-4px',
                left: '0',
                width: '60%',
                height: '4px',
                background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
              }} />
            </h2>
            <div style={{ marginTop: '20px', display: 'grid', gap: '12px' }}>
              {profile.achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  padding: '14px 18px',
                  background: `${accentColor}15`,
                  borderRadius: '10px',
                  borderLeft: `4px solid ${primaryColor}`,
                  fontSize: '14px',
                  lineHeight: '1.7'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {typeof achievement === 'string' ? achievement : achievement.title}
                  </span>
                  {typeof achievement === 'object' && achievement.description && (
                    <span style={{ color: '#666' }}> – {achievement.description}</span>
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

export default CreativePortfolioTemplate;
