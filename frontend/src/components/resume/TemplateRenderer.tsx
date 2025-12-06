'use client';

import ModernTemplate from '@/components/templates/ModernTemplate';
import ClassicTemplate from '@/components/templates/ClassicTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import ExecutiveTemplate from '@/components/templates/ExecutiveTemplate';
import TechnicalTemplate from '@/components/templates/TechnicalTemplate';

interface TemplateRendererProps {
  templateId: string;
  profile: any;
  customizations?: any;
}

export default function TemplateRenderer({ templateId, profile, customizations }: TemplateRendererProps) {
  const templates: Record<string, any> = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    minimal: MinimalTemplate,
    minimalist: MinimalTemplate, // alias
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
    technical: TechnicalTemplate,
  };

  const Template = templates[templateId?.toLowerCase()] || ModernTemplate;

  return <Template profile={profile} customizations={customizations} />;
}
