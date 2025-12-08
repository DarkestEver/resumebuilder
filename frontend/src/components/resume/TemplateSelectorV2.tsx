/**
 * Enhanced Template Selector with Dynamic Templates
 * Combines static templates with generated template library
 */

'use client';

import { useState, useEffect } from 'react';
import { Edit, Link as LinkIcon, Share2 } from 'lucide-react';
import { authStore } from '@/stores/authStore';
import { toast } from 'sonner';
import TemplateStore from '@/lib/templateStore';
import useTemplateInitialization from '@/hooks/useTemplateInitialization';

// Professional Resume Templates - Redesigned for 2025
const STATIC_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  tags: string[];
  colors?: any;
  fonts?: any;
}> = [
  // Executive & Leadership
  { id: 'executive', name: 'Executive Elite', description: 'Premium C-suite & VP resume with metrics focus', preview: '👔', category: 'Executive', tags: ['leadership', 'senior', 'enterprise'] },
  { id: 'senior-executive', name: 'Board Ready', description: 'Board members, strategic leadership, P&L excellence', preview: '💼', category: 'Executive', tags: ['c-level', 'board', 'strategy'] },
  
  // Professional & Corporate
  { id: 'modern', name: 'Modern Professional', description: 'Clean, ATS-optimized with subtle accent colors', preview: '🎨', category: 'Professional', tags: ['ats', 'clean', 'versatile'] },
  { id: 'classic', name: 'Classic Serif', description: 'Timeless traditional format, maximum compatibility', preview: '📋', category: 'Professional', tags: ['traditional', 'formal', 'safe'] },
  { id: 'corporate', name: 'Corporate Edge', description: 'Finance, consulting, banking - conservative & powerful', preview: '🏢', category: 'Professional', tags: ['finance', 'consulting', 'formal'] },
  { id: 'minimal', name: 'Minimal Impact', description: 'Less is more - elegant simplicity with strong typography', preview: '⚪', category: 'Professional', tags: ['clean', 'elegant', 'simple'] },
  
  // Technical & Developer
  { id: 'technical', name: 'Tech Stack', description: 'Developer-focused with skills matrix & GitHub integration', preview: '⚙️', category: 'Technical', tags: ['developer', 'engineer', 'tech'] },
  { id: 'developer-pro', name: 'Code & Build', description: 'Full-stack, DevOps - technical projects highlighted', preview: '💻', category: 'Technical', tags: ['software', 'fullstack', 'projects'] },
  { id: 'startup', name: 'Startup Velocity', description: 'Fast-paced, agile environments - growth metrics focus', preview: '🚀', category: 'Technical', tags: ['startup', 'agile', 'growth'] },
  
  // Creative & Modern (Multi-Layout)
  { id: 'creative', name: 'Creative Bold', description: 'Single column design with bold visual elements', preview: '🌈', category: 'Creative', tags: ['design', 'marketing', 'bold', 'single-column'] },
  { id: 'two-column-modern', name: 'Dual Column Pro', description: '2-column (70/30) - main content + skills sidebar', preview: '📑', category: 'Creative', tags: ['modern', 'visual', '2-column', 'sidebar'] },
  { id: 'timeline', name: 'Career Timeline', description: 'Vertical timeline layout - visual career progression', preview: '📅', category: 'Creative', tags: ['visual', 'timeline', 'story', 'unique-layout'] },
  
  // Industry-Specific
  { id: 'academic', name: 'Academic Scholar', description: 'PhD, research, publications - citation-ready format', preview: '🎓', category: 'Academic', tags: ['research', 'phd', 'publications'] },
  { id: 'healthcare', name: 'Medical Professional', description: 'Doctors, nurses, healthcare - licenses & certifications', preview: '⚕️', category: 'Healthcare', tags: ['medical', 'clinical', 'licensed'] },
  { id: 'legal', name: 'Legal Advocate', description: 'Attorneys, paralegals - bar admissions & case work', preview: '⚖️', category: 'Legal', tags: ['attorney', 'law', 'bar'] },
  { id: 'sales-executive', name: 'Sales Champion', description: 'Revenue focus - quotas, deals, growth metrics prominent', preview: '📊', category: 'Sales', tags: ['sales', 'revenue', 'quotas'] },
  { id: 'marketing', name: 'Marketing Maven', description: 'Digital marketing - campaigns, ROI, brand growth', preview: '📱', category: 'Marketing', tags: ['digital', 'campaigns', 'roi'] },
  
  // Entry-Level & Compact
  { id: 'student', name: 'Student Launch', description: 'Single column entry-level - education & projects focus', preview: '📚', category: 'Entry-Level', tags: ['student', 'graduate', 'entry', 'single-column'] },
  { id: 'one-page-compact', name: 'One-Page Dense', description: 'Ultra-compact single-page - tight spacing layout', preview: '📄', category: 'Compact', tags: ['compact', '1-page', 'concise', 'dense-layout'] },
  
  // Specialized Layouts
  { id: 'project-based', name: 'Portfolio Showcase', description: 'Card-based layout - projects as visual cards', preview: '🎯', category: 'Specialized', tags: ['portfolio', 'projects', 'cards', 'grid-layout'] },
  { id: 'sidebar-creative', name: 'Creative Sidebar', description: 'Left sidebar (30%) - skills, right (70%) - experience', preview: '🎨', category: 'Specialized', tags: ['sidebar', 'creative', 'two-section', 'split-layout'] },
];

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
  existingResumes: any[];
  onSelectExisting: (resume: any) => void;
  onRename?: (resume: any, newName: string) => void;
  onUpdateSlug?: (resume: any, newSlug: string) => void;
}

export default function TemplateSelectorV2({
  onSelectTemplate,
  existingResumes,
  onSelectExisting,
  onRename,
  onUpdateSlug,
}: TemplateSelectorProps) {
  const [editingResume, setEditingResume] = useState<any>(null);
  const [editField, setEditField] = useState<'name' | 'slug' | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showGenerated, setShowGenerated] = useState(false);
  const { user } = authStore();

  // Initialize template system
  const { isLoaded, templateCount } = useTemplateInitialization();

  // Get generated templates
  const [generatedTemplates, setGeneratedTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);

  useEffect(() => {
    if (isLoaded) {
      const allTemplates = TemplateStore.getAll();
      setGeneratedTemplates(allTemplates);
      
      const cats = ['All', ...TemplateStore.getCategories()];
      setCategories(cats);
    }
  }, [isLoaded]);

  // Combine and filter templates
  const allTemplates = showGenerated 
    ? generatedTemplates.map(t => ({
        id: t.metadata.id,
        name: t.metadata.name,
        description: t.metadata.description,
        preview: '✨',
        category: t.metadata.category,
        colors: t.colors, // Add color info for preview
        fonts: t.fonts,   // Add font info for preview
      }))
    : STATIC_TEMPLATES;

  const filteredTemplates = selectedCategory === 'All' 
    ? allTemplates 
    : allTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Template System Info */}
      {isLoaded && templateCount > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 text-2xl">🎨</div>
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 mb-1">Dynamic Template System Active</h3>
              <p className="text-sm text-purple-800">
                {templateCount} templates generated programmatically. Switch between curated (20) and generated ({templateCount}) templates.
              </p>
              <button
                onClick={() => setShowGenerated(!showGenerated)}
                className="mt-2 px-4 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
              >
                {showGenerated ? `Show Curated Templates (20)` : `Show All Templates (${templateCount})`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Resumes Section - same as before */}
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
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-600 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => onSelectExisting(resume)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="font-semibold text-gray-900">{resume.name || resume.title}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded">📄</span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  Template: <span className="font-medium">{resume.templateId}</span>
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Resume */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Resume</h2>
          <p className="text-gray-600 mt-1">
            {showGenerated 
              ? `Choose from ${filteredTemplates.length} generated templates` 
              : 'Start with a curated professional template'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTemplates.slice(0, 40).map((template) => (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template.id)}
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-600 hover:shadow-lg transition-all text-left group"
            >
              {/* Visual Preview */}
              {template.colors ? (
                <div className="mb-3 p-3 rounded border" style={{
                  backgroundColor: template.colors?.background || '#fff',
                  borderColor: template.colors?.accent || '#000',
                }}>
                  <div className="h-2 rounded mb-1" style={{ 
                    backgroundColor: template.colors?.accent || '#000',
                    width: '60%'
                  }}></div>
                  <div className="h-1 rounded mb-1" style={{ 
                    backgroundColor: template.colors?.secondary || '#666',
                    width: '80%'
                  }}></div>
                  <div className="h-1 rounded" style={{ 
                    backgroundColor: template.colors?.primary || '#000',
                    width: '70%'
                  }}></div>
                  {template.fonts?.primaryFont && (
                    <div className="text-[8px] mt-2 opacity-50" style={{
                      fontFamily: template.fonts.primaryFont.split(',')[0] || 'inherit'
                    }}>
                      {template.fonts.family || 'Font'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-3xl mb-3">{template.preview}</div>
              )}
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{template.name}</h3>
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
              <div className="w-full px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium text-center group-hover:bg-blue-700">
                Use Template
              </div>
            </button>
          ))}
        </div>

        {filteredTemplates.length > 40 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing first 40 of {filteredTemplates.length} templates
          </div>
        )}
      </div>
    </div>
  );
}
