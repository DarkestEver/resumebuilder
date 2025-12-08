/**
 * Template Presets - Base configurations for template generation
 */

import { ColorConfig, FontConfig, SpacingConfig, TemplatePreset } from '@/types/templateConfig';

// Color Schemes - Professional Palettes 2025
export const COLOR_SCHEMES: Record<string, ColorConfig> = {
  'executive-black': {
    primary: '#000000',
    secondary: '#4B5563',
    accent: '#1F2937',
    background: '#FFFFFF',
    sectionBg: '#F9FAFB',
  },
  'professional-blue': {
    primary: '#0F172A',
    secondary: '#64748B',
    accent: '#2563EB',
    background: '#FFFFFF',
    sectionBg: '#F1F5F9',
  },
  'corporate-navy': {
    primary: '#1E293B',
    secondary: '#64748B',
    accent: '#0EA5E9',
    background: '#FFFFFF',
    sectionBg: '#F8FAFC',
  },
  'modern-slate': {
    primary: '#0F172A',
    secondary: '#64748B',
    accent: '#475569',
    background: '#FFFFFF',
    sectionBg: '#F1F5F9',
  },
  'minimal-charcoal': {
    primary: '#18181B',
    secondary: '#71717A',
    accent: '#3F3F46',
    background: '#FFFFFF',
    sectionBg: '#FAFAFA',
  },
  'tech-emerald': {
    primary: '#0F172A',
    secondary: '#64748B',
    accent: '#059669',
    background: '#FFFFFF',
    sectionBg: '#F0FDF4',
  },
  'creative-violet': {
    primary: '#1E1B4B',
    secondary: '#6366F1',
    accent: '#8B5CF6',
    background: '#FFFFFF',
    sectionBg: '#FAF5FF',
  },
  'energy-amber': {
    primary: '#1C1917',
    secondary: '#78716C',
    accent: '#F59E0B',
    background: '#FFFFFF',
    sectionBg: '#FFFBEB',
  },
  'bold-crimson': {
    primary: '#18181B',
    secondary: '#71717A',
    accent: '#DC2626',
    background: '#FFFFFF',
    sectionBg: '#FEF2F2',
  },
  'innovative-cyan': {
    primary: '#0C4A6E',
    secondary: '#64748B',
    accent: '#0891B2',
    background: '#FFFFFF',
    sectionBg: '#ECFEFF',
  },
};

// Font Configurations - Professional Typography 2025
export const FONT_CONFIGS: Record<string, FontConfig> = {
  'professional-sans': {
    family: 'sans-serif',
    primaryFont: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    sizes: {
      name: '2.25rem',
      title: '1.125rem',
      sectionHeader: '1rem',
      body: '0.9375rem',
      small: '0.8125rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
  'corporate-calibri': {
    family: 'sans-serif',
    primaryFont: '"Segoe UI", Calibri, "Trebuchet MS", Arial, sans-serif',
    sizes: {
      name: '2.5rem',
      title: '1.125rem',
      sectionHeader: '1rem',
      body: '0.9375rem',
      small: '0.8125rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
  'academic-serif': {
    family: 'serif',
    primaryFont: 'Times New Roman, Georgia, serif',
    sizes: {
      name: '2rem',
      title: '1rem',
      sectionHeader: '0.875rem',
      body: '0.875rem',
      small: '0.75rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
  'tech-monospace': {
    family: 'monospace',
    primaryFont: 'Consolas, Monaco, monospace',
    secondaryFont: 'Arial, sans-serif',
    sizes: {
      name: '1.875rem',
      title: '0.9rem',
      sectionHeader: '0.85rem',
      body: '0.8rem',
      small: '0.7rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
  'modern-inter': {
    family: 'modern',
    primaryFont: 'Inter, system-ui, sans-serif',
    sizes: {
      name: '2rem',
      title: '1rem',
      sectionHeader: '0.875rem',
      body: '0.875rem',
      small: '0.75rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
  'compact-small': {
    family: 'sans-serif',
    primaryFont: 'Arial, sans-serif',
    sizes: {
      name: '1.5rem',
      title: '0.75rem',
      sectionHeader: '0.7rem',
      body: '0.65rem',
      small: '0.6rem',
    },
    weights: { normal: 400, semibold: 600, bold: 700 },
  },
};

// Spacing Configurations
export const SPACING_CONFIGS: Record<string, SpacingConfig> = {
  compact: {
    size: 'compact',
    padding: {
      page: '1.5rem',
      section: '0.75rem',
      subsection: '0.5rem',
    },
    margins: {
      sectionHeader: '0.5rem',
      paragraph: '0.25rem',
      list: '0.25rem',
    },
    lineHeight: {
      header: '1.2',
      body: '1.3',
      tight: '1.1',
    },
  },
  normal: {
    size: 'normal',
    padding: {
      page: '2.5rem',
      section: '1.5rem',
      subsection: '1rem',
    },
    margins: {
      sectionHeader: '0.75rem',
      paragraph: '0.5rem',
      list: '0.5rem',
    },
    lineHeight: {
      header: '1.3',
      body: '1.5',
      tight: '1.2',
    },
  },
  relaxed: {
    size: 'relaxed',
    padding: {
      page: '3rem',
      section: '2rem',
      subsection: '1.25rem',
    },
    margins: {
      sectionHeader: '1rem',
      paragraph: '0.75rem',
      list: '0.75rem',
    },
    lineHeight: {
      header: '1.4',
      body: '1.6',
      tight: '1.3',
    },
  },
};

// Base Template Presets
export const TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  'executive-elite': {
    name: 'Executive Elite',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['executive-black'],
      fonts: FONT_CONFIGS['professional-sans'],
      spacing: SPACING_CONFIGS.relaxed,
      header: {
        style: 'left-aligned',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'stacked',
        separator: '•',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'EXECUTIVE SUMMARY', style: 'border-bottom', enabled: true, order: 1 },
        { id: 'experience', type: 'experience', label: 'LEADERSHIP EXPERIENCE', style: 'border-bottom', enabled: true, order: 2 },
        { id: 'achievements', type: 'achievements', label: 'KEY ACHIEVEMENTS', style: 'border-bottom', enabled: true, order: 3 },
        { id: 'education', type: 'education', label: 'EDUCATION & CREDENTIALS', style: 'border-bottom', enabled: true, order: 4 },
        { id: 'skills', type: 'skills', label: 'CORE COMPETENCIES', style: 'border-bottom', enabled: true, order: 5 },
      ],
      metadata: {
        id: '',
        name: 'Executive Elite',
        description: 'Premium executive resume with leadership focus',
        category: 'Executive',
        tags: ['executive', 'leadership', 'senior'],
        isAtsOptimized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
  
  'modern-professional': {
    name: 'Modern Professional',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['professional-blue'],
      fonts: FONT_CONFIGS['professional-sans'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'PROFESSIONAL SUMMARY', style: 'border-top-bottom', enabled: true, order: 1 },
        { id: 'experience', type: 'experience', label: 'WORK EXPERIENCE', style: 'border-top-bottom', enabled: true, order: 2 },
        { id: 'skills', type: 'skills', label: 'KEY SKILLS', style: 'border-top-bottom', enabled: true, order: 3 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'border-top-bottom', enabled: true, order: 4 },
        { id: 'certifications', type: 'certifications', label: 'CERTIFICATIONS', style: 'border-top-bottom', enabled: true, order: 5 },
      ],
      metadata: {
        id: '',
        name: 'Modern Professional',
        description: 'Clean modern resume with accent colors',
        category: 'Professional',
        tags: ['modern', 'professional', 'ats'],
        isAtsOptimized: true,
        experienceLevel: 'mid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  'tech-stack': {
    name: 'Tech Stack Pro',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['minimal-mono'],
      fonts: FONT_CONFIGS['tech-monospace'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'left-aligned',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'SUMMARY', style: 'underline', enabled: true, order: 1 },
        { id: 'skills', type: 'skills', label: 'TECHNICAL SKILLS', style: 'underline', enabled: true, order: 2, variant: 'pipe-separated' },
        { id: 'projects', type: 'projects', label: 'PROJECTS', style: 'underline', enabled: true, order: 3 },
        { id: 'experience', type: 'experience', label: 'EXPERIENCE', style: 'underline', enabled: true, order: 4 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'underline', enabled: true, order: 5 },
      ],
      metadata: {
        id: '',
        name: 'Tech Developer',
        description: 'Developer-focused technical template',
        category: 'Technical',
        industry: ['Technology', 'Software'],
        tags: ['tech', 'developer', 'engineer'],
        isAtsOptimized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  'academic-research': {
    name: 'Academic Research',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['black-white'],
      fonts: FONT_CONFIGS['academic-serif'],
      spacing: SPACING_CONFIGS.relaxed,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'stacked',
        showLabels: false,
      },
      sections: [
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'border-bottom', enabled: true, order: 1 },
        { id: 'custom-research', type: 'custom', label: 'RESEARCH INTERESTS', style: 'border-bottom', enabled: true, order: 2 },
        { id: 'custom-publications', type: 'custom', label: 'PUBLICATIONS', style: 'border-bottom', enabled: true, order: 3 },
        { id: 'experience', type: 'experience', label: 'ACADEMIC EXPERIENCE', style: 'border-bottom', enabled: true, order: 4 },
        { id: 'achievements', type: 'achievements', label: 'AWARDS & HONORS', style: 'border-bottom', enabled: true, order: 5 },
      ],
      metadata: {
        id: '',
        name: 'Academic Research',
        description: 'Academic and research template',
        category: 'Academic',
        industry: ['Education', 'Research'],
        tags: ['academic', 'research', 'phd'],
        isAtsOptimized: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // NEW: Templates with Icons and Photos
  'modern-with-photo': {
    name: 'Modern with Photo',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['creative-teal'],
      fonts: FONT_CONFIGS['modern-inter'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        includePhoto: true,
        photoShape: 'circle',
        photoSize: '100px',
        contactFormat: 'grid',
        showLabels: false,
        showIcons: true,
      },
      sections: [
        { id: 'summary', type: 'summary', label: '💼 PROFESSIONAL SUMMARY', style: 'background', enabled: true, order: 1, showIcons: true },
        { id: 'skills', type: 'skills', label: '🎯 SKILLS', style: 'background', enabled: true, order: 2, showIcons: true },
        { id: 'experience', type: 'experience', label: '💻 EXPERIENCE', style: 'background', enabled: true, order: 3, showIcons: true },
        { id: 'education', type: 'education', label: '🎓 EDUCATION', style: 'background', enabled: true, order: 4, showIcons: true },
      ],
      metadata: {
        id: '',
        name: 'Modern with Photo',
        description: 'Modern design with profile photo and icons',
        category: 'Modern',
        tags: ['photo', 'icons', 'modern', 'visual'],
        isAtsOptimized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  'creative-icons': {
    name: 'Creative with Icons',
    baseConfig: {
      layout: {
        type: 'two-column',
        columns: { main: 65, sidebar: 35 },
      },
      colors: COLOR_SCHEMES['vibrant-orange'],
      fonts: FONT_CONFIGS['modern-inter'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'left-aligned',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        includePhoto: true,
        photoShape: 'rounded',
        photoSize: '120px',
        contactFormat: 'stacked',
        showLabels: false,
        showIcons: true,
      },
      sections: [
        { id: 'summary', type: 'summary', label: '📝 ABOUT ME', style: 'background', enabled: true, order: 1, showIcons: true },
        { id: 'experience', type: 'experience', label: '💼 WORK EXPERIENCE', style: 'background', enabled: true, order: 2, showIcons: true },
        { id: 'skills', type: 'skills', label: '⚡ SKILLS', style: 'background', enabled: true, order: 3, showIcons: true },
        { id: 'education', type: 'education', label: '📚 EDUCATION', style: 'background', enabled: true, order: 4, showIcons: true },
      ],
      metadata: {
        id: '',
        name: 'Creative with Icons',
        description: 'Creative two-column layout with emoji icons',
        category: 'Creative',
        tags: ['creative', 'icons', 'two-column', 'visual'],
        isAtsOptimized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  'tech-visual': {
    name: 'Tech Visual',
    baseConfig: {
      layout: {
        type: 'single-column',
      },
      colors: COLOR_SCHEMES['tech-cyan'],
      fonts: FONT_CONFIGS['tech-monospace'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'split',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        includePhoto: true,
        photoShape: 'square',
        photoSize: '90px',
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
        showIcons: true,
      },
      sections: [
        { id: 'skills', type: 'skills', label: '⚙️ TECHNICAL SKILLS', style: 'background', enabled: true, order: 1, showIcons: true },
        { id: 'experience', type: 'experience', label: '🚀 PROJECTS & EXPERIENCE', style: 'background', enabled: true, order: 2, showIcons: true },
        { id: 'education', type: 'education', label: '🎓 EDUCATION & CERTIFICATIONS', style: 'background', enabled: true, order: 3, showIcons: true },
      ],
      metadata: {
        id: '',
        name: 'Tech Visual',
        description: 'Tech-focused with icons and visual elements',
        category: 'Technical',
        industry: ['Technology'],
        tags: ['tech', 'visual', 'icons', 'developer'],
        isAtsOptimized: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // Two-Column Wide Layout (70/30)
  'two-column-wide': {
    name: 'Two-Column Professional',
    baseConfig: {
      layout: {
        type: 'two-column-wide',
      },
      colors: COLOR_SCHEMES['professional-blue'],
      fonts: FONT_CONFIGS['professional-sans'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
      },
      sections: [
        // Main column (70% - left)
        { id: 'summary', type: 'summary', label: 'PROFESSIONAL SUMMARY', style: 'border-bottom', enabled: true, order: 1 },
        { id: 'experience', type: 'experience', label: 'WORK EXPERIENCE', style: 'border-bottom', enabled: true, order: 2 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'border-bottom', enabled: true, order: 3 },
        // Sidebar (30% - right)
        { id: 'skills', type: 'skills', label: 'SKILLS', style: 'background', enabled: true, order: 4 },
        { id: 'certifications', type: 'certifications', label: 'CERTIFICATIONS', style: 'background', enabled: true, order: 5 },
        { id: 'languages', type: 'languages', label: 'LANGUAGES', style: 'background', enabled: true, order: 6 },
      ],
      metadata: {
        id: '',
        name: 'Two-Column Professional',
        description: 'Modern two-column layout with skills sidebar',
        category: 'Professional',
        tags: ['two-column', 'modern', 'sidebar'],
        isAtsOptimized: true,
        experienceLevel: 'mid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // Sidebar Left Layout
  'sidebar-left': {
    name: 'Sidebar Left Creative',
    baseConfig: {
      layout: {
        type: 'sidebar-left',
      },
      colors: COLOR_SCHEMES['creative-violet'],
      fonts: FONT_CONFIGS['professional-sans'],
      spacing: SPACING_CONFIGS.normal,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'stacked',
        separator: '•',
        showLabels: false,
      },
      sections: [
        // Sidebar (30% - left)
        { id: 'skills', type: 'skills', label: 'SKILLS', style: 'background', enabled: true, order: 1 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'background', enabled: true, order: 2 },
        { id: 'certifications', type: 'certifications', label: 'CERTIFICATIONS', style: 'background', enabled: true, order: 3 },
        { id: 'languages', type: 'languages', label: 'LANGUAGES', style: 'background', enabled: true, order: 4 },
        // Main column (70% - right)
        { id: 'summary', type: 'summary', label: 'ABOUT ME', style: 'border-bottom', enabled: true, order: 5 },
        { id: 'experience', type: 'experience', label: 'EXPERIENCE', style: 'border-bottom', enabled: true, order: 6 },
        { id: 'projects', type: 'projects', label: 'PROJECTS', style: 'border-bottom', enabled: true, order: 7 },
      ],
      metadata: {
        id: '',
        name: 'Sidebar Left Creative',
        description: 'Creative layout with left sidebar for skills',
        category: 'Creative',
        tags: ['sidebar', 'creative', 'modern'],
        isAtsOptimized: false,
        experienceLevel: 'mid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // Compact Dense Layout
  'compact-dense': {
    name: 'Compact One-Page',
    baseConfig: {
      layout: {
        type: 'compact-dense',
      },
      colors: COLOR_SCHEMES['minimal-charcoal'],
      fonts: FONT_CONFIGS['compact-small'],
      spacing: SPACING_CONFIGS.compact,
      header: {
        style: 'left-aligned',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '|',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'SUMMARY', style: 'minimal', enabled: true, order: 1 },
        { id: 'skills', type: 'skills', label: 'SKILLS', style: 'minimal', enabled: true, order: 2 },
        { id: 'experience', type: 'experience', label: 'EXPERIENCE', style: 'minimal', enabled: true, order: 3 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'minimal', enabled: true, order: 4 },
      ],
      metadata: {
        id: '',
        name: 'Compact One-Page',
        description: 'Ultra-compact single-page resume',
        category: 'Compact',
        tags: ['compact', 'one-page', 'dense'],
        isAtsOptimized: true,
        experienceLevel: 'entry',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // Timeline Layout
  'timeline-layout': {
    name: 'Career Timeline',
    baseConfig: {
      layout: {
        type: 'timeline',
      },
      colors: COLOR_SCHEMES['innovative-cyan'],
      fonts: FONT_CONFIGS['professional-sans'],
      spacing: SPACING_CONFIGS.relaxed,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'PROFESSIONAL PROFILE', style: 'border-top-bottom', enabled: true, order: 1 },
        { id: 'experience', type: 'experience', label: 'CAREER TIMELINE', style: 'border-top-bottom', enabled: true, order: 2 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'border-top-bottom', enabled: true, order: 3 },
        { id: 'skills', type: 'skills', label: 'CORE COMPETENCIES', style: 'border-top-bottom', enabled: true, order: 4 },
      ],
      metadata: {
        id: '',
        name: 'Career Timeline',
        description: 'Visual timeline showing career progression',
        category: 'Creative',
        tags: ['timeline', 'visual', 'creative'],
        isAtsOptimized: false,
        experienceLevel: 'senior',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },

  // Modern Card Layout
  'modern-card': {
    name: 'Modern Card Style',
    baseConfig: {
      layout: {
        type: 'modern-card',
      },
      colors: COLOR_SCHEMES['tech-emerald'],
      fonts: FONT_CONFIGS['modern-inter'],
      spacing: SPACING_CONFIGS.relaxed,
      header: {
        style: 'centered',
        includeName: true,
        includeTitle: true,
        includeContact: true,
        includeLinks: true,
        contactFormat: 'inline',
        separator: '•',
        showLabels: false,
      },
      sections: [
        { id: 'summary', type: 'summary', label: 'ABOUT', style: 'background', enabled: true, order: 1 },
        { id: 'experience', type: 'experience', label: 'EXPERIENCE', style: 'background', enabled: true, order: 2 },
        { id: 'skills', type: 'skills', label: 'SKILLS', style: 'background', enabled: true, order: 3 },
        { id: 'projects', type: 'projects', label: 'PROJECTS', style: 'background', enabled: true, order: 4 },
        { id: 'education', type: 'education', label: 'EDUCATION', style: 'background', enabled: true, order: 5 },
      ],
      metadata: {
        id: '',
        name: 'Modern Card Style',
        description: 'Card-based sections with rounded corners',
        category: 'Modern',
        tags: ['modern', 'cards', 'visual'],
        isAtsOptimized: false,
        experienceLevel: 'mid',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    },
  },
};

// Industry-specific overrides
export const INDUSTRY_OVERRIDES: Record<string, Partial<any>> = {
  healthcare: {
    sections: [
      { id: 'certifications', type: 'certifications', label: 'LICENSES & CERTIFICATIONS', style: 'border-bottom', enabled: true, order: 1 },
      { id: 'summary', type: 'summary', label: 'PROFESSIONAL SUMMARY', style: 'border-bottom', enabled: true, order: 2 },
    ],
  },
  legal: {
    sections: [
      { id: 'certifications', type: 'certifications', label: 'BAR ADMISSIONS', style: 'border-bottom', enabled: true, order: 1 },
      { id: 'skills', type: 'skills', label: 'AREAS OF PRACTICE', style: 'border-bottom', enabled: true, order: 2 },
    ],
  },
  sales: {
    sections: [
      { id: 'achievements', type: 'achievements', label: 'KEY ACHIEVEMENTS', style: 'border-bottom', enabled: true, order: 1 },
      { id: 'summary', type: 'summary', label: 'PROFESSIONAL SUMMARY', style: 'border-bottom', enabled: true, order: 2 },
    ],
  },
};
