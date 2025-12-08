'use client';

import { useState, useEffect } from 'react';
import { resumeApi } from '@/lib/api/resume';
import { profileStore } from '@/stores/profileStore';
import { toast } from 'sonner';
import { X, Plus, Trash2, Save } from 'lucide-react';

interface ResumeContentEditorProps {
  resume: any;
  onClose: () => void;
  onSave: () => void;
}

export default function ResumeContentEditor({ resume, onClose, onSave }: ResumeContentEditorProps) {
  const { profile } = profileStore();
  
  // Initialize with resume.data if exists, otherwise use profile as fallback
  const initialData = resume.data || profile || {};
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Use resume.data if available, otherwise fallback to profile
    const dataToUse = resume.data || profile || {};
    setData(dataToUse);
  }, [resume, profile]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving resume data:', data);
      await resumeApi.updateResume(resume._id || resume.id, { data });
      toast.success('Resume content saved!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setData({ ...data, [field]: value });
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setData({
      ...data,
      [parent]: {
        ...data[parent],
        [field]: value
      }
    });
  };

  const addArrayItem = (field: string, template: any) => {
    const current = data[field] || [];
    setData({
      ...data,
      [field]: [...current, template]
    });
  };

  const updateArrayItem = (field: string, index: number, itemData: any) => {
    const current = [...(data[field] || [])];
    current[index] = itemData;
    setData({ ...data, [field]: current });
  };

  const removeArrayItem = (field: string, index: number) => {
    const current = [...(data[field] || [])];
    current.splice(index, 1);
    setData({ ...data, [field]: current });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Edit Resume Content</h2>
            <p className="text-sm text-gray-600">Make changes specific to this resume</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-semibold text-yellow-900 mb-1">Resume-Specific Edits</h4>
                <p className="text-xs text-yellow-800">
                  Changes here only affect this resume. Your profile remains unchanged. 
                  Clicking "Sync from Profile" will overwrite these changes.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Personal Info */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value={data.personalInfo?.firstName || ''}
                    onChange={(e) => updateNestedField('personalInfo', 'firstName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={data.personalInfo?.lastName || ''}
                    onChange={(e) => updateNestedField('personalInfo', 'lastName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title/Position</label>
                  <input
                    type="text"
                    value={data.personalInfo?.title || ''}
                    onChange={(e) => updateNestedField('personalInfo', 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Senior Software Engineer"
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={data.contact?.email || ''}
                    onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={data.contact?.phone || ''}
                    onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={data.contact?.location || ''}
                    onChange={(e) => updateNestedField('contact', 'location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="City, Country"
                  />
                </div>
              </div>
            </section>

            {/* Professional Summary */}
            <section>
              <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Professional Summary</h3>
              <textarea
                value={data.summary || ''}
                onChange={(e) => updateField('summary', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Write a compelling professional summary..."
              />
            </section>

            {/* Experience */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-900">Work Experience</h3>
                <button
                  onClick={() => addArrayItem('experience', {
                    title: '',
                    company: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    current: false,
                    description: ''
                  })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Experience
                </button>
              </div>
              <div className="space-y-4">
                {(data.experience || []).map((exp: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Experience #{index + 1}</h4>
                      <button
                        onClick={() => removeArrayItem('experience', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.title || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="e.g., Senior Developer"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, company: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="month"
                          value={exp.startDate || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="month"
                          value={exp.endDate || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, endDate: e.target.value })}
                          disabled={exp.current}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:bg-gray-100"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={exp.current || false}
                            onChange={(e) => updateArrayItem('experience', index, { ...exp, current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-gray-700">Currently working here</span>
                        </label>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => updateArrayItem('experience', index, { ...exp, description: e.target.value })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-900">Education</h3>
                <button
                  onClick={() => addArrayItem('education', {
                    degree: '',
                    field: '',
                    institution: '',
                    location: '',
                    startDate: '',
                    endDate: '',
                    gpa: ''
                  })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Education
                </button>
              </div>
              <div className="space-y-4">
                {(data.education || []).map((edu: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-gray-900">Education #{index + 1}</h4>
                      <button
                        onClick={() => removeArrayItem('education', index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, degree: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="e.g., Bachelor of Science"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, field: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="e.g., Computer Science"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, institution: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Start Year</label>
                        <input
                          type="number"
                          value={edu.startDate || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, startDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="2018"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">End Year</label>
                        <input
                          type="number"
                          value={edu.endDate || ''}
                          onChange={(e) => updateArrayItem('education', index, { ...edu, endDate: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          placeholder="2022"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Skills */}
            <section>
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="text-lg font-bold text-gray-900">Skills</h3>
                <button
                  onClick={() => addArrayItem('skills', { name: '', level: 'intermediate' })}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Skill
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {(data.skills || []).map((skill: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={typeof skill === 'string' ? skill : skill.name || ''}
                      onChange={(e) => updateArrayItem('skills', index, typeof skill === 'string' ? e.target.value : { ...skill, name: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Skill name"
                    />
                    <button
                      onClick={() => removeArrayItem('skills', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
