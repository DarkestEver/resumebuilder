'use client';

import { useState, useEffect } from 'react';
import { resumeStore } from '@/stores/resumeStore';
import { profileStore } from '@/stores/profileStore';
import { ImproveContentButton } from '@/components/ai/ImproveContentButton';
import { GenerateBulletsButton } from '@/components/ai/GenerateBulletsButton';

interface ResumeCustomizerProps {
  resume: any;
  onNext: () => void;
}

export default function ResumeCustomizer({ resume, onNext }: ResumeCustomizerProps) {
  const { updateResume, isSaving } = resumeStore();
  const { profile, fetchProfile } = profileStore();
  const [customizations, setCustomizations] = useState(resume.customizations || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      await fetchProfile();
      setLoading(false);
    };
    loadProfile();
  }, [fetchProfile]);

  const handleColorChange = (key: string, value: string) => {
    const updated = {
      ...customizations,
      colors: {
        ...customizations.colors,
        [key]: value,
      },
    };
    setCustomizations(updated);
    // Auto-save colors
    updateResume(resume._id || resume.id, { customizations: updated });
  };

  const handleLayoutChange = (layout: string) => {
    const updated = {
      ...customizations,
      layout,
    };
    setCustomizations(updated);
    updateResume(resume._id || resume.id, { customizations: updated });
  };

  const handleToggleSection = (section: string) => {
    const hidden = customizations.hiddenSections || [];
    const updated = {
      ...customizations,
      hiddenSections: hidden.includes(section)
        ? hidden.filter((s: string) => s !== section)
        : [...hidden, section],
    };
    setCustomizations(updated);
    updateResume(resume._id || resume.id, { customizations: updated });
  };

  const handleSave = async () => {
    await updateResume(resume._id || resume.id, { customizations });
    onNext();
  };

  const colors = {
    primary: customizations.colors?.primary || '#2563eb',
    secondary: customizations.colors?.secondary || '#1f2937',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Customizer Panel */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6 sticky top-8 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customize Your Resume</h3>
            <p className="text-sm text-gray-600">Changes are saved automatically</p>
          </div>

          {/* Colors */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Colors</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={colors.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm text-gray-600 font-mono">{colors.primary}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={colors.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-12 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <span className="text-sm text-gray-600 font-mono">{colors.secondary}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Layout</h4>
            <select
              value={customizations.layout || 'single-column'}
              onChange={(e) => handleLayoutChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="single-column">Single Column (ATS-friendly)</option>
              <option value="two-column">Two Column (Modern)</option>
            </select>
            <p className="text-xs text-gray-500 mt-2">
              {customizations.layout === 'two-column' 
                ? '📐 Two column layout selected' 
                : '📄 Single column layout selected (recommended for ATS)'}
            </p>
          </div>

          {/* Sections */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Show/Hide Sections</h4>
            <div className="space-y-2">
              {[
                { id: 'summary', label: 'Professional Summary' },
                { id: 'experience', label: 'Work Experience' },
                { id: 'education', label: 'Education' },
                { id: 'skills', label: 'Skills' },
                { id: 'projects', label: 'Projects' },
                { id: 'languages', label: 'Languages' },
                { id: 'certifications', label: 'Certifications' },
              ].map((section) => (
                <label key={section.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={!(customizations.hiddenSections || []).includes(section.id)}
                    onChange={() => handleToggleSection(section.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{section.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
            >
              {isSaving ? '💾 Saving...' : '💾 Save & Continue to Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-lg p-8 border-2" style={{ borderColor: colors.primary }}>
          {profile ? (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-3xl font-bold mb-1" style={{ color: colors.primary }}>
                  {profile.personalInfo?.firstName} {profile.personalInfo?.lastName}
                </h2>
                <p className="text-lg text-gray-600 mb-3">{profile.personalInfo?.title || 'Professional'}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  {profile.contact?.email && <span>📧 {profile.contact.email}</span>}
                  {profile.contact?.phone && <span>📱 {profile.contact.phone}</span>}
                  {profile.contact?.location && <span>📍 {profile.contact.location}</span>}
                </div>
              </div>

              {/* Summary */}
              {!(customizations.hiddenSections || []).includes('summary') && profile.summary && (
                <div className="border-t-2 pt-4" style={{ borderColor: colors.secondary }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold" style={{ color: colors.secondary }}>
                      Professional Summary
                    </h3>
                    <ImproveContentButton
                      text={profile.summary}
                      onImproved={(improved) => {
                        console.log('Improved summary:', improved);
                      }}
                    />
                  </div>
                  <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
                </div>
              )}

              {/* Experience */}
              {!(customizations.hiddenSections || []).includes('experience') && profile.experience && profile.experience.length > 0 && (
                <div className="border-t-2 pt-4" style={{ borderColor: colors.secondary }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.secondary }}>
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {profile.experience.slice(0, 2).map((exp: any, idx: number) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <p className="font-bold text-gray-900">{exp.title}</p>
                            <p className="text-gray-600 text-sm">{exp.company}</p>
                          </div>
                          <span className="text-sm text-gray-500">
                            {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="text-gray-700 text-sm mt-1">{exp.description.slice(0, 150)}...</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {!(customizations.hiddenSections || []).includes('education') && profile.education && profile.education.length > 0 && (
                <div className="border-t-2 pt-4" style={{ borderColor: colors.secondary }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.secondary }}>
                    Education
                  </h3>
                  {profile.education.slice(0, 1).map((edu: any, idx: number) => (
                    <div key={idx}>
                      <p className="font-bold text-gray-900">{edu.degree} in {edu.field}</p>
                      <p className="text-gray-600 text-sm">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {!(customizations.hiddenSections || []).includes('skills') && profile.skills && profile.skills.length > 0 && (
                <div className="border-t-2 pt-4" style={{ borderColor: colors.secondary }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: colors.secondary }}>
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 8).map((skill: any, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-500 text-center mt-8 pt-4 border-t">
                ✨ Live preview with your profile data
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No profile data found</p>
              <a href="/profile" className="text-blue-600 hover:underline">
                Complete your profile first →
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
