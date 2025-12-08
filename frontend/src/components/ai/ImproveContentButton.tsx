'use client';
import axios from 'axios';
import { authStore } from '@/stores/authStore';
import { toast } from '@/components/ui/use-toast';
import { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface ImproveContentButtonProps {
  text: string;
  onImproved: (text: string) => void;
  resumeContext?: any; // Full resume/profile data for context
}

export function ImproveContentButton({ text, onImproved, resumeContext }: ImproveContentButtonProps) {
  const [loading, setLoading] = useState(false);
  
  const run = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = authStore.getState().accessToken;
      
      // Build context string from resume data
      let contextString = '';
      if (resumeContext) {
        if (resumeContext.experience && resumeContext.experience.length > 0) {
          contextString += '\n\nEXPERIENCE:\n' + resumeContext.experience.map((exp: any) => 
            `${exp.role} at ${exp.company} (${exp.startDate || ''} - ${exp.endDate || exp.current ? 'Present' : ''})\n${exp.description || ''}`
          ).join('\n\n');
        }
        if (resumeContext.education && resumeContext.education.length > 0) {
          contextString += '\n\nEDUCATION:\n' + resumeContext.education.map((edu: any) => 
            `${edu.degree} in ${edu.field || ''} from ${edu.institution}`
          ).join('\n');
        }
        if (resumeContext.skills && resumeContext.skills.length > 0) {
          contextString += '\n\nSKILLS:\n' + resumeContext.skills.map((s: any) => s.name).join(', ');
        }
        if (resumeContext.projects && resumeContext.projects.length > 0) {
          contextString += '\n\nPROJECTS:\n' + resumeContext.projects.map((p: any) => 
            `${p.name}: ${p.description || ''}`
          ).join('\n');
        }
      }
      
      const res = await axios.post(`${API_BASE_URL}/ai/improve-content`, { 
        content: text + contextString,
        operation: 'enhance'
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: true,
      });
      
      onImproved(res.data.data.improved_content || text);
      toast({ title: '✅ Content improved successfully!' });
    } catch (e:any) {
      toast({ title: 'AI failed', description: e.response?.data?.message || e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <svg className="animate-spin h-12 w-12 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">✨ AI is working...</p>
              <p className="text-sm text-gray-600 mt-1">Analyzing your resume and generating improved content</p>
            </div>
          </div>
        </div>
      )}
      <button 
        className="text-xs px-3 py-1.5 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2" 
        onClick={run}
        disabled={loading}
      >
        ✨ Improve with AI
      </button>
    </>
  );
}
