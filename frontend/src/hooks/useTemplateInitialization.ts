/**
 * Template Initialization Hook
 * Loads generated templates on app startup
 */

'use client';

import { useEffect, useState } from 'react';
import TemplateStore from '@/lib/templateStore';
import { TemplateGenerator } from '@/lib/templateGenerator';

export function useTemplateInitialization() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [templateCount, setTemplateCount] = useState(0);

  useEffect(() => {
    async function initializeTemplates() {
      try {
        // Check if templates are already loaded
        if (TemplateStore.count() > 0) {
          setTemplateCount(TemplateStore.count());
          setIsLoaded(true);
          return;
        }

        console.log('🎨 Initializing template system...');

        // Generate template library
        const templates = TemplateGenerator.generateTemplateLibrary();
        
        // Save to store
        TemplateStore.saveMany(templates);
        
        setTemplateCount(templates.length);
        setIsLoaded(true);

        console.log(`✅ Loaded ${templates.length} templates`);
      } catch (error) {
        console.error('Failed to initialize templates:', error);
        setIsLoaded(true); // Set to true anyway to prevent infinite loading
      }
    }

    initializeTemplates();
  }, []);

  return { isLoaded, templateCount };
}

export default useTemplateInitialization;
