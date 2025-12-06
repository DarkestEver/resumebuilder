'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function SummarySection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [summary, setSummary] = useState(profile?.summary || '');

  useAutoSave(isDirty, summary, async (data) => {
    await updateProfile({ summary: data });
  });

  const handleChange = (value: string) => {
    setSummary(value);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
        {isSaving && <span className="text-sm text-blue-600">Saving...</span>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Professional Summary
        </label>
        <textarea
          value={summary}
          onChange={(e) => handleChange(e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write a brief professional summary highlighting your key skills, experiences, and career goals..."
        />
        <p className="text-xs text-gray-500 mt-2">
          {summary.length} characters - Keep it between 100-300 characters for best results
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          💡 <strong>Tip:</strong> Write a compelling summary that captures your unique value proposition
          and makes employers want to learn more about you.
        </p>
      </div>
    </div>
  );
}
