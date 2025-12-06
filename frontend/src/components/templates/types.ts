/**
 * Template Types for Resume Rendering
 */

import { ProfileData } from '@/lib/api/profile';
import { Resume } from '@/lib/api/resume';

export interface TemplateProps {
  profile: ProfileData;
  customizations?: Resume['customizations'];
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'minimal' | 'creative' | 'executive' | 'technical';
  thumbnail?: string;
  defaultColors?: {
    primary: string;
    accent: string;
    background: string;
  };
  defaultFont?: {
    family: string;
    size: number;
  };
}
