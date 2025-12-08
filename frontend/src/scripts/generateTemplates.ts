/**
 * Generate Template Library Script
 * Run this to generate 100+ template configurations
 */

import { TemplateGenerator } from '../lib/templateGenerator';
import { TemplateConfiguration } from '../types/templateConfig';
import * as fs from 'fs';
import * as path from 'path';

function generateAndSaveTemplates() {
  console.log('🎨 Starting Template Generation System...\n');

  // Generate comprehensive template library
  const templates = TemplateGenerator.generateTemplateLibrary();

  console.log(`✅ Generated ${templates.length} templates\n`);

  // Validate all templates
  let validCount = 0;
  let atsCount = 0;
  const validationErrors: any[] = [];

  templates.forEach((template, index) => {
    const validation = TemplateGenerator.validateTemplate(template);
    if (validation.isValid) {
      validCount++;
      if (template.metadata.isAtsOptimized) atsCount++;
    } else {
      validationErrors.push({
        template: template.metadata.name,
        errors: validation.errors,
      });
    }
  });

  console.log(`📊 Validation Results:`);
  console.log(`   Valid Templates: ${validCount}/${templates.length}`);
  console.log(`   ATS-Optimized: ${atsCount}`);
  console.log(`   Errors: ${validationErrors.length}\n`);

  if (validationErrors.length > 0) {
    console.log('⚠️  Validation Errors:');
    validationErrors.forEach(err => {
      console.log(`   ${err.template}: ${err.errors.join(', ')}`);
    });
    console.log('');
  }

  // Categorize templates
  const categorized: Record<string, TemplateConfiguration[]> = {};
  templates.forEach(template => {
    const category = template.metadata.category;
    if (!categorized[category]) {
      categorized[category] = [];
    }
    categorized[category].push(template);
  });

  console.log('📁 Template Categories:');
  Object.entries(categorized).forEach(([category, temps]) => {
    console.log(`   ${category}: ${temps.length} templates`);
  });
  console.log('');

  // Save templates to JSON file
  const outputPath = path.join(__dirname, '../../../data/generated-templates.json');
  const outputDir = path.dirname(outputPath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const data = {
    generatedAt: new Date().toISOString(),
    totalCount: templates.length,
    validCount,
    atsOptimizedCount: atsCount,
    categories: Object.keys(categorized),
    templates: templates.map(t => ({
      ...t,
      metadata: {
        ...t.metadata,
        createdAt: t.metadata.createdAt.toISOString(),
        updatedAt: t.metadata.updatedAt.toISOString(),
      },
    })),
  };

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`💾 Templates saved to: ${outputPath}`);

  // Generate summary file
  const summaryPath = path.join(__dirname, '../../../data/template-summary.md');
  let summary = `# Generated Template Library\n\n`;
  summary += `**Generated:** ${new Date().toISOString()}\n`;
  summary += `**Total Templates:** ${templates.length}\n`;
  summary += `**Valid Templates:** ${validCount}\n`;
  summary += `**ATS-Optimized:** ${atsCount}\n\n`;
  
  summary += `## Categories\n\n`;
  Object.entries(categorized).forEach(([category, temps]) => {
    summary += `### ${category} (${temps.length} templates)\n\n`;
    temps.slice(0, 10).forEach(t => {
      summary += `- **${t.metadata.name}**: ${t.metadata.description}\n`;
    });
    if (temps.length > 10) {
      summary += `- ... and ${temps.length - 10} more\n`;
    }
    summary += `\n`;
  });

  fs.writeFileSync(summaryPath, summary);
  console.log(`📄 Summary saved to: ${summaryPath}`);

  console.log('\n✅ Template generation complete!');
  
  return {
    templates,
    validCount,
    atsCount,
    categories: Object.keys(categorized),
  };
}

// Run if executed directly
if (require.main === module) {
  generateAndSaveTemplates();
}

export default generateAndSaveTemplates;
