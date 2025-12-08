'use client';

import { useState, useEffect } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { toast } from 'sonner';
import { RefreshCw, Save, AlertCircle } from 'lucide-react';

interface ResumeDataEditorProps {
  resume: any;
  onUpdate: () => void;
}

export default function ResumeDataEditor({ resume, onUpdate }: ResumeDataEditorProps) {
  const [data, setData] = useState(resume?.data || {});
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('summary');

  useEffect(() => {
    if (resume?.data) {
      setData(resume.data);
    }
  }, [resume]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await resumeApi.updateResume(resume._id || resume.id, { data });
      toast.success('Resume data saved successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to save resume data');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsSyncing(true);
      const response = await resumeApi.syncFromProfile(resume._id || resume.id);
      setData(response.data.resume.data);
      toast.success('Synced from profile successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to sync from profile');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFieldChange = (section: string, field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleArrayFieldChange = (section: string, index: number, field: string, value: any) => {
    setData((prev: any) => {
      const array = [...(prev[section] || [])];
      array[index] = {
        ...array[index],
        [field]: value,
      };
      return {
        ...prev,
        [section]: array,
      };
    });
  };

  const addArrayItem = (section: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: [...(prev[section] || []), {}],
    }));
  };

  const removeArrayItem = (section: string, index: number) => {
    setData((prev: any) => ({
      ...prev,
      [section]: (prev[section] || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const lastSynced = resume?.lastSyncedAt 
    ? new Date(resume.lastSyncedAt).toLocaleString() 
    : 'Never';

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Resume Content</h2>
            <p className="text-sm text-gray-600 mt-1">
              This resume has its own copy of your data. Changes here won't affect your profile or other resumes.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync from Profile'}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
        
        {/* Sync Info */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <AlertCircle className="w-4 h-4" />
          <span>Last synced from profile: {lastSynced}</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="border-b border-gray-200 px-6">
        <div className="flex gap-4 overflow-x-auto">
          {['summary', 'experience', 'education', 'skills', 'projects'].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeSection === section
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Content */}
      <div className="p-6">
        {/* Summary */}
        {activeSection === 'summary' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Summary
            </label>
            <textarea
              value={data.summary || ''}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Write your professional summary..."
            />
          </div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Skills</label>
              <button
                onClick={() => addArrayItem('skills')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Skill
              </button>
            </div>
            <div className="space-y-2">
              {(data.skills || []).map((skill: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={typeof skill === 'string' ? skill : skill.name || ''}
                    onChange={(e) => {
                      const newSkills = [...(data.skills || [])];
                      newSkills[index] = e.target.value;
                      setData({ ...data, skills: newSkills });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Skill name"
                  />
                  <button
                    onClick={() => removeArrayItem('skills', index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {activeSection === 'experience' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">Work Experience</label>
              <button
                onClick={() => addArrayItem('experience')}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Add Experience
              </button>
            </div>
            <div className="space-y-6">
              {(data.experience || []).map((exp: any, index: number) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'title', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="Company"
                    />
                  </div>
                  <textarea
                    value={exp.description || ''}
                    onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3"
                    placeholder="Description"
                  />
                  <button
                    onClick={() => removeArrayItem('experience', index)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Experience
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add similar sections for education and projects */}
      </div>
    </div>
  );
}
