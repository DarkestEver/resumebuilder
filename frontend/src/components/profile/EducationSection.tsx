'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Education {
  degree?: string;
  institution?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
  gpa?: string;
}

export default function EducationSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [education, setEducation] = useState<Education[]>(profile?.education || []);

  useAutoSave(isDirty, education, async (data) => {
    try {
      await updateProfile({ education: data });
    } catch (error) {
      console.error('Auto-save failed:', error);
    }
  });

  const handleAdd = () => {
    setEducation([...education, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    setEducation(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
          {isSaving && (
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving changes...
            </p>
          )}
        </div>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Education
        </button>
      </div>

      <div className="space-y-6">
        {education.map((edu, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">Education {index + 1}</h3>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree
                </label>
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Bachelor of Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  value={edu.institution || ''}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="University Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={edu.location || ''}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="City, State"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GPA
                </label>
                <input
                  type="text"
                  value={edu.gpa || ''}
                  onChange={(e) => handleChange(index, 'gpa', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="3.8/4.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={(edu.startDate instanceof Date ? edu.startDate.toISOString().split('T')[0].slice(0, 7) : edu.startDate) || ''}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="month"
                  value={(edu.endDate instanceof Date ? edu.endDate.toISOString().split('T')[0].slice(0, 7) : edu.endDate) || ''}
                  onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {education.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No education added yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your education
          </button>
        </div>
      )}
    </div>
  );
}
