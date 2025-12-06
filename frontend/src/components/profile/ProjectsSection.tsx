'use client';

import { useState } from 'react';
import { profileStore } from '@/stores/profileStore';
import { useAutoSave } from '@/hooks/useAutoSave';

interface Project {
  name?: string;
  description?: string;
  technologies?: string[];
  link?: string;
}

export default function ProjectsSection() {
  const { profile, updateProfile, setDirty, isDirty, isSaving } = profileStore();
  const [projects, setProjects] = useState<Project[]>(profile?.projects || []);

  useAutoSave(isDirty, projects, async (data) => {
    await updateProfile({ projects: data });
  });

  const handleAdd = () => {
    setProjects([...projects, {}]);
    setDirty(true);
  };

  const handleRemove = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
    setDirty(true);
  };

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    setProjects(updated);
    setDirty(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
        >
          + Add Project
        </button>
      </div>

      <div className="space-y-6">
        {projects.map((project, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-gray-900">Project {index + 1}</h3>
              <button
                onClick={() => handleRemove(index)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={project.name || ''}
                  onChange={(e) => handleChange(index, 'name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="My Awesome Project"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={project.description || ''}
                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Describe your project and its impact..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) =>
                    handleChange(index, 'technologies', e.target.value.split(',').map((t) => t.trim()))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Link
                </label>
                <input
                  type="url"
                  value={project.link || ''}
                  onChange={(e) => handleChange(index, 'link', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="https://github.com/user/project"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No projects added yet</p>
          <button
            onClick={handleAdd}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Showcase your projects
          </button>
        </div>
      )}
    </div>
  );
}
