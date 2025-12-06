'use client';

/**
 * Modern LinkedIn-Style Profile Page
 * Clean single-page layout inspired by LinkedIn's design
 */

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Globe, CheckCircle2, XCircle, Plus, Trash2, 
  Building2, Calendar, Edit2, Languages, FolderOpen
} from 'lucide-react';

interface ValidationErrors {
  [key: string]: string;
}

export default function ModernProfilePage() {
  const { profile, isLoading, isSaving, error, completionPercentage, fetchProfile, createProfile, updateProfile } = profileStore();
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [expandedSections, setExpandedSections] = useState<string[]>(['profile', 'contact']);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const validateField = (section: string, field: string, value: any): string | null => {
    if (section === 'personalInfo') {
      if (field === 'firstName' && (!value || value.trim().length < 2)) {
        return 'First name must be at least 2 characters';
      }
      if (field === 'lastName' && (!value || value.trim().length < 2)) {
        return 'Last name must be at least 2 characters';
      }
      if (field === 'title' && (!value || value.trim().length < 3)) {
        return 'Professional title must be at least 3 characters';
      }
    }
    if (section === 'contact') {
      if (field === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }
      if (field === 'phone' && value && !/^[\d\s\-\+\(\)]+$/.test(value)) {
        return 'Please enter a valid phone number';
      }
      if (field === 'linkedin' && value && !value.includes('linkedin.com')) {
        return 'Please enter a valid LinkedIn URL';
      }
    }
    return null;
  };

  const handleFieldChange = async (section: string, field: string, value: any) => {
    const error = validateField(section, field, value);
    const errorKey = `${section}.${field}`;
    
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [errorKey]: error };
      } else {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      }
    });

    if (!error) {
      try {
        await updateProfile({ [section]: { [field]: value } });
      } catch (err) {
        console.error('Update failed:', err);
      }
    }
  };

  const handleCreateProfile = async () => {
    try {
      const authState = authStore.getState();
      const user = authState.user;
      const nameParts = user?.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      await createProfile({
        personalInfo: { firstName, lastName },
        contact: { email: user?.email || '' },
      });
      await fetchProfile();
    } catch (error) {
      console.error('Failed to create profile:', error);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Profile</h2>
            <p className="text-gray-600 mb-6">Start building your professional profile to unlock all features</p>
            <button 
              onClick={handleCreateProfile}
              disabled={isSaving}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium w-full"
            >
              {isSaving ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    section, 
    field, 
    type = 'text', 
    placeholder,
    icon: Icon,
    required = false
  }: any) => {
    const errorKey = `${section}.${field}`;
    const hasError = validationErrors[errorKey];
    const isValid = required && value && !hasError;

    return (
      <div className="space-y-1.5">
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(section, field, e.target.value)}
            className={`
              w-full px-3 py-2.5 ${Icon ? 'pl-10' : ''} pr-10
              border rounded-md transition-all duration-200 text-sm
              focus:outline-none focus:ring-1
              ${hasError 
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                : isValid
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }
            `}
            placeholder={placeholder}
          />
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
          )}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <XCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-xs text-red-600 flex items-center mt-1">
            <XCircle className="h-3 w-3 mr-1" />
            {hasError}
          </p>
        )}
      </div>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        {/* Header with Cover Image */}
        <div className="bg-white border-b border-gray-200">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 relative">
            <button className="absolute top-4 right-4 px-4 py-2 bg-white text-blue-600 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit cover
            </button>
          </div>

          {/* Profile Header */}
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative">
              {/* Profile Photo */}
              <div className="absolute -top-20 left-0">
                <div className="w-40 h-40 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                  {profile.personalInfo?.photo ? (
                    <img src={profile.personalInfo.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-24 pb-6 ml-0 lg:ml-48">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
                    </h1>
                    <p className="text-lg text-gray-700 mt-1">
                      {profile.personalInfo?.title || 'Add your professional title'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      {profile.contact?.address?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {profile.contact.address.city}, {profile.contact.address.state || profile.contact.address.country}
                        </span>
                      )}
                      {profile.contact?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-4 h-4" />
                          {profile.contact.email}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      {profile.contact?.linkedin && (
                        <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          LinkedIn
                        </a>
                      )}
                      {profile.contact?.github && (
                        <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {profile.contact?.website && (
                        <a href={profile.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
                          <Globe className="w-4 h-4" />
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Completion Badge */}
                  <div className="text-center bg-gray-50 px-6 py-3 rounded-lg border border-gray-200">
                    <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
                    <div className="text-xs text-gray-600 mt-1">Profile Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-save & Error Indicators */}
        {isSaving && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-6xl mx-auto px-6 py-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 mr-2 rounded-full"></div>
              <span className="text-sm text-blue-800">Saving changes...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Error saving profile</h4>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{error}</p>
              </div>
              <button
                onClick={() => profileStore.setState({ error: null })}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-4">
              {/* About Section */}
              <ProfileSection 
                title="About" 
                icon={User}
                onEdit={() => toggleSection('about')}
              >
                {profile.summary ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{profile.summary}</p>
                ) : (
                  <p className="text-gray-400 italic">Add a summary about yourself</p>
                )}
              </ProfileSection>

              {/* Experience Section */}
              <ExperienceSection experience={profile.experience || []} />

              {/* Education Section */}
              <EducationSection education={profile.education || []} />

              {/* Skills Section */}
              <SkillsSection skills={profile.skills || []} />

              {/* Projects Section */}
              {profile.projects && profile.projects.length > 0 && (
                <ProjectsSection projects={profile.projects} />
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-4">
              {/* Languages */}
              {profile.languages && profile.languages.length > 0 && (
                <ProfileSection title="Languages" icon={Languages} compact>
                  <div className="space-y-3">
                    {profile.languages.map((lang: any, idx: number) => (
                      <div key={idx}>
                        <div className="font-medium text-gray-900">{lang.name || lang}</div>
                        {lang.proficiency && (
                          <div className="text-sm text-gray-600">{lang.proficiency}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ProfileSection>
              )}

              {/* Certifications */}
              {profile.certifications && profile.certifications.length > 0 && (
                <ProfileSection title="Certifications" icon={Award} compact>
                  <div className="space-y-3">
                    {profile.certifications.map((cert: any, idx: number) => (
                      <div key={idx}>
                        <div className="font-medium text-gray-900">{cert.name}</div>
                        {cert.issuer && (
                          <div className="text-sm text-gray-600">{cert.issuer}</div>
                        )}
                        {cert.date && (
                          <div className="text-xs text-gray-500">{cert.date}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ProfileSection>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Reusable Section Component
function ProfileSection({ title, icon: Icon, children, onEdit, compact = false }: any) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" />}
          {title}
        </h2>
        {onEdit && (
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-700 p-2">
            <Edit2 className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// Experience Section Component
function ExperienceSection({ experience }: any) {
  return (
    <ProfileSection title="Experience" icon={Briefcase}>
      {experience.length === 0 ? (
        <p className="text-gray-400 italic">No experience added yet</p>
      ) : (
        <div className="space-y-6">
          {experience.map((exp: any, idx: number) => (
            <div key={idx} className="flex gap-4">
              {/* Company Logo Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              {/* Experience Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                <div className="text-gray-700">{exp.company}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Start'} - {' '}
                    {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'End'}
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{exp.location}</span>
                  </div>
                )}
                {exp.description && (
                  <p className="text-gray-700 mt-2 text-sm whitespace-pre-wrap">{exp.description}</p>
                )}
                {exp.achievements && exp.achievements.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {exp.achievements.map((achievement: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}

// Education Section Component
function EducationSection({ education }: any) {
  return (
    <ProfileSection title="Education" icon={GraduationCap}>
      {education.length === 0 ? (
        <p className="text-gray-400 italic">No education added yet</p>
      ) : (
        <div className="space-y-6">
          {education.map((edu: any, idx: number) => (
            <div key={idx} className="flex gap-4">
              {/* School Logo Placeholder */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-gray-400" />
                </div>
              </div>

              {/* Education Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{edu.institution}</h3>
                <div className="text-gray-700">{edu.degree}</div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {edu.startDate ? new Date(edu.startDate).getFullYear() : 'Start'} - {' '}
                    {edu.current ? 'Present' : edu.endDate ? new Date(edu.endDate).getFullYear() : 'End'}
                  </span>
                </div>
                {edu.gpa && (
                  <div className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}

// Skills Section Component
function SkillsSection({ skills }: any) {
  return (
    <ProfileSection title="Skills" icon={Award}>
      {skills.length === 0 ? (
        <p className="text-gray-400 italic">No skills added yet</p>
      ) : (
        <div className="space-y-4">
          {skills.map((skill: any, idx: number) => (
            <div key={idx}>
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-900">{skill.name || skill}</div>
                {skill.endorsements && (
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{skill.endorsements} endorsement{skill.endorsements !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              {skill.category && (
                <div className="text-sm text-gray-600">{skill.category}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProfileSection>
  );
}

// Projects Section Component
function ProjectsSection({ projects }: any) {
  return (
    <ProfileSection title="Projects" icon={FolderOpen}>
      <div className="space-y-4">
        {projects.map((project: any, idx: number) => (
          <div key={idx}>
            <h3 className="font-semibold text-gray-900">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-gray-700 mt-1">{project.description}</p>
            )}
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map((tech: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ProfileSection>
  );
}
