'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Patent {
  title?: string;
  patentNumber?: string;
  date?: string | Date;
  link?: string;
}

export default function PatentsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [patents, setPatents] = useState<Patent[]>(profile?.patents || []);

  useAutoSave(isDirty, patents, async (data) => {
    await updateProfile({ patents: data });
  });

  const handleAdd = () => {
    setPatents([...patents, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setPatents(patents.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...patents];
    updated[index] = { ...updated[index], [field]: value };
    setPatents(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Patents</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Patent
        </button>
      </div>

      <div className="space-y-4">
        {patents.map((patent, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Patent {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patent Title
                </label>
                <input
                  type="text"
                  value={patent.title || ''}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Title of the patent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patent Number
                </label>
                <input
                  type="text"
                  value={patent.patentNumber || ''}
                  onChange={(e) => handleChange(index, 'patentNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="US123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grant Date
                </label>
                <input
                  type="date"
                  value={patent.date ? (patent.date instanceof Date ? patent.date.toISOString().split('T')[0] : patent.date.toString().split('T')[0]) : ''}
                  onChange={(e) => handleChange(index, 'date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patent Link
                </label>
                <input
                  type="url"
                  value={patent.link || ''}
                  onChange={(e) => handleChange(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://patents.google.com/..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {patents.length === 0 && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          <p>No patents added yet. Click "Add Patent" to get started.</p>
        </div>
      )}

      {isSaving && (
        <div className="text-center text-sm text-blue-600">
          Saving...
        </div>
      )}
    </div>
  );
}
