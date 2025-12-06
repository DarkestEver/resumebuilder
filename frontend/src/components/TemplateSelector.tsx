/**
 * Template Selector Component
 * Allows users to select and preview templates in the resume editor
 */

'use client';

import React, { useState } from 'react';
import { templateConfigs } from '@/components/templates';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const currentTemplate = templateConfigs.find(t => t.id === selectedTemplate);

  return (
    <div className="border-b border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Resume Template</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? 'Collapse' : 'Change Template'}
        </button>
      </div>

      {/* Current Template Display */}
      {currentTemplate && (
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded mb-4">
          <div
            className="w-12 h-12 rounded flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: currentTemplate.defaultColors.primary }}
          >
            {currentTemplate.name.charAt(0)}
          </div>
          <div className="flex-1">
            <p className="font-semibold">{currentTemplate.name}</p>
            <p className="text-sm text-gray-600">{currentTemplate.description}</p>
          </div>
        </div>
      )}

      {/* Template Grid */}
      {isExpanded && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-4">
          {templateConfigs.map((template) => (
            <button
              key={template.id}
              onClick={() => {
                onTemplateChange(template.id);
                setIsExpanded(false);
              }}
              className={`p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                selectedTemplate === template.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="w-full h-20 rounded mb-2 flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: template.defaultColors.primary }}
              >
                {template.name.charAt(0)}
              </div>
              <p className="text-xs font-semibold text-center">{template.name}</p>
              {selectedTemplate === template.id && (
                <p className="text-xs text-blue-600 text-center mt-1">✓ Selected</p>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Customization Options */}
      {isExpanded && currentTemplate && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <h4 className="font-semibold mb-4">Customize Colors</h4>
          <div className="grid grid-cols-3 gap-4">
            {/* Primary Color */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300 cursor-pointer"
                  style={{ backgroundColor: currentTemplate.defaultColors.primary }}
                />
                <input
                  type="color"
                  defaultValue={currentTemplate.defaultColors.primary}
                  className="w-12 h-10 cursor-pointer"
                />
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: currentTemplate.defaultColors.accent }}
                />
                <input
                  type="color"
                  defaultValue={currentTemplate.defaultColors.accent}
                  className="w-12 h-10 cursor-pointer"
                />
              </div>
            </div>

            {/* Background Color */}
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-2">
                Background
              </label>
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 rounded border-2 border-gray-300"
                  style={{ backgroundColor: currentTemplate.defaultColors.background }}
                />
                <input
                  type="color"
                  defaultValue={currentTemplate.defaultColors.background}
                  className="w-12 h-10 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
