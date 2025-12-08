/**
 * Template Configuration Storage
 * In-memory store for generated templates (can be replaced with database)
 */

import { TemplateConfiguration } from '@/types/templateConfig';

class TemplateStore {
  private static templates: Map<string, TemplateConfiguration> = new Map();
  private static categories: Map<string, string[]> = new Map();

  /**
   * Save a template configuration
   */
  static save(template: TemplateConfiguration): void {
    this.templates.set(template.metadata.id, template);
    
    // Update category index
    const category = template.metadata.category;
    if (!this.categories.has(category)) {
      this.categories.set(category, []);
    }
    const categoryTemplates = this.categories.get(category)!;
    if (!categoryTemplates.includes(template.metadata.id)) {
      categoryTemplates.push(template.metadata.id);
    }
  }

  /**
   * Save multiple templates
   */
  static saveMany(templates: TemplateConfiguration[]): void {
    templates.forEach(template => this.save(template));
  }

  /**
   * Get template by ID
   */
  static getById(id: string): TemplateConfiguration | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates
   */
  static getAll(): TemplateConfiguration[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by category
   */
  static getByCategory(category: string): TemplateConfiguration[] {
    const templateIds = this.categories.get(category) || [];
    return templateIds
      .map(id => this.templates.get(id))
      .filter(Boolean) as TemplateConfiguration[];
  }

  /**
   * Get templates by industry
   */
  static getByIndustry(industry: string): TemplateConfiguration[] {
    return this.getAll().filter(template => 
      template.metadata.industry?.some(ind => 
        ind.toLowerCase() === industry.toLowerCase()
      )
    );
  }

  /**
   * Get templates by experience level
   */
  static getByExperienceLevel(level: 'entry' | 'mid' | 'senior' | 'executive'): TemplateConfiguration[] {
    return this.getAll().filter(template => 
      template.metadata.experienceLevel === level
    );
  }

  /**
   * Get ATS-optimized templates only
   */
  static getAtsOptimized(): TemplateConfiguration[] {
    return this.getAll().filter(template => template.metadata.isAtsOptimized);
  }

  /**
   * Search templates
   */
  static search(query: string): TemplateConfiguration[] {
    const lowerQuery = query.toLowerCase();
    return this.getAll().filter(template => 
      template.metadata.name.toLowerCase().includes(lowerQuery) ||
      template.metadata.description.toLowerCase().includes(lowerQuery) ||
      template.metadata.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get all categories
   */
  static getCategories(): string[] {
    return Array.from(this.categories.keys());
  }

  /**
   * Get template count
   */
  static count(): number {
    return this.templates.size;
  }

  /**
   * Clear all templates
   */
  static clear(): void {
    this.templates.clear();
    this.categories.clear();
  }

  /**
   * Export templates to JSON
   */
  static exportToJSON(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      totalCount: this.count(),
      categories: this.getCategories(),
      templates: this.getAll(),
    };
    return JSON.stringify(data, null, 2);
  }

  /**
   * Import templates from JSON
   */
  static importFromJSON(jsonString: string): void {
    try {
      const data = JSON.parse(jsonString);
      if (data.templates && Array.isArray(data.templates)) {
        this.saveMany(data.templates);
      }
    } catch (error) {
      console.error('Failed to import templates:', error);
    }
  }

  /**
   * Load templates from generated file
   */
  static async loadGeneratedTemplates(): Promise<void> {
    try {
      // In a real implementation, this would fetch from an API or file
      // For now, we'll generate them on-the-fly
      const { TemplateGenerator } = await import('@/lib/templateGenerator');
      const templates = TemplateGenerator.generateTemplateLibrary();
      this.saveMany(templates);
      console.log(`✅ Loaded ${templates.length} generated templates`);
    } catch (error) {
      console.error('Failed to load generated templates:', error);
    }
  }
}

export default TemplateStore;
