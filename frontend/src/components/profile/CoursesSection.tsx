'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Course {
  name?: string;
  institution?: string;
  date?: string | Date;
  link?: string;
}

export default function CoursesSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [courses, setCourses] = useState<Course[]>(profile?.courses || []);

  useAutoSave(isDirty, courses, async (data) => {
    await updateProfile({ courses: data });
  });

  const handleAdd = () => {
    setCourses([...courses, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setCourses(courses.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...courses];
    updated[index] = { ...updated[index], [field]: value };
    setCourses(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Courses</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Course
        </button>
      </div>

      <div className="space-y-4">
        {courses.map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm font-medium text-gray-700">Course {index + 1}</span>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕
              </button>
            </div>

            <input
              type="text"
              value={course.name || ''}
              onChange={(e) => handleChange(index, 'name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Course Name"
            />

            <input
              type="text"
              value={course.institution || ''}
              onChange={(e) => handleChange(index, 'institution', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
              placeholder="Institution"
            />

            <input
              type="month"
              value={course.date ? (typeof course.date === 'string' ? course.date : new Date(course.date).toISOString().split('T')[0].substring(0, 7)) : ''}
              onChange={(e) => handleChange(index, 'date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-2"
            />

            <input
              type="url"
              value={course.link || ''}
              onChange={(e) => handleChange(index, 'link', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Course URL"
            />
          </div>
        ))}
      </div>

      {courses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <button
            onClick={handleAdd}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your courses
          </button>
        </div>
      )}
    </div>
  );
}
