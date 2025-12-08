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
  const [customizations, setCustomizations] = useState(resume?.customizations || {});
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
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* AI Enhancement Section - Moved to Top */}
      {(resume?.data || profile) && (
        <div className="border border-purple-200 bg-purple-50 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">✨ AI Enhancements</h4>
          <div className="space-y-2">
            <p className="text-xs text-purple-700 mb-3">Improve your resume summary with AI (uses full resume context)</p>
            {(resume?.data?.summary || profile?.summary) && (
              <ImproveContentButton
                text={resume?.data?.summary || profile?.summary}
                resumeContext={resume?.data || profile}
                onImproved={async (improved) => {
                  console.log('Improved summary:', improved);
                  // Update resume with improved summary
                  const updatedData = {
                    ...resume.data,
                    summary: improved,
                  };
                  await updateResume(resume._id || resume.id, { data: updatedData });
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Info Banner - Smaller */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
        <p className="text-xs text-blue-800">
          <strong>Customize Appearance Only:</strong> Change colors, layout, and sections here. To edit content, visit <a href="/profile" className="underline font-medium">Profile page</a> and sync.
        </p>
      </div>

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
        <h4 className="font-medium text-gray-900 mb-3">Layout Style</h4>
        <select
          value={customizations.layout || 'single-column'}
          onChange={(e) => handleLayoutChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <optgroup label="Simple Layouts">
            <option value="single-column">📄 Single Column (ATS-Optimized)</option>
            <option value="two-column">📐 Two Column (50/50 Split)</option>
            <option value="two-column-wide">📊 Two Column Wide (70/30 Split)</option>
          </optgroup>
          <optgroup label="Sidebar Layouts">
            <option value="sidebar-left">◀️ Sidebar Left (30/70)</option>
            <option value="sidebar-right">▶️ Sidebar Right (70/30)</option>
          </optgroup>
          <optgroup label="Advanced Layouts">
            <option value="three-column">🗂️ Three Column</option>
            <option value="modern-card">🎴 Modern Card Layout</option>
            <option value="timeline">⏳ Timeline Layout</option>
            <option value="compact-dense">📋 Compact Dense</option>
          </optgroup>
        </select>
        <p className="text-xs text-gray-500 mt-2">
          {customizations.layout === 'single-column' && '✅ ATS-friendly layout (recommended for applicant tracking systems)'}
          {customizations.layout === 'two-column' && '📐 Modern two-column layout with balanced sections'}
          {customizations.layout === 'two-column-wide' && '📊 Two-column layout with wider main section'}
          {customizations.layout === 'sidebar-left' && '◀️ Sidebar on the left with main content on right'}
          {customizations.layout === 'sidebar-right' && '▶️ Main content on left with sidebar on right'}
          {customizations.layout === 'three-column' && '🗂️ Three-column layout for maximum information density'}
          {customizations.layout === 'modern-card' && '🎴 Card-based layout with visual separation'}
          {customizations.layout === 'timeline' && '⏳ Timeline layout with visual progression'}
          {customizations.layout === 'compact-dense' && '📋 Ultra-compact layout for one-page resumes'}
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
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700">{section.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
