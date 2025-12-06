'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Language {
  name?: string;
  proficiency?: string;
}

export default function LanguagesSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [languages, setLanguages] = useState<Language[]>(profile?.languages || []);

  useAutoSave(isDirty, languages, async (data) => {
    await updateProfile({ languages: data });
  });

  const handleAdd = () => {
    setLanguages([...languages, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...languages];
    updated[index] = { ...updated[index], [field]: value };
    setLanguages(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Languages</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Language
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {languages.map((lang, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Language {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={lang.name || ''}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Language"
            />

            <select
              value={lang.proficiency || ''}
              onChange={(e) => handleChange(index, 'proficiency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Proficiency Level</option>
              <option value="elementary">Elementary</option>
              <option value="limited">Limited Working</option>
              <option value="professional">Professional Working</option>
              <option value="full">Full Professional</option>
              <option value="native">Native</option>
            </select>
          </div>
        ))}
      </div>

      {languages.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your languages
          </button>
        </div>
      )}
    </div>
  );
}
