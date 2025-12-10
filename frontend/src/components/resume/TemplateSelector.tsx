'use client';

import { useState, useMemo } from 'react';
import { Edit, Link as LinkIcon, Share2, Search, Filter, X, Palette } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';

// Color Palette for Templates
const COLOR_SCHEMES = [
  { id: 'default', name: 'Default', color: '#000000', description: 'Original color' },
  { id: 'navy', name: 'Professional Blue', color: '#1e3a8a', description: 'Navy blue' },
  { id: 'forest', name: 'Professional Green', color: '#15803d', description: 'Forest green' },
  { id: 'purple', name: 'Creative Purple', color: '#a855f7', description: 'Electric lilac' },
  { id: 'orange', name: 'Creative Orange', color: '#f97316', description: 'Vibrant orange' },
];

const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'ATS-optimized clean professional layout',
    preview: '🎨 Modern Layout',
    category: 'professional',
    industry: 'general',
    atsScore: 85,
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'ATS-friendly traditional format',
    preview: '📋 Classic Layout',
    category: 'traditional',
    industry: 'general',
    atsScore: 90,
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'ATS-optimized simple & elegant',
    preview: '⚪ Minimal Layout',
    category: 'professional',
    industry: 'general',
    atsScore: 88,
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'ATS-friendly bold design',
    preview: '🌈 Creative Layout',
    category: 'creative',
    industry: 'creative',
    atsScore: 65,
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'ATS-optimized for senior roles',
    preview: '💼 Executive Layout',
    category: 'executive',
    industry: 'general',
    atsScore: 85,
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'ATS-friendly tech-focused',
    preview: '⚙️ Technical Layout',
    category: 'professional',
    industry: 'tech',
    atsScore: 82,
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Finance, banking, consulting optimized',
    preview: '🏢 Corporate Layout',
    category: 'professional',
    industry: 'finance',
    atsScore: 90,
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research, PhD, publications focused',
    preview: '🎓 Academic Layout',
    category: 'professional',
    industry: 'general',
    atsScore: 88,
  },
  {
    id: 'developer-pro',
    name: 'Developer Pro',
    description: 'Enhanced tech with GitHub projects',
    preview: '💻 Developer Layout',
    category: 'professional',
    industry: 'tech',
    atsScore: 80,
  },
  {
    id: 'sales-executive',
    name: 'Sales Executive',
    description: 'Results-driven sales achievements',
    preview: '📊 Sales Layout',
    category: 'professional',
    industry: 'sales',
    atsScore: 78,
  },
  {
    id: 'startup',
    name: 'Startup',
    description: 'Agile, project-focused format',
    preview: '🚀 Startup Layout',
    category: 'professional',
    industry: 'tech',
    atsScore: 75,
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    description: 'Medical professionals, licenses focus',
    preview: '⚕️ Healthcare Layout',
    category: 'professional',
    industry: 'healthcare',
    atsScore: 88,
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Attorney, bar admissions, case work',
    preview: '⚖️ Legal Layout',
    category: 'professional',
    industry: 'legal',
    atsScore: 92,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Campaign ROI, brand management',
    preview: '📱 Marketing Layout',
    category: 'creative',
    industry: 'creative',
    atsScore: 72,
  },
  {
    id: 'student',
    name: 'Student',
    description: 'Entry-level, internships, projects',
    preview: '📚 Student Layout',
    category: 'student',
    industry: 'general',
    atsScore: 85,
  },
  {
    id: 'senior-executive',
    name: 'Senior Executive',
    description: 'C-level, board experience, P&L',
    preview: '👔 Executive Layout',
    category: 'executive',
    industry: 'general',
    atsScore: 88,
  },
  {
    id: 'two-column-modern',
    name: 'Two-Column Modern',
    description: 'ATS-safe modern with sidebar',
    preview: '📑 Two-Column Layout',
    category: 'professional',
    industry: 'general',
    atsScore: 80,
  },
  {
    id: 'one-page-compact',
    name: 'One-Page Compact',
    description: 'Dense format, single page optimized',
    preview: '📄 Compact Layout',
    category: 'professional',
    industry: 'general',
    atsScore: 82,
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Career progression chronological',
    preview: '📅 Timeline Layout',
    category: 'creative',
    industry: 'general',
    atsScore: 70,
  },
  {
    id: 'project-based',
    name: 'Project-Based',
    description: 'Portfolio, case studies emphasis',
    preview: '🎯 Project Layout',
    category: 'creative',
    industry: 'general',
    atsScore: 75,
  },
  // NEW ENHANCED TEMPLATES (2024-2025)
  {
    id: 'atlas',
    name: 'Atlas',
    description: '⭐ Gold Standard ATS - 100% compatibility',
    preview: '✨ ATS Perfect',
    badge: 'Gold Standard ATS',
    category: 'ats',
    industry: 'general',
    atsScore: 100,
  },
  {
    id: 'oslo',
    name: 'Oslo',
    description: 'Modern Picture Resume with sidebar',
    preview: '📸 Picture Layout',
    badge: 'Photo Friendly',
    category: 'picture',
    industry: 'general',
    atsScore: 75,
  },
  {
    id: 'velocity',
    name: 'Velocity',
    description: 'Startup/Tech Dynamic with gradient',
    preview: '🚀 Startup Layout',
    badge: 'Projects First',
    category: 'professional',
    industry: 'tech',
    atsScore: 70,
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    description: 'Senior Leadership with gold accents',
    preview: '💼 Executive Layout',
    badge: 'Gold Accents',
    category: 'executive',
    industry: 'general',
    atsScore: 85,
  },
  {
    id: 'precision',
    name: 'Precision',
    description: 'Finance/Legal Traditional format',
    preview: '⚖️ Finance Layout',
    badge: 'Certifications',
    category: 'professional',
    industry: 'finance',
    atsScore: 95,
  },
  {
    id: 'spectrum',
    name: 'Spectrum',
    description: 'Creative Bold asymmetric design',
    preview: '🎨 Creative Layout',
    badge: 'Asymmetric',
    category: 'creative',
    industry: 'creative',
    atsScore: 60,
  },
  {
    id: 'vitality',
    name: 'Vitality',
    description: 'Healthcare Professional clinical focus',
    preview: '⚕️ Healthcare Layout',
    badge: 'Clinical Focus',
    category: 'professional',
    industry: 'healthcare',
    atsScore: 90,
  },
  {
    id: 'catalyst',
    name: 'Catalyst',
    description: 'Sales & Business Dev metrics-driven',
    preview: '📊 Sales Layout',
    badge: 'Metrics Focused',
    category: 'professional',
    industry: 'sales',
    atsScore: 80,
  },
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Student/Entry-Level education first',
    preview: '📚 Student Layout',
    badge: 'Education First',
    category: 'student',
    industry: 'general',
    atsScore: 92,
  },
  {
    id: 'architect',
    name: 'Architect',
    description: 'Project-Based timeline design',
    preview: '🏗️ Project Layout',
    badge: 'Timeline',
    category: 'creative',
    industry: 'general',
    atsScore: 85,
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

  // Phase 2 & 3: Filters, Search, and Color Selection
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [atsScoreFilter, setAtsScoreFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string>('default');
  const [sortBy, setSortBy] = useState<'name' | 'atsScore' | 'newest'>('atsScore');

  // Filtered templates with useMemo for performance
  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATES;

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query) ||
          t.industry?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.category === selectedCategory);
    }

    // Industry filter
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter((t) => t.industry === selectedIndustry);
    }

    // ATS Score filter
    if (atsScoreFilter !== 'all') {
      filtered = filtered.filter((t) => {
        if (!t.atsScore) return false;
        if (atsScoreFilter === 'high') return t.atsScore >= 90;
        if (atsScoreFilter === 'medium') return t.atsScore >= 70 && t.atsScore < 90;
        if (atsScoreFilter === 'low') return t.atsScore < 70;
        return true;
      });
    }

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'atsScore') return (b.atsScore || 0) - (a.atsScore || 0);
      return 0; // newest
    });

    return filtered;
  }, [searchQuery, selectedCategory, selectedIndustry, atsScoreFilter, sortBy]);

  // Get unique categories and industries
  const categories = useMemo(() => {
    const cats = new Set(TEMPLATES.map((t) => t.category).filter(Boolean));
    return Array.from(cats);
  }, []);

  const industries = useMemo(() => {
    const inds = new Set(TEMPLATES.map((t) => t.industry).filter(Boolean));
    return Array.from(inds);
  }, []);

  // Handle template selection with color
  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId);
  };

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

      {/* Create New Resume - ENHANCED WITH FILTERS */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Resume</h2>
          <p className="text-gray-600 mt-1">
            Choose from {TEMPLATES.length} professional templates - Filter by category, industry, or ATS score
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates by name, category, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Filter Toggle & Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors ${
                showFilters
                  ? 'bg-blue-50 border-blue-600 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
              {(selectedCategory !== 'all' || selectedIndustry !== 'all' || atsScoreFilter !== 'all') && (
                <span className="ml-1 px-2 py-0.5 bg-blue-600 text-white text-xs rounded-full">
                  Active
                </span>
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
            >
              <option value="atsScore">Sort: Highest ATS Score</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="newest">Sort: Newest First</option>
            </select>

            <div className="ml-auto text-sm text-gray-600 font-medium">
              {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Industries</option>
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind.charAt(0).toUpperCase() + ind.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* ATS Score Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ATS Score</label>
                <select
                  value={atsScoreFilter}
                  onChange={(e) => setAtsScoreFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (90-100)</option>
                  <option value="medium">Medium (70-89)</option>
                  <option value="low">Creative (&lt;70)</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(selectedCategory !== 'all' || selectedIndustry !== 'all' || atsScoreFilter !== 'all') && (
                <div className="md:col-span-3 flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedIndustry('all');
                      setAtsScoreFilter('all');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedIndustry('all');
                setAtsScoreFilter('all');
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleTemplateSelect(template.id)}
                className="border-2 border-gray-200 rounded-lg p-6 hover:border-blue-600 hover:shadow-lg transition-all text-left group relative"
              >
                {/* ATS Score Badge */}
                {template.atsScore && (
                  <div
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${
                      template.atsScore >= 90
                        ? 'bg-green-100 text-green-700'
                        : template.atsScore >= 70
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}
                  >
                    {template.atsScore}% ATS
                  </div>
                )}

                <div className="text-5xl mb-4">{template.preview.split(' ')[0]}</div>
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                
                {/* Badge */}
                {template.badge && (
                  <div className="mt-2 inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                    {template.badge}
                  </div>
                )}

                <p className="text-sm text-gray-600 mt-2">{template.description}</p>

                {/* Category & Industry Tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {template.category && (
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {template.category}
                    </span>
                  )}
                  {template.industry && (
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                      {template.industry}
                    </span>
                  )}
                </div>

                <div className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 text-sm font-medium text-center">
                  Use Template
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
