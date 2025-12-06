'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Skill {
  name?: string;
  category?: string;
  level?: string;
}

export default function SkillsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [skills, setSkills] = useState<Skill[]>(profile?.skills || []);

  useAutoSave(isDirty, skills, async (data) => {
    await updateProfile({ skills: data });
  });

  const handleAdd = () => {
    setSkills([...skills, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Skill {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={skill.name || ''}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Skill name (e.g., React, Python)"
            />

            <input
              type="text"
              value={skill.category || ''}
              onChange={(e) => handleChange(index, 'category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Category (e.g., Programming, Design)"
            />

            <select
              value={skill.level || ''}
              onChange={(e) => handleChange(index, 'level', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            >
              <option value="">Proficiency Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No skills added yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your skills
          </button>
        </div>
      )}
    </div>
  );
}
