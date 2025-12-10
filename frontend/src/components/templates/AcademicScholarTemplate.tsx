import React from 'react';
import { TemplateProps } from './types';
import { Mail, Phone, MapPin, BookOpen, Award, Microscope, Users } from 'lucide-react';

const AcademicScholarTemplate: React.FC<TemplateProps> = ({ profile, customizations }) => {
  const primaryColor = customizations?.colors?.primary || '#1E3A5F';
  const secondaryColor = customizations?.colors?.secondary || '#2E5984';
  const accentColor = customizations?.colors?.accent || '#4A90D9';
  const textColor = customizations?.colors?.text || '#2C2C2C';
  const font = customizations?.font || 'Crimson Text, Georgia, serif';

  return (
    <div className="w-full bg-white" style={{ color: textColor, fontFamily: font }}>
      {/* Academic Header */}
      <div style={{ 
        background: primaryColor,
        padding: '36px 52px',
        color: 'white'
      }}>
        <h1 style={{ 
          fontSize: '38px', 
          fontWeight: '600',
          marginBottom: '6px',
          letterSpacing: '0.5px',
          fontFamily: 'Georgia, serif'
        }}>
          {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
        </h1>
        {profile.personalInfo?.title && (
          <div style={{ 
            fontSize: '17px',
            fontWeight: '400',
            marginBottom: '18px',
            opacity: 0.95,
            fontStyle: 'italic'
          }}>
            {profile.personalInfo.title}
          </div>
        )}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '20px',
          fontSize: '13px',
          opacity: 0.9
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
          {profile.contact?.website && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BookOpen size={15} />
              <span>{profile.contact.website}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '32px 52px' }}>
        {/* Research Interests / Summary */}
        {profile.summary && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '10px',
              fontFamily: 'Georgia, serif'
            }}>
              Research Interests
            </h2>
            <div style={{ 
              borderLeft: `4px solid ${accentColor}`,
              paddingLeft: '16px'
            }}>
              <p style={{ 
                fontSize: '14px',
                lineHeight: '1.8',
                textAlign: 'justify'
              }}>
                {profile.summary}
              </p>
            </div>
          </div>
        )}

        {/* Education - Priority for Academic CVs */}
        {profile.education && profile.education.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif'
            }}>
              Education
            </h2>
            {profile.education.map((edu, index) => (
              <div key={index} style={{ 
                marginBottom: '18px',
                paddingBottom: '18px',
                borderBottom: index < profile.education!.length - 1 ? `1px solid #E0E0E0` : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '3px' }}>
                      {edu.institution}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', textAlign: 'right', fontStyle: 'italic' }}>
                    {edu.startDate} – {edu.endDate || 'Present'}
                  </div>
                </div>
                {(edu.gpa || edu.honors) && (
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>
                    {edu.gpa && <span style={{ fontWeight: '600' }}>GPA: {edu.gpa}</span>}
                    {edu.gpa && edu.honors && <span> • </span>}
                    {edu.honors && <span style={{ fontStyle: 'italic' }}>{edu.honors}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Academic Appointments / Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif'
            }}>
              Academic Appointments
            </h2>
            {profile.experience.map((exp, index) => (
              <div key={index} style={{ 
                marginBottom: '20px',
                paddingBottom: '20px',
                borderBottom: index < profile.experience!.length - 1 ? `1px solid #E0E0E0` : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: primaryColor }}>
                      {exp.position}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: secondaryColor, marginTop: '2px' }}>
                      {exp.company}
                      {exp.location && <span style={{ fontWeight: '400', color: '#666' }}> • {exp.location}</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', fontStyle: 'italic' }}>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </div>
                </div>
                {exp.description && (
                  <p style={{ 
                    fontSize: '13px', 
                    lineHeight: '1.7', 
                    marginTop: '8px',
                    color: '#444',
                    textAlign: 'justify'
                  }}>
                    {exp.description}
                  </p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul style={{ 
                    marginTop: '8px',
                    paddingLeft: '20px',
                    fontSize: '13px',
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

        {/* Publications - Critical for Academic CVs */}
        {profile.publications && profile.publications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <BookOpen size={20} />
              Publications
            </h2>
            <div style={{ paddingLeft: '12px' }}>
              {profile.publications.map((pub, index) => (
                <div key={index} style={{ 
                  marginBottom: '16px',
                  paddingLeft: '20px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: accentColor
                  }} />
                  <div style={{ fontSize: '13px', lineHeight: '1.7' }}>
                    {pub.authors && pub.authors.length > 0 && (
                      <span style={{ fontWeight: '600', color: '#444' }}>
                        {pub.authors.join(', ')}.{' '}
                      </span>
                    )}
                    <span style={{ fontStyle: 'italic', color: primaryColor }}>
                      "{pub.title}."
                    </span>
                    {' '}
                    <span style={{ color: '#666' }}>
                      {pub.publisher}, {new Date(pub.date).getFullYear()}.
                    </span>
                    {pub.url && (
                      <a href={pub.url} style={{ 
                        color: accentColor, 
                        textDecoration: 'none',
                        marginLeft: '6px'
                      }}>
                        [Link]
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Projects */}
        {profile.projects && profile.projects.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Microscope size={20} />
              Research Projects
            </h2>
            {profile.projects.map((project, index) => (
              <div key={index} style={{ 
                marginBottom: '18px',
                padding: '16px',
                background: '#F8F9FA',
                borderLeft: `4px solid ${accentColor}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: primaryColor }}>
                    {project.name}
                  </div>
                  {(project.startDate || project.endDate) && (
                    <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                      {project.startDate} – {project.endDate || 'Ongoing'}
                    </div>
                  )}
                </div>
                {project.description && (
                  <p style={{ fontSize: '13px', lineHeight: '1.7', color: '#444', marginTop: '6px' }}>
                    {project.description}
                  </p>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                    <span style={{ fontWeight: '600' }}>Methods/Tools:</span> {project.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grants & Awards */}
        {profile.achievements && profile.achievements.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Award size={20} />
              Grants, Honors & Awards
            </h2>
            <div style={{ paddingLeft: '12px' }}>
              {profile.achievements.map((achievement, index) => (
                <div key={index} style={{ 
                  marginBottom: '12px',
                  paddingLeft: '20px',
                  position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '0',
                    top: '6px',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: accentColor
                  }} />
                  <div style={{ fontSize: '13px', lineHeight: '1.7' }}>
                    <span style={{ fontWeight: '700', color: primaryColor }}>
                      {typeof achievement === 'string' ? achievement : achievement.title}
                    </span>
                    {typeof achievement === 'object' && achievement.description && (
                      <span style={{ color: '#666' }}> – {achievement.description}</span>
                    )}
                    {typeof achievement === 'object' && achievement.date && (
                      <span style={{ color: '#888', fontSize: '12px', fontStyle: 'italic' }}>
                        {' '}({new Date(achievement.date).getFullYear()})
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Teaching Experience / Courses */}
        {profile.courses && profile.courses.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif'
            }}>
              Teaching & Courses
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {profile.courses.map((course, index) => (
                <div key={index} style={{ 
                  padding: '12px 16px',
                  background: '#F8F9FA',
                  borderLeft: `3px solid ${secondaryColor}`,
                  fontSize: '13px'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {course.name}
                  </span>
                  {course.institution && (
                    <span style={{ color: '#666' }}> – {course.institution}</span>
                  )}
                  {course.completionDate && (
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px', fontStyle: 'italic' }}>
                      ({new Date(course.completionDate).getFullYear()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Professional Service / Certifications */}
        {profile.certifications && profile.certifications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Users size={20} />
              Professional Service & Affiliations
            </h2>
            <div style={{ display: 'grid', gap: '10px' }}>
              {profile.certifications.map((cert, index) => (
                <div key={index} style={{ 
                  padding: '12px 16px',
                  background: '#F8F9FA',
                  borderLeft: `3px solid ${accentColor}`,
                  fontSize: '13px'
                }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
                    {cert.name}
                  </span>
                  {cert.issuer && (
                    <span style={{ color: '#666' }}> – {cert.issuer}</span>
                  )}
                  {cert.date && (
                    <span style={{ color: '#888', fontSize: '12px', marginLeft: '8px', fontStyle: 'italic' }}>
                      ({new Date(cert.date).getFullYear()})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Skills / Methodologies */}
        {profile.skills && profile.skills.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif'
            }}>
              Research Skills & Methodologies
            </h2>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px'
            }}>
              {profile.skills.map((skill, index) => (
                <div key={index} style={{
                  padding: '8px 12px',
                  background: `linear-gradient(135deg, ${accentColor}12, ${secondaryColor}08)`,
                  border: `1px solid ${accentColor}30`,
                  fontSize: '12px',
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
          <div>
            <h2 style={{ 
              fontSize: '20px',
              fontWeight: '700',
              color: primaryColor,
              marginBottom: '14px',
              fontFamily: 'Georgia, serif'
            }}>
              Languages
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {profile.languages.map((lang, index) => (
                <div key={index} style={{ fontSize: '13px' }}>
                  <span style={{ fontWeight: '700', color: primaryColor }}>
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
        borderTop: `1px solid ${accentColor}40`,
        padding: '16px 52px',
        textAlign: 'center',
        fontSize: '11px',
        color: '#999',
        fontStyle: 'italic'
      }}>
        Curriculum Vitae • {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
      </div>
    </div>
  );
};

export default AcademicScholarTemplate;
