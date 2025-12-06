'use client';

/**
 * Modern LinkedIn-Style Profile Page
 * Single-page layout with clean sections and inline validation
 */

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { profileStore } from '@/stores/profileStore';
import { authStore } from '@/stores/authStore';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Award, Code, FolderOpen, BookOpen, Globe, CheckCircle2, XCircle,
  Plus, Trash2, Building2, Calendar, MapPinned, ExternalLink
} from 'lucide-react';

export default function ModernProfilePage() {
  const { profile, isLoading, isSaving, error, completionPercentage, fetchProfile, createProfile, updateProfile } = profileStore();
  const [expandedSections, setExpandedSections] = useState<string[]>(['personal', 'contact']);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    );
  };

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
    const key = `${section}.${field}`;
    
    setValidationErrors(prev => {
      if (error) {
        return { ...prev, [key]: error };
      } else {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
    });

    if (!error) {
      try {
        const updateData: any = {};
        if (section === 'personalInfo' || section === 'contact') {
          updateData[section] = { [field]: value };
        } else {
          updateData[section] = value;
        }
        await updateProfile(updateData);
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
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(section, field, e.target.value)}
            className={`
              w-full px-3 py-2.5 ${Icon ? 'pl-10' : ''} pr-10
              border rounded-lg transition-all duration-200
              focus:outline-none focus:ring-2
              ${hasError 
                ? 'border-red-300 focus:ring-red-200 focus:border-red-500' 
                : isValid
                ? 'border-green-300 focus:ring-green-200 focus:border-green-500'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
              }
            `}
            placeholder={placeholder}
          />
          {isValid && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          )}
          {hasError && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
          )}
        </div>
        {hasError && (
          <p className="text-sm text-red-600 flex items-center mt-1">
            <XCircle className="h-4 w-4 mr-1" />
            {hasError}
          </p>
        )}
      </div>
    );
  };

  const SectionHeader = ({ icon: Icon, title, description, sectionKey, count }: any) => {
    const isExpanded = expandedSections.includes(sectionKey);
    return (
      <button
        onClick={() => toggleSection(sectionKey)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              {title}
              {count !== undefined && (
                <span className="ml-2 text-sm font-normal text-gray-500">({count})</span>
              )}
            </h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">Your Professional Profile</h1>
                <p className="text-blue-100">Complete your profile to stand out</p>
              </div>
              <div className="text-center">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      className="text-blue-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="60"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 60}`}
                      strokeDashoffset={`${2 * Math.PI * 60 * (1 - completionPercentage / 100)}`}
                      className="text-white"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold">{completionPercentage}%</span>
                  </div>
                </div>
                <p className="text-sm text-blue-100 mt-2">Complete</p>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-save Status */}
        {isSaving && (
          <div className="bg-blue-50 border-b border-blue-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center">
              <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-sm text-blue-800">Saving changes...</span>
            </div>
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-b border-red-200">
            <div className="max-w-5xl mx-auto px-4 py-4 flex items-start">
              <XCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800">Error saving profile</h4>
                <p className="text-sm text-red-700 mt-1 whitespace-pre-wrap">{error}</p>
              </div>
              <button
                onClick={() => profileStore.setState({ error: null })}
                className="ml-4 text-red-500 hover:text-red-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-4">
            {/* Personal Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={User}
                title="Personal Information"
                description="Your basic information and professional title"
                sectionKey="personal"
              />
              {expandedSections.includes('personal') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="First Name"
                      value={profile?.personalInfo?.firstName || ''}
                      onChange={handleFieldChange}
                      section="personalInfo"
                      field="firstName"
                      placeholder="John"
                      icon={User}
                      required
                    />
                    <InputField
                      label="Last Name"
                      value={profile?.personalInfo?.lastName || ''}
                      onChange={handleFieldChange}
                      section="personalInfo"
                      field="lastName"
                      placeholder="Doe"
                      icon={User}
                      required
                    />
                    <div className="md:col-span-2">
                      <InputField
                        label="Professional Title"
                        value={profile?.personalInfo?.title || ''}
                        onChange={handleFieldChange}
                        section="personalInfo"
                        field="title"
                        placeholder="Senior Software Engineer"
                        icon={Briefcase}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={Mail}
                title="Contact Information"
                description="How can people reach you?"
                sectionKey="contact"
              />
              {expandedSections.includes('contact') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                      label="Email"
                      value={profile?.contact?.email || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="email"
                      type="email"
                      placeholder="john@example.com"
                      icon={Mail}
                      required
                    />
                    <InputField
                      label="Phone"
                      value={profile?.contact?.phone || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      icon={Phone}
                    />
                    <InputField
                      label="Location"
                      value={profile?.contact?.address?.city || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="city"
                      placeholder="San Francisco, CA"
                      icon={MapPin}
                    />
                    <InputField
                      label="LinkedIn"
                      value={profile?.contact?.linkedin || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="linkedin"
                      placeholder="https://linkedin.com/in/johndoe"
                      icon={Globe}
                    />
                    <InputField
                      label="GitHub"
                      value={profile?.contact?.github || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="github"
                      placeholder="https://github.com/johndoe"
                      icon={Globe}
                    />
                    <InputField
                      label="Website"
                      value={profile?.contact?.website || ''}
                      onChange={handleFieldChange}
                      section="contact"
                      field="website"
                      placeholder="https://johndoe.com"
                      icon={Globe}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Summary Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={BookOpen}
                title="Professional Summary"
                description="Tell your professional story"
                sectionKey="summary"
              />
              {expandedSections.includes('summary') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      About You
                    </label>
                    <textarea
                      value={profile?.summary || ''}
                      onChange={(e) => handleFieldChange('summary', 'text', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none"
                      placeholder="Write a brief summary about your professional background, skills, and what makes you unique..."
                    />
                    <p className="text-sm text-gray-500 text-right">{(profile?.summary || '').length} characters</p>
                  </div>
                </div>
              )}
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={Briefcase}
                title="Work Experience"
                description="Your professional journey"
                sectionKey="experience"
                count={profile?.experience?.length || 0}
              />
              {expandedSections.includes('experience') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <p className="text-gray-500 text-center py-8">Experience editor will load here</p>
                </div>
              )}
            </div>

            {/* Education Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={GraduationCap}
                title="Education"
                description="Your academic background"
                sectionKey="education"
                count={profile?.education?.length || 0}
              />
              {expandedSections.includes('education') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <p className="text-gray-500 text-center py-8">Education editor will load here</p>
                </div>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={Award}
                title="Skills & Expertise"
                description="What are you good at?"
                sectionKey="skills"
                count={profile?.skills?.length || 0}
              />
              {expandedSections.includes('skills') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <p className="text-gray-500 text-center py-8">Skills editor will load here</p>
                </div>
              )}
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <SectionHeader
                icon={FolderOpen}
                title="Projects"
                description="Showcase your work"
                sectionKey="projects"
                count={profile?.projects?.length || 0}
              />
              {expandedSections.includes('projects') && (
                <div className="p-6 pt-0 border-t border-gray-100">
                  <p className="text-gray-500 text-center py-8">Projects editor will load here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
