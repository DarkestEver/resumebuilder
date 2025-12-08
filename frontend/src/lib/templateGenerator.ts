/**
 * Template Generator Service
 * Generates template configurations programmatically
 */

import { TemplateConfiguration, GenerateTemplateRequest, TemplateMetadata } from '@/types/templateConfig';
import { TEMPLATE_PRESETS, COLOR_SCHEMES, FONT_CONFIGS, SPACING_CONFIGS, INDUSTRY_OVERRIDES } from './templatePresets';

export class TemplateGenerator {
  /**
   * Merge two configuration objects
   */
  private static mergeConfigs(
    base: Partial<TemplateConfiguration>,
    override: Partial<TemplateConfiguration>
  ): Partial<TemplateConfiguration> {
    return {
      ...base,
      ...override,
      layout: { ...base.layout, ...override.layout } as any,
      colors: { ...base.colors, ...override.colors } as any,
      fonts: { ...base.fonts, ...override.fonts } as any,
      spacing: { ...base.spacing, ...override.spacing } as any,
      header: { ...base.header, ...override.header } as any,
      sections: override.sections || base.sections,
      metadata: { ...base.metadata, ...override.metadata } as any,
    };
  }

  /**
   * Generate unique template ID
   */
  private static generateUniqueId(): string {
    return `tpl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a single template configuration
   */
  static generateTemplate(request: GenerateTemplateRequest): TemplateConfiguration {
    // Start with base preset or default
    const basePreset = request.basePreset 
      ? TEMPLATE_PRESETS[request.basePreset]?.baseConfig 
      : TEMPLATE_PRESETS['executive-elite']?.baseConfig || TEMPLATE_PRESETS['modern-professional']?.baseConfig;

    if (!basePreset) {
      throw new Error(`Base preset "${request.basePreset}" not found. Available presets: ${Object.keys(TEMPLATE_PRESETS).join(', ')}`);
    }

    // Clone the base configuration
    let config: Partial<TemplateConfiguration> = JSON.parse(JSON.stringify(basePreset));

    // Apply industry-specific overrides
    if (request.industry && INDUSTRY_OVERRIDES[request.industry.toLowerCase()]) {
      const industryConfig = INDUSTRY_OVERRIDES[request.industry.toLowerCase()];
      config = this.mergeConfigs(config, industryConfig);
    }

    // Apply custom configuration
    if (request.customConfig) {
      config = this.mergeConfigs(config, request.customConfig);
    }

    // Generate unique ID and metadata
    const metadata: TemplateMetadata = {
      id: this.generateUniqueId(),
      name: config.metadata?.name || 'Custom Template',
      description: config.metadata?.description || 'Generated template',
      category: request.category || config.metadata?.category || 'Professional',
      industry: request.industry ? [request.industry] : config.metadata?.industry,
      experienceLevel: request.experienceLevel || config.metadata?.experienceLevel,
      tags: config.metadata?.tags || ['custom', 'generated'],
      isAtsOptimized: request.atsOptimized !== undefined ? request.atsOptimized : true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return {
      ...config,
      metadata,
    } as TemplateConfiguration;
  }

  /**
   * Generate multiple template variations
   */
  static generateVariations(
    basePreset: string,
    count: number = 10
  ): TemplateConfiguration[] {
    const variations: TemplateConfiguration[] = [];
    const colorSchemeKeys = Object.keys(COLOR_SCHEMES);
    const fontConfigKeys = Object.keys(FONT_CONFIGS);
    const spacingConfigKeys = Object.keys(SPACING_CONFIGS);

    for (let i = 0; i < count; i++) {
      const colorScheme = colorSchemeKeys[i % colorSchemeKeys.length];
      const fontConfig = fontConfigKeys[i % fontConfigKeys.length];
      const spacingConfig = spacingConfigKeys[i % spacingConfigKeys.length];

      const config = this.generateTemplate({
        basePreset,
        customConfig: {
          colors: COLOR_SCHEMES[colorScheme],
          fonts: FONT_CONFIGS[fontConfig],
          spacing: SPACING_CONFIGS[spacingConfig],
          metadata: {
            name: `${basePreset} - Variation ${i + 1}`,
            description: `${colorScheme} / ${fontConfig} / ${spacingConfig}`,
          } as any,
        },
      });

      variations.push(config);
    }

    return variations;
  }

  /**
   * Generate templates for all industries
   */
  static generateIndustryTemplates(
    industries: string[]
  ): TemplateConfiguration[] {
    const templates: TemplateConfiguration[] = [];

    industries.forEach(industry => {
      // Generate 3 variations per industry (professional, modern, compact)
      ['modern-professional', 'tech-stack', 'compact-dense'].forEach(preset => {
        const template = this.generateTemplate({
          basePreset: preset,
          industry,
          category: 'Industry-Specific',
          atsOptimized: true,
        });

        template.metadata.name = `${industry} - ${preset}`;
        template.metadata.description = `${industry} industry template based on ${preset}`;
        templates.push(template);
      });
    });

    return templates;
  }

  /**
   * Generate templates by experience level
   */
  static generateExperienceLevelTemplates(): TemplateConfiguration[] {
    const templates: TemplateConfiguration[] = [];
    const levels: Array<'entry' | 'mid' | 'senior' | 'executive'> = ['entry', 'mid', 'senior', 'executive'];

    levels.forEach(level => {
      const preset = level === 'executive' ? 'executive-elite' : 'modern-professional';
      
      const template = this.generateTemplate({
        basePreset: preset,
        experienceLevel: level,
        category: 'Experience Level',
      });

      template.metadata.name = `${level.charAt(0).toUpperCase() + level.slice(1)} Level Template`;
      template.metadata.description = `Optimized for ${level}-level professionals`;
      templates.push(template);
    });

    return templates;
  }

  /**
   * Generate comprehensive template library
   */
  static generateTemplateLibrary(): TemplateConfiguration[] {
    const templates: TemplateConfiguration[] = [];

    // 1. Base presets (5 templates)
    Object.keys(TEMPLATE_PRESETS).forEach(presetKey => {
      templates.push(this.generateTemplate({ basePreset: presetKey }));
    });

    // 2. Color/Font variations (30 templates)
    ['modern-professional', 'tech-stack', 'executive-elite'].forEach(preset => {
      templates.push(...this.generateVariations(preset, 10));
    });

    // 3. Industry-specific templates (60 templates - 20 industries × 3 variations)
    const industries = [
      'Technology', 'Healthcare', 'Finance', 'Legal', 'Marketing',
      'Sales', 'Education', 'Engineering', 'Design', 'Consulting',
      'Retail', 'Manufacturing', 'Real Estate', 'Media', 'Hospitality',
      'Non-Profit', 'Government', 'Construction', 'Transportation', 'Energy'
    ];
    templates.push(...this.generateIndustryTemplates(industries));

    // 4. Experience level templates (4 templates)
    templates.push(...this.generateExperienceLevelTemplates());

    // 5. Special format templates
    templates.push(
      this.generateTemplate({
        basePreset: 'compact-dense',
        category: 'Special Formats',
        customConfig: {
          metadata: { name: 'Ultra Compact', description: 'Maximum content density' } as any,
        },
      })
    );

    return templates;
  }

  /**
   * Validate template configuration
   */
  static validateTemplate(config: TemplateConfiguration): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Required fields
    if (!config.metadata?.id) errors.push('Missing template ID');
    if (!config.metadata?.name) errors.push('Missing template name');
    if (!config.layout) errors.push('Missing layout configuration');
    if (!config.colors) errors.push('Missing color configuration');
    if (!config.fonts) errors.push('Missing font configuration');
    if (!config.sections || config.sections.length === 0) {
      errors.push('No sections defined');
    }

    // ATS compliance checks
    if (config.metadata.isAtsOptimized) {
      if (config.layout.type !== 'single-column') {
        errors.push('ATS templates must use single-column layout');
      }
      if (config.colors.primary !== '#000000' && config.colors.primary !== '#1F2937') {
        errors.push('ATS templates should use black or dark gray text');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default TemplateGenerator;
