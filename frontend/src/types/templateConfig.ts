/**
 * Template Generation System - Configuration Types
 * Defines the schema for dynamically generating resume templates
 */

export type LayoutType = 
  | 'single-column'           // Traditional single column
  | 'two-column'              // Two equal columns
  | 'two-column-wide'         // Two columns (70/30 split)
  | 'sidebar-left'            // Sidebar on left (30/70)
  | 'sidebar-right'           // Sidebar on right (70/30)
  | 'three-column'            // Three columns layout
  | 'modern-card'             // Card-based sections
  | 'timeline'                // Vertical timeline layout
  | 'compact-dense';          // Ultra-compact layout

export type SpacingSize = 'compact' | 'normal' | 'relaxed';
export type FontFamily = 'serif' | 'sans-serif' | 'monospace' | 'modern';
export type ColorScheme = 'black-white' | 'blue-accent' | 'gray-professional' | 'minimal-color';
export type SectionStyle = 'underline' | 'border-bottom' | 'border-top-bottom' | 'background' | 'minimal';
export type HeaderStyle = 'centered' | 'left-aligned' | 'split' | 'minimal';

export interface ColorConfig {
  primary: string;        // Main text color
  secondary: string;      // Secondary text color (dates, labels)
  accent: string;         // Accent color (headers, borders)
  background: string;     // Background color
  sectionBg?: string;     // Section background (optional)
}

export interface FontConfig {
  family: FontFamily;
  primaryFont: string;    // e.g., "Arial, sans-serif"
  secondaryFont?: string; // Optional secondary font
  sizes: {
    name: string;         // e.g., "2rem", "32px"
    title: string;        // e.g., "1rem", "16px"
    sectionHeader: string;
    body: string;
    small: string;
  };
  weights: {
    normal: number;
    semibold: number;
    bold: number;
  };
}

export interface SpacingConfig {
  size: SpacingSize;
  padding: {
    page: string;         // Overall page padding
    section: string;      // Space between sections
    subsection: string;   // Space between items in section
  };
  margins: {
    sectionHeader: string;
    paragraph: string;
    list: string;
  };
  lineHeight: {
    header: string;
    body: string;
    tight: string;
  };
}

export interface SectionConfig {
  id: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 
        'certifications' | 'achievements' | 'languages' | 'custom';
  label: string;
  style: SectionStyle;
  enabled: boolean;
  order: number;
  variant?: string;       // e.g., 'timeline', 'grid', 'list'
  showIcons?: boolean;
  icon?: string;          // Icon emoji or class
  showPhoto?: boolean;    // Show profile photo
  customOptions?: Record<string, any>;
}

export interface HeaderConfig {
  style: HeaderStyle;
  includeName: boolean;
  includeTitle: boolean;
  includeContact: boolean;
  includeLinks: boolean;
  includePhoto?: boolean;  // Show profile photo in header
  photoShape?: 'circle' | 'square' | 'rounded';
  photoSize?: string;      // e.g., "80px", "100px"
  contactFormat: 'inline' | 'stacked' | 'grid';
  separator?: string;     // e.g., "|", "•", "-"
  showLabels: boolean;    // Show "Email:", "Phone:", etc.
  showIcons?: boolean;    // Show icons for contact items
}

export interface LayoutConfig {
  type: LayoutType;
  columns?: {
    main: number;         // Main content column width (percentage)
    sidebar: number;      // Sidebar width (percentage)
  };
  sidebarSections?: string[]; // Section IDs to show in sidebar
  mainSections?: string[];    // Section IDs to show in main area
}

export interface TemplateMetadata {
  id: string;
  name: string;
  description: string;
  category: string;       // e.g., "Professional", "Creative", "Academic"
  industry?: string[];    // Target industries
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  tags: string[];
  isAtsOptimized: boolean;
  preview?: string;       // Preview image URL or emoji
  createdAt: Date;
  updatedAt: Date;
  author?: string;
}

export interface TemplateConfiguration {
  metadata: TemplateMetadata;
  layout: LayoutConfig;
  colors: ColorConfig;
  fonts: FontConfig;
  spacing: SpacingConfig;
  header: HeaderConfig;
  sections: SectionConfig[];
  customStyles?: Record<string, any>; // Additional CSS overrides
}

// Preset configurations for quick template generation
export interface TemplatePreset {
  name: string;
  baseConfig: Partial<TemplateConfiguration>;
  variations?: {
    name: string;
    overrides: Partial<TemplateConfiguration>;
  }[];
}

// Template generation request
export interface GenerateTemplateRequest {
  basePreset?: string;
  category?: string;
  industry?: string;
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'executive';
  atsOptimized?: boolean;
  customConfig?: Partial<TemplateConfiguration>;
}

// Template validation result
export interface TemplateValidationResult {
  isValid: boolean;
  isAtsCompliant: boolean;
  warnings: string[];
  errors: string[];
  score: number; // 0-100
}
