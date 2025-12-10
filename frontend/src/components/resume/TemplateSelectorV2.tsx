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

// Professional Resume Templates - Enhanced 2025 Edition
const STATIC_TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  preview: string;
  category: string;
  tags: string[];
  atsScore?: number;
  badge?: string;
}> = [
  // NEW ENHANCED TEMPLATES (Phase 1 - 2025)
  { id: 'atlas', name: 'Atlas', description: '⭐ Gold Standard ATS - 100% compatibility', preview: '✨', category: 'ATS Gold', tags: ['ats', 'gold', 'perfect'], atsScore: 100, badge: '⭐ Gold Standard' },
  { id: 'oslo', name: 'Oslo', description: 'Modern Picture Resume with sidebar', preview: '📸', category: 'Picture', tags: ['photo', 'modern', 'sidebar'], atsScore: 75, badge: '📸 Photo Friendly' },
  { id: 'velocity', name: 'Velocity', description: 'Startup/Tech Dynamic with gradient', preview: '🚀', category: 'Technical', tags: ['startup', 'tech', 'gradient'], atsScore: 70, badge: '🚀 Projects First' },
  { id: 'executive-pro', name: 'Executive Pro', description: 'Senior Leadership with gold accents', preview: '💼', category: 'Executive', tags: ['c-level', 'gold', 'premium'], atsScore: 85, badge: '💎 Gold Accents' },
  { id: 'precision', name: 'Precision', description: 'Finance/Legal Traditional format', preview: '⚖️', category: 'Professional', tags: ['finance', 'legal', 'formal'], atsScore: 95, badge: '📜 Certifications' },
  { id: 'spectrum', name: 'Spectrum', description: 'Creative Bold asymmetric design', preview: '🎨', category: 'Creative', tags: ['design', 'bold', 'asymmetric'], atsScore: 60, badge: '🎭 Asymmetric' },
  { id: 'vitality', name: 'Vitality', description: 'Healthcare Professional clinical focus', preview: '⚕️', category: 'Healthcare', tags: ['medical', 'clinical', 'healthcare'], atsScore: 90, badge: '🏥 Clinical' },
  { id: 'catalyst', name: 'Catalyst', description: 'Sales & Business Dev metrics-driven', preview: '📊', category: 'Sales', tags: ['sales', 'metrics', 'revenue'], atsScore: 80, badge: '📈 Metrics' },
  { id: 'foundation', name: 'Foundation', description: 'Student/Entry-Level education first', preview: '📚', category: 'Entry-Level', tags: ['student', 'education', 'entry'], atsScore: 92, badge: '🎓 Education First' },
  { id: 'architect', name: 'Architect', description: 'Project-Based timeline design', preview: '🏗️', category: 'Specialized', tags: ['projects', 'timeline', 'visual'], atsScore: 85, badge: '⏰ Timeline' },
  
  // PHASE 3 PROFESSIONAL TEMPLATES - Industry-Specific
  { id: 'medical-pro', name: 'Medical Pro', description: 'Healthcare professionals with licenses & publications', preview: '🏥', category: 'Healthcare', tags: ['medical', 'clinical', 'licenses'], atsScore: 93, badge: '🩺 Medical' },
  { id: 'legal-counsel', name: 'Legal Counsel', description: 'Attorneys & legal professionals - formal traditional', preview: '⚖️', category: 'Legal', tags: ['attorney', 'bar', 'formal'], atsScore: 96, badge: '📜 Bar Certified' },
  { id: 'academic-scholar', name: 'Academic Scholar', description: 'Researchers & professors - publications first', preview: '📚', category: 'Academic', tags: ['research', 'phd', 'publications'], atsScore: 94, badge: '🎓 Academic CV' },
  { id: 'engineer-blueprint', name: 'Engineer Blueprint', description: 'Engineering professionals - technical projects', preview: '⚙️', category: 'Technical', tags: ['engineering', 'technical', 'projects'], atsScore: 88, badge: '🔧 Engineering' },
  { id: 'financier', name: 'Financier', description: 'Finance & banking executives - premium styling', preview: '💰', category: 'Finance', tags: ['finance', 'banking', 'executive'], atsScore: 91, badge: '💎 Finance Elite' },
  { id: 'creative-portfolio', name: 'Creative Portfolio', description: 'Designers & artists - visual portfolio focus', preview: '🎨', category: 'Creative', tags: ['design', 'art', 'portfolio'], atsScore: 68, badge: '🖼️ Portfolio' },
  { id: 'sales-pro', name: 'Sales Pro', description: 'Sales & business development - metrics driven', preview: '📈', category: 'Sales', tags: ['sales', 'b2b', 'revenue'], atsScore: 82, badge: '💼 Sales Champion' },
  { id: 'devops', name: 'DevOps', description: 'Tech & software engineers - code-focused', preview: '💻', category: 'Technical', tags: ['devops', 'software', 'tech'], atsScore: 79, badge: '⚡ Tech Pro' },
  { id: 'europass', name: 'Europass', description: 'International EU standard format - 2-column', preview: '🇪🇺', category: 'International', tags: ['europass', 'international', 'eu'], atsScore: 97, badge: '🌍 EU Standard' },
  { id: 'cxo', name: 'CXO Executive', description: 'C-suite executives - premium luxury design', preview: '👑', category: 'Executive', tags: ['c-suite', 'ceo', 'premium'], atsScore: 89, badge: '👑 C-Suite' },
  
  // Original Templates
  { id: 'executive', name: 'Executive Elite', description: 'Premium C-suite & VP resume with metrics focus', preview: '👔', category: 'Executive', tags: ['leadership', 'senior', 'enterprise'], atsScore: 85 },
  { id: 'senior-executive', name: 'Board Ready', description: 'Board members, strategic leadership, P&L excellence', preview: '💼', category: 'Executive', tags: ['c-level', 'board', 'strategy'], atsScore: 88 },
  { id: 'modern', name: 'Modern Professional', description: 'Clean, ATS-optimized with subtle accent colors', preview: '🎨', category: 'Professional', tags: ['ats', 'clean', 'versatile'], atsScore: 85 },
  { id: 'classic', name: 'Classic Serif', description: 'Timeless traditional format, maximum compatibility', preview: '📋', category: 'Professional', tags: ['traditional', 'formal', 'safe'], atsScore: 90 },
  { id: 'corporate', name: 'Corporate Edge', description: 'Finance, consulting, banking - conservative & powerful', preview: '🏢', category: 'Professional', tags: ['finance', 'consulting', 'formal'], atsScore: 90 },
  { id: 'minimal', name: 'Minimal Impact', description: 'Less is more - elegant simplicity with strong typography', preview: '⚪', category: 'Professional', tags: ['clean', 'elegant', 'simple'], atsScore: 88 },
  { id: 'technical', name: 'Tech Stack', description: 'Developer-focused with skills matrix & GitHub integration', preview: '⚙️', category: 'Technical', tags: ['developer', 'engineer', 'tech'], atsScore: 82 },
  { id: 'developer-pro', name: 'Code & Build', description: 'Full-stack, DevOps - technical projects highlighted', preview: '💻', category: 'Technical', tags: ['software', 'fullstack', 'projects'], atsScore: 80 },
  { id: 'startup', name: 'Startup Velocity', description: 'Fast-paced, agile environments - growth metrics focus', preview: '🚀', category: 'Technical', tags: ['startup', 'agile', 'growth'], atsScore: 75 },
  { id: 'creative', name: 'Creative Bold', description: 'Single column design with bold visual elements', preview: '🌈', category: 'Creative', tags: ['design', 'marketing', 'bold'], atsScore: 65 },
  { id: 'two-column-modern', name: 'Dual Column Pro', description: '2-column (70/30) - main content + skills sidebar', preview: '📑', category: 'Creative', tags: ['modern', 'visual', '2-column'], atsScore: 80 },
  { id: 'timeline', name: 'Career Timeline', description: 'Vertical timeline layout - visual career progression', preview: '📅', category: 'Creative', tags: ['visual', 'timeline', 'story'], atsScore: 70 },
  { id: 'academic', name: 'Academic Scholar', description: 'PhD, research, publications - citation-ready format', preview: '🎓', category: 'Academic', tags: ['research', 'phd', 'publications'], atsScore: 88 },
  { id: 'healthcare', name: 'Medical Professional', description: 'Doctors, nurses, healthcare - licenses & certifications', preview: '⚕️', category: 'Healthcare', tags: ['medical', 'clinical', 'licensed'], atsScore: 88 },
  { id: 'legal', name: 'Legal Advocate', description: 'Attorneys, paralegals - bar admissions & case work', preview: '⚖️', category: 'Legal', tags: ['attorney', 'law', 'bar'], atsScore: 92 },
  { id: 'sales-executive', name: 'Sales Champion', description: 'Revenue focus - quotas, deals, growth metrics prominent', preview: '📊', category: 'Sales', tags: ['sales', 'revenue', 'quotas'], atsScore: 78 },
  { id: 'marketing', name: 'Marketing Maven', description: 'Digital marketing - campaigns, ROI, brand growth', preview: '📱', category: 'Marketing', tags: ['digital', 'campaigns', 'roi'], atsScore: 72 },
  { id: 'student', name: 'Student Launch', description: 'Single column entry-level - education & projects focus', preview: '📚', category: 'Entry-Level', tags: ['student', 'graduate', 'entry'], atsScore: 85 },
  { id: 'one-page-compact', name: 'One-Page Dense', description: 'Ultra-compact single-page - tight spacing layout', preview: '📄', category: 'Compact', tags: ['compact', '1-page', 'concise'], atsScore: 82 },
  { id: 'project-based', name: 'Portfolio Showcase', description: 'Card-based layout - projects as visual cards', preview: '🎯', category: 'Specialized', tags: ['portfolio', 'projects', 'cards'], atsScore: 75 },
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
              className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-600 hover:shadow-lg transition-all text-left group relative"
            >
              {/* ATS Score Badge */}
              {template.atsScore && (
                <div
                  className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
                    template.atsScore >= 90
                      ? 'bg-green-100 text-green-700'
                      : template.atsScore >= 70
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {template.atsScore}%
                </div>
              )}

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
                </div>
              ) : (
                <div className="text-3xl mb-3">{template.preview}</div>
              )}
              
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{template.name}</h3>
              
              {/* Badge */}
              {template.badge && (
                <div className="mb-2 inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">
                  {template.badge}
                </div>
              )}
              
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">{template.description}</p>
              
              {/* Category Tag */}
              <div className="mb-3">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {template.category}
                </span>
              </div>
              
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
