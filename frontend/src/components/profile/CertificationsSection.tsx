'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Certification {
  name?: string;
  issuer?: string;
  date?: string | Date;
  link?: string;
}

export default function CertificationsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [certifications, setCertifications] = useState<Certification[]>(
    profile?.certifications || []
  );

  useAutoSave(isDirty, certifications, async (data) => {
    await updateProfile({ certifications: data });
  });

  const handleAdd = () => {
    setCertifications([...certifications, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...certifications];
    updated[index] = { ...updated[index], [field]: value };
    setCertifications(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Certification
        </button>
      </div>

      <div className="space-y-4">
        {certifications.map((cert, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Cert {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={cert.name || ''}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Certification Name"
            />

            <input
              type="text"
              value={cert.issuer || ''}
              onChange={(e) => handleChange(index, 'issuer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Issuing Organization"
            />

            <input
              type="month"
              value={(cert.date instanceof Date ? cert.date.toISOString().split('T')[0] : cert.date) || ''}
              onChange={(e) => handleChange(index, 'date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
            />

            <input
              type="url"
              value={cert.link || ''}
              onChange={(e) => handleChange(index, 'link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Certificate URL"
            />
          </div>
        ))}
      </div>

      {certifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your certifications
          </button>
        </div>
      )}
    </div>
  );
}
