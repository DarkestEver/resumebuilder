'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Experience {
  title?: string;
  company?: string;
  location?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  current?: boolean;
  description?: string;
  achievements?: string[];
}

export default function ExperienceSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [experience, setExperience] = useState<Experience[]>(profile?.experience || []);

  useAutoSave(isDirty, experience, async (data) => {
    await updateProfile({ experience: data });
  });

  const handleAdd = () => {
    setExperience([...experience, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    setExperience(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Work Experience</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Experience
        </button>
      </div>

      <div className="space-y-6">
        {experience.map((exp, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">Position {index + 1}</h3>
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
                  Job Title
                </label>
                <input
                  type="text"
                  value={exp.title || ''}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Tech Company Inc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={exp.location || ''}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="New York, NY"
                />
              </div>

              <div className="flex items-end">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={exp.current || false}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm text-gray-700">Currently working here</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="month"
                  value={(exp.startDate instanceof Date ? exp.startDate.toISOString().split('T')[0].slice(0, 7) : exp.startDate) || ''}
                  onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {!exp.current && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="month"
                    value={(exp.endDate instanceof Date ? exp.endDate.toISOString().split('T')[0].slice(0, 7) : exp.endDate) || ''}
                    onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={exp.description || ''}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Describe your role and responsibilities..."
              />
            </div>
          </div>
        ))}
      </div>

      {experience.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No experience added yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first experience
          </button>
        </div>
      )}
    </div>
  );
}
