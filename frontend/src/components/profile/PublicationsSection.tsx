'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Publication {
  title?: string;
  publisher?: string;
  date?: string | Date;
  link?: string;
}

export default function PublicationsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [publications, setPublications] = useState<Publication[]>(profile?.publications || []);

  useAutoSave(isDirty, publications, async (data) => {
    await updateProfile({ publications: data });
  });

  const handleAdd = () => {
    setPublications([...publications, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...publications];
    updated[index] = { ...updated[index], [field]: value };
    setPublications(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Publications</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Publication
        </button>
      </div>

      <div className="space-y-4">
        {publications.map((pub, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Publication {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={pub.title || ''}
              onChange={(e) => handleChange(index, 'title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Publication Title"
            />

            <input
              type="text"
              value={pub.publisher || ''}
              onChange={(e) => handleChange(index, 'publisher', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Publisher"
            />

            <input
              type="month"
              value={pub.date ? (typeof pub.date === 'string' ? pub.date : new Date(pub.date).toISOString().split('T')[0].substring(0, 7)) : ''}
              onChange={(e) => handleChange(index, 'date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
            />

            <input
              type="url"
              value={pub.link || ''}
              onChange={(e) => handleChange(index, 'link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Publication Link"
            />
          </div>
        ))}
      </div>

      {publications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your publications
          </button>
        </div>
      )}
    </div>
  );
}
