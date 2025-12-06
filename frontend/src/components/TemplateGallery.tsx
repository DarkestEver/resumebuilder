/**
 * Template Gallery Component
 * Displays all available resume templates for selection
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { templateConfigs } from '@/components/templates';

const TemplateGallery: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Resume Templates</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Choose from our collection of professionally designed templates. Each template is optimized for ATS (Applicant Tracking Systems) while maintaining a polished appearance.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {templateConfigs.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Template Preview */}
              <div
                className="h-80 bg-gray-100 border-4"
                style={{
                  borderColor: template.defaultColors.primary,
                  backgroundColor: template.defaultColors.background
                }}
              >
                <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white">
                  <div
                    className="w-24 h-24 rounded-full mb-4 flex items-center justify-center"
                    style={{ backgroundColor: `${template.defaultColors.primary}20` }}
                  >
                    <div
                      className="w-20 h-20 rounded-full"
                      style={{ backgroundColor: template.defaultColors.primary }}
                    />
                  </div>
                  <div className="text-center">
                    <p
                      className="text-sm font-bold mb-2"
                      style={{ color: template.defaultColors.primary }}
                    >
                      {template.name.toUpperCase()}
                    </p>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded w-32"></div>
                      <div className="h-2 bg-gray-300 rounded w-28"></div>
                      <div className="h-2 bg-gray-300 rounded w-24"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{template.description}</p>

                {/* Features */}
                <div className="mb-6 space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>ATS Optimized</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Fully Customizable</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Print Ready</span>
                  </div>
                </div>

                {/* Color Palette */}
                <div className="flex gap-2 mb-6">
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: template.defaultColors.primary }}
                    title="Primary"
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: template.defaultColors.accent }}
                    title="Accent"
                  />
                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-300"
                    style={{ backgroundColor: template.defaultColors.background }}
                    title="Background"
                  />
                </div>

                {/* Action Button */}
                <Link
                  href={`/resume?template=${template.id}`}
                  className="block w-full text-center py-2 px-4 rounded font-semibold text-white transition-colors"
                  style={{ backgroundColor: template.defaultColors.primary }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                >
                  Use This Template
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Tips Section */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Template Tips</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Modern</strong> - Best for tech, creative, and startup roles. Eye-catching colors and layouts.
              </p>
            </li>
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Classic</strong> - Ideal for traditional industries like law, finance, and academia.
              </p>
            </li>
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Minimal</strong> - Perfect for simplicity and readability. Works well for all industries.
              </p>
            </li>
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Creative</strong> - Great for designers, marketers, and other creative professionals.
              </p>
            </li>
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Executive</strong> - Elegant design for senior-level and management positions.
              </p>
            </li>
            <li className="flex">
              <span className="text-blue-600 font-bold mr-4">•</span>
              <p>
                <strong>Technical</strong> - Perfect for engineers and developers with a tech-forward aesthetic.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplateGallery;
