'use client';

import { useState } from 'react';
import { Edit, Link as LinkIcon, Share2, ExternalLink } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'ATS-optimized clean professional layout',
    preview: '🎨 Modern Layout',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'ATS-friendly traditional format',
    preview: '📋 Classic Layout',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'ATS-optimized simple & elegant',
    preview: '⚪ Minimal Layout',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'ATS-friendly bold design',
    preview: '🌈 Creative Layout',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'ATS-optimized for senior roles',
    preview: '💼 Executive Layout',
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'ATS-friendly tech-focused',
    preview: '⚙️ Technical Layout',
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Finance, banking, consulting optimized',
    preview: '🏢 Corporate Layout',
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research, PhD, publications focused',
    preview: '🎓 Academic Layout',
  },
  {
    id: 'developer-pro',
    name: 'Developer Pro',
    description: 'Enhanced tech with GitHub projects',
    preview: '💻 Developer Layout',
  },
  {
    id: 'sales-executive',
    name: 'Sales Executive',
    description: 'Results-driven sales achievements',
    preview: '📊 Sales Layout',
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Agile, project-focused format',
    preview: '🚀 Startup Layout',
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical professionals, licenses focus',
    preview: '⚕️ Healthcare Layout',
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Attorney, bar admissions, case work',
    preview: '⚖️ Legal Layout',
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campaign ROI, brand management',
    preview: '📱 Marketing Layout',
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Entry-level, internships, projects',
    preview: '📚 Student Layout',
  },
  {
    id: 'senior-executive',
    name: 'Senior Executive',
    description: 'C-level, board experience, P&L',
    preview: '👔 Executive Layout',
  },
  {
    id: 'two-column-modern',
    name: 'Two-Column Modern',
    description: 'ATS-safe modern with sidebar',
    preview: '📑 Two-Column Layout',
  },
  {
    id: 'one-page-compact',
    name: 'One-Page Compact',
    description: 'Dense format, single page optimized',
    preview: '📄 Compact Layout',
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Career progression chronological',
    preview: '📅 Timeline Layout',
  },
  {
    id: 'project-based',
    name: 'Project-Based',
    description: 'Portfolio, case studies emphasis',
    preview: '🎯 Project Layout',
  },
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  existingResumes: any[];
  onSelectExisting: (resume: any) => void;
  onRename?: (resume: any, newName: string) => void;
  onUpdateSlug?: (resume: any, newSlug: string) => void;
}

export default function TemplateSelector({
  onSelectTemplate,
  existingResumes,
  onSelectExisting,
  onRename,
  onUpdateSlug,
}: TemplateSelectorProps) {
  const [showExisting, setShowExisting] = useState(false);
  const [editingResume, setEditingResume] = useState<any>(null);
  const [editField, setEditField] = useState<'name' | 'slug' | null>(null);
  const [editValue, setEditValue] = useState('');
  const { user } = authStore();

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">💡</div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">How Resume Builder Works</h3>
            <p className="text-sm text-blue-800">
              Each resume is a unique document with its own template and customizations. 
              You can create multiple resumes for different jobs using the same profile data.
            </p>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>• <strong>Edit existing resume:</strong> Click on any resume below to customize it</li>
              <li>• <strong>Create new resume:</strong> Choose a template and start fresh</li>
              <li>• <strong>Your profile data:</strong> Automatically used in all resumes (edit in Profile Builder)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Existing Resumes */}
      {existingResumes.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Your Saved Resumes</h2>
              <p className="text-sm text-gray-600 mt-1">Click to edit, customize, or export any resume</p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {existingResumes.length} {existingResumes.length === 1 ? 'Resume' : 'Resumes'}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingResumes.map((resume) => (
              <div
                key={resume._id || resume.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-600 hover:shadow-md transition-all group"
              >
                {/* Resume Title with Edit */}
                <div className="flex items-start justify-between mb-3">
                  {editingResume?.id === (resume._id || resume.id) && editField === 'name' ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => {
                        if (editValue.trim() && onRename) {
                          onRename(resume, editValue.trim());
                        }
                        setEditingResume(null);
                        setEditField(null);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          if (editValue.trim() && onRename) {
                            onRename(resume, editValue.trim());
                          }
                          setEditingResume(null);
                          setEditField(null);
                        }
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 border border-blue-500 rounded text-sm font-semibold"
                    />
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="font-semibold text-gray-900">{resume.name || resume.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingResume({ id: resume._id || resume.id });
                          setEditField('name');
                          setEditValue(resume.name || resume.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                        title="Rename"
                      >
                        <Edit className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">📄</span>
                </div>

                {/* Template Info */}
                <p className="text-sm text-gray-500 mb-2">
                  Template: <span className="font-medium">{resume.templateId}</span>
                </p>

                {/* Slug with Edit and Link */}
                {resume.slug && (
                  <div className="mb-2">
                    {editingResume?.id === (resume._id || resume.id) && editField === 'slug' ? (
                      <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                          if (editValue.trim() && onUpdateSlug) {
                            onUpdateSlug(resume, editValue.trim());
                          }
                          setEditingResume(null);
                          setEditField(null);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            if (editValue.trim() && onUpdateSlug) {
                              onUpdateSlug(resume, editValue.trim());
                            }
                            setEditingResume(null);
                            setEditField(null);
                          }
                        }}
                        autoFocus
                        className="w-full px-2 py-1 border border-blue-500 rounded text-xs"
                        placeholder="custom-slug"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate flex-1">/{resume.slug}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingResume({ id: resume._id || resume.id });
                            setEditField('slug');
                            setEditValue(resume.slug);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                          title="Edit slug"
                        >
                          <Edit className="w-3 h-3 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const username = user?.username || user?.email?.split('@')[0];
                            const url = `${window.location.origin}/#/${username}/${resume.slug}`;
                            navigator.clipboard.writeText(url);
                            toast.success('Link copied to clipboard!', {
                              description: `Share: /#/${username}/${resume.slug}`,
                              duration: 3000,
                            });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-opacity"
                          title="Copy link"
                        >
                          <Share2 className="w-3 h-3 text-blue-500" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Last Updated */}
                <p className="text-xs text-gray-400 mt-2">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>

                {/* Action Button */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => onSelectExisting(resume)}
                    className="w-full text-xs text-blue-600 font-medium hover:underline text-left"
                  >
                    Click to edit and customize →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Resume */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Resume</h2>
          <p className="text-gray-600 mt-1">Start a fresh resume with a professional template</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all text-left"
            >
              <div className="text-5xl mb-4">{template.preview.split(' ')[0]}</div>
              <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{template.description}</p>
              <div className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium text-center">
                Use Template
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
