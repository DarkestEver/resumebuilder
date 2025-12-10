'use client';

import { useEffect, useState } from 'react';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';
import CorporateTemplate from '@/components/templates/CorporateTemplate';
import AcademicTemplate from '@/components/templates/AcademicTemplate';
import DeveloperProTemplate from '@/components/templates/DeveloperProTemplate';
import SalesExecutiveTemplate from '@/components/templates/SalesExecutiveTemplate';
import StartupTemplate from '@/components/templates/StartupTemplate';
import HealthcareTemplate from '@/components/templates/HealthcareTemplate';
import LegalTemplate from '@/components/templates/LegalTemplate';
import MarketingTemplate from '@/components/templates/MarketingTemplate';
import StudentTemplate from '@/components/templates/StudentTemplate';
import SeniorExecutiveTemplate from '@/components/templates/SeniorExecutiveTemplate';
import TwoColumnModernTemplate from '@/components/templates/TwoColumnModernTemplate';
import OnePageCompactTemplate from '@/components/templates/OnePageCompactTemplate';
import TimelineTemplate from '@/components/templates/TimelineTemplate';
import ProjectBasedTemplate from '@/components/templates/ProjectBasedTemplate';
import AtlasTemplate from '@/components/templates/AtlasTemplate';
import OsloTemplate from '@/components/templates/OsloTemplate';
import VelocityTemplate from '@/components/templates/VelocityTemplate';
import ExecutiveProTemplate from '@/components/templates/ExecutiveProTemplate';
import PrecisionTemplate from '@/components/templates/PrecisionTemplate';
import SpectrumTemplate from '@/components/templates/SpectrumTemplate';
import VitalityTemplate from '@/components/templates/VitalityTemplate';
import CatalystTemplate from '@/components/templates/CatalystTemplate';
import FoundationTemplate from '@/components/templates/FoundationTemplate';
import ArchitectTemplate from '@/components/templates/ArchitectTemplate';
import MedicalProTemplate from '@/components/templates/MedicalProTemplate';
import LegalCounselTemplate from '@/components/templates/LegalCounselTemplate';
import AcademicScholarTemplate from '@/components/templates/AcademicScholarTemplate';
import EngineerBlueprintTemplate from '@/components/templates/EngineerBlueprintTemplate';
import FinancierTemplate from '@/components/templates/FinancierTemplate';
import CreativePortfolioTemplate from '@/components/templates/CreativePortfolioTemplate';
import SalesProTemplate from '@/components/templates/SalesProTemplate';
import DevOpsTemplate from '@/components/templates/DevOpsTemplate';
import EuropassTemplate from '@/components/templates/EuropassTemplate';
import CXOTemplate from '@/components/templates/CXOTemplate';
import DynamicTemplate from '@/components/templates/DynamicTemplate';
import TemplateStore from '@/lib/templateStore';

interface TemplateRendererProps {
  templateId: string;
  profile: any;
  customizations?: any;
}

export default function TemplateRenderer({ templateId, profile, customizations }: TemplateRendererProps) {
  const [dynamicConfig, setDynamicConfig] = useState<any>(null);

  // Debug logging
  console.log('TemplateRenderer - templateId:', templateId);
  console.log('TemplateRenderer - profile:', profile);
  console.log('TemplateRenderer - customizations:', customizations);

  // Static template mappings
  const staticTemplates: Record<string, any> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    minimalist: MinimalTemplate, // alias
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    technical: TechnicalTemplate,
    corporate: CorporateTemplate,
    academic: AcademicTemplate,
    'developer-pro': DeveloperProTemplate,
    'sales-executive': SalesExecutiveTemplate,
    startup: StartupTemplate,
    healthcare: HealthcareTemplate,
    legal: LegalTemplate,
    marketing: MarketingTemplate,
    student: StudentTemplate,
    'senior-executive': SeniorExecutiveTemplate,
    'two-column-modern': TwoColumnModernTemplate,
    'one-page-compact': OnePageCompactTemplate,
    timeline: TimelineTemplate,
    'project-based': ProjectBasedTemplate,
    // NEW ENHANCED TEMPLATES
    atlas: AtlasTemplate,
    oslo: OsloTemplate,
    velocity: VelocityTemplate,
    'executive-pro': ExecutiveProTemplate,
    precision: PrecisionTemplate,
    spectrum: SpectrumTemplate,
    vitality: VitalityTemplate,
    catalyst: CatalystTemplate,
    foundation: FoundationTemplate,
    architect: ArchitectTemplate,
    // PHASE 3 PROFESSIONAL TEMPLATES
    'medical-pro': MedicalProTemplate,
    'legal-counsel': LegalCounselTemplate,
    'academic-scholar': AcademicScholarTemplate,
    'engineer-blueprint': EngineerBlueprintTemplate,
    financier: FinancierTemplate,
    'creative-portfolio': CreativePortfolioTemplate,
    'sales-pro': SalesProTemplate,
    devops: DevOpsTemplate,
    europass: EuropassTemplate,
    cxo: CXOTemplate,
  };

  useEffect(() => {
    // If customizations.layout is specified, create a dynamic config with that layout
    if (customizations?.layout) {
      const layoutType = customizations.layout;
      
      const config: any = {
        layout: {
          type: layoutType,
        },
        colors: {
          primary: customizations?.colors?.primary || '#000000',
          secondary: customizations?.colors?.secondary || '#1F2937',
          accent: customizations?.colors?.primary || '#2563eb',
          background: '#FFFFFF',
          text: '#000000',
        },
        fonts: {
          primaryFont: 'Inter, system-ui, sans-serif',
          secondaryFont: 'Georgia, serif',
          sizes: {
            name: '2rem',
            title: '1.25rem',
            sectionHeader: '1.125rem',
            subsectionHeader: '1rem',
            body: '0.875rem',
            small: '0.75rem',
          },
          weights: {
            normal: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
          },
        },
        spacing: {
          padding: {
            page: '2rem',
            section: '1.5rem',
            subsection: '1rem',
          },
          margins: {
            sectionHeader: '0.5rem',
            subsectionHeader: '0.25rem',
            paragraph: '0.5rem',
          },
          lineHeight: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
            body: 1.6,
          },
        },
        header: {
          style: 'left',
          includeName: true,
          includeTitle: true,
          includeContact: true,
          includeLinks: true,
          contactFormat: 'inline',
          separator: '|',
          showLabels: false,
        },
        sections: [
          { id: 'summary', type: 'summary', label: 'PROFESSIONAL SUMMARY', style: 'default', enabled: !customizations.hiddenSections?.includes('summary'), order: 1 },
          { id: 'experience', type: 'experience', label: 'PROFESSIONAL EXPERIENCE', style: 'default', enabled: !customizations.hiddenSections?.includes('experience'), order: 2 },
          { id: 'education', type: 'education', label: 'EDUCATION', style: 'default', enabled: !customizations.hiddenSections?.includes('education'), order: 3 },
          { id: 'skills', type: 'skills', label: 'SKILLS', style: 'default', enabled: !customizations.hiddenSections?.includes('skills'), order: 4 },
          { id: 'projects', type: 'projects', label: 'PROJECTS', style: 'default', enabled: !customizations.hiddenSections?.includes('projects'), order: 5 },
          { id: 'certifications', type: 'certifications', label: 'CERTIFICATIONS', style: 'default', enabled: !customizations.hiddenSections?.includes('certifications'), order: 6 },
          { id: 'languages', type: 'languages', label: 'LANGUAGES', style: 'default', enabled: !customizations.hiddenSections?.includes('languages'), order: 7 },
        ],
        metadata: {
          id: templateId,
          name: `${templateId} - ${layoutType}`,
          description: `Custom template with ${layoutType} layout`,
          category: 'Professional',
          isAtsOptimized: layoutType === 'single-column',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
      
      setDynamicConfig(config);
      return;
    }

    // Check if templateId is a static template or a generated one
    if (!staticTemplates[templateId?.toLowerCase()]) {
      // Try to load from template store (generated templates)
      const config = TemplateStore.getById(templateId);
      if (config) {
        setDynamicConfig(config);
      }
    }
  }, [templateId, customizations]);

  // If we have a dynamic config (either from layout customization or template store), use DynamicTemplate
  console.log('TemplateRenderer - Dynamic config:', dynamicConfig);
  
  if (dynamicConfig) {
    return <DynamicTemplate profile={profile} customizations={customizations} config={dynamicConfig} />;
  }

  // If it's a static template, use it
  const StaticTemplate = staticTemplates[templateId?.toLowerCase()];
  console.log('TemplateRenderer - Static template found:', !!StaticTemplate, 'for:', templateId?.toLowerCase());
  
  if (StaticTemplate) {
    return <StaticTemplate profile={profile} customizations={customizations} />;
  }

  // Fallback to Modern template
  console.log('TemplateRenderer - Using fallback Modern template');
  return <ModernTemplate profile={profile} customizations={customizations} />;
}

