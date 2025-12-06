// Template exports
export { default as ModernTemplate } from './ModernTemplate';
export { default as ClassicTemplate } from './ClassicTemplate';
export { default as MinimalTemplate } from './MinimalTemplate';
export { default as CreativeTemplate } from './CreativeTemplate';
export { default as ExecutiveTemplate } from './ExecutiveTemplate';
export { default as TechnicalTemplate } from './TechnicalTemplate';

// Types
export type { TemplateProps, TemplateConfig } from './types';

// Template configuration
export const templateConfigs = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean, contemporary design with colorful accents',
    category: 'modern' as const,
    defaultColors: {
      primary: '#2563eb',
      accent: '#1e40af',
      background: '#fff'
    }
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, professional serif layout',
    category: 'classic' as const,
    defaultColors: {
      primary: '#000',
      accent: '#333',
      background: '#fff'
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimalist design with clean typography',
    category: 'minimal' as const,
    defaultColors: {
      primary: '#000',
      accent: '#666',
      background: '#fff'
    }
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold, creative design with colored sections',
    category: 'creative' as const,
    defaultColors: {
      primary: '#2c3e50',
      accent: '#ff6b6b',
      background: '#f8f9fa'
    }
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Elegant executive style with serif fonts',
    category: 'executive' as const,
    defaultColors: {
      primary: '#1a1a1a',
      accent: '#666',
      background: '#fff'
    }
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Tech-forward monospace design',
    category: 'technical' as const,
    defaultColors: {
      primary: '#0066cc',
      accent: '#333',
      background: '#fff'
    }
  }
];
