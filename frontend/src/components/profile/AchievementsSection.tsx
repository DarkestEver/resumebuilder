'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

export default function AchievementsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [achievements, setAchievements] = useState<string[]>(profile?.achievements || []);
  const [newAchievement, setNewAchievement] = useState('');

  useAutoSave(isDirty, achievements, async (data) => {
    await updateProfile({ achievements: data });
  });

  const handleAdd = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement]);
      setNewAchievement('');
      setDirty(true);
    }
  };

  const handleRemove = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Achievements & Awards</h2>

      <div className="flex gap-2">
        <input
          type="text"
          value={newAchievement}
          onChange={(e) => setNewAchievement(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
          placeholder="Add an achievement or award..."
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-2">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
          >
            <span className="text-gray-700">• {achievement}</span>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {achievements.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No achievements added yet</p>
        </div>
      )}
    </div>
  );
}
