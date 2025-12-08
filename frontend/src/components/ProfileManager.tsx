'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Star, Copy, FileText, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

interface Profile {
  _id: string;
  profileName: string;
  isDefault: boolean;
  personalInfo: {
    firstName: string;
    lastName: string;
    title?: string;
  };
  contact: {
    email: string;
  };
  experience?: any[];
  education?: any[];
  skills?: any[];
  createdAt: string;
  updatedAt: string;
}

export default function ProfileManager() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [deletingProfile, setDeletingProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-collections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfiles(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
      toast.error('Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (profileData: any) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile-collections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Profile created successfully');
        fetchProfiles();
        setShowCreateModal(false);
      } else {
        toast.error(data.message || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Failed to create profile:', error);
      toast.error('Failed to create profile');
    }
  };

  const handleSetDefault = async (profileId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile-collections/${profileId}/set-default`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Default profile updated');
        fetchProfiles();
      } else {
        toast.error(data.message || 'Failed to set default profile');
      }
    } catch (error) {
      console.error('Failed to set default:', error);
      toast.error('Failed to set default profile');
    }
  };

  const handleDuplicate = async (profileId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile-collections/${profileId}/duplicate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({}),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Profile duplicated successfully');
        fetchProfiles();
      } else {
        toast.error(data.message || 'Failed to duplicate profile');
      }
    } catch (error) {
      console.error('Failed to duplicate:', error);
      toast.error('Failed to duplicate profile');
    }
  };

  const handleDelete = async (profileId: string) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profile-collections/${profileId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success('Profile deleted successfully');
        fetchProfiles();
        setDeletingProfile(null);
      } else {
        toast.error(data.message || 'Failed to delete profile');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('Failed to delete profile');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profiles</h2>
          <p className="text-gray-600 mt-1">
            Create multiple professional profiles and build tailored resumes for different roles
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <Plus size={20} />
          New Profile
        </button>
      </div>

      {/* Profiles Grid */}
      {profiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No profiles yet</h3>
          <p className="text-gray-600 mb-4">Create your first professional profile to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Profile
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div
              key={profile._id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition relative"
            >
              {/* Default Badge */}
              {profile.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
                  <Star size={14} className="text-yellow-600 fill-yellow-500" />
                  <span className="text-xs font-medium text-yellow-700">Default</span>
                </div>
              )}

              {/* Profile Info */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.profileName}</h3>
                <p className="text-gray-600 text-sm">
                  {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                </p>
                {profile.personalInfo.title && (
                  <p className="text-gray-500 text-sm mt-1">{profile.personalInfo.title}</p>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-4 pb-4 border-b border-gray-200">
                <span>{profile.experience?.length || 0} jobs</span>
                <span>{profile.education?.length || 0} degrees</span>
                <span>{profile.skills?.length || 0} skills</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => (window.location.href = `/profile?profileId=${profile._id}`)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDuplicate(profile._id)}
                  className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                  title="Duplicate"
                >
                  <Copy size={16} className="text-gray-600" />
                </button>
                {!profile.isDefault && (
                  <>
                    <button
                      onClick={() => handleSetDefault(profile._id)}
                      className="p-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                      title="Set as default"
                    >
                      <Star size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={() => setDeletingProfile(profile)}
                      className="p-2 border border-red-300 rounded hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </>
                )}
              </div>

              {/* View Resumes Link */}
              <button
                onClick={() => (window.location.href = `/resumes?profileId=${profile._id}`)}
                className="w-full mt-3 flex items-center justify-center gap-2 text-blue-600 text-sm hover:underline"
              >
                View Resumes
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <CreateProfileModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProfile}
        />
      )}

      {/* Delete Confirmation */}
      {deletingProfile && (
        <DeleteConfirmationModal
          profile={deletingProfile}
          onClose={() => setDeletingProfile(null)}
          onConfirm={() => handleDelete(deletingProfile._id)}
        />
      )}
    </div>
  );
}

function CreateProfileModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const [createMode, setCreateMode] = useState<'quick' | 'full'>('quick');
  const [formData, setFormData] = useState({
    profileName: '',
    personalInfo: {
      firstName: '',
      lastName: '',
      title: '',
    },
    contact: {
      email: '',
      phone: '',
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFullProfileBuilder = () => {
    // Redirect to profile page (profile builder)
    window.location.href = '/profile';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Profile</h3>
        
        {/* Mode Selection */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setCreateMode('quick')}
            className={`p-4 border-2 rounded-lg text-left transition ${
              createMode === 'quick'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">Quick Create</div>
            <div className="text-xs text-gray-600">Basic info, edit later</div>
          </button>
          <button
            type="button"
            onClick={() => setCreateMode('full')}
            className={`p-4 border-2 rounded-lg text-left transition ${
              createMode === 'full'
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-semibold text-gray-900 mb-1">Full Builder</div>
            <div className="text-xs text-gray-600">Complete profile now</div>
          </button>
        </div>

        {createMode === 'quick' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Name *
            </label>
            <input
              type="text"
              required
              value={formData.profileName}
              onChange={(e) => setFormData({ ...formData, profileName: e.target.value })}
              placeholder="e.g., Software Engineer Profile"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={formData.personalInfo.firstName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, firstName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={formData.personalInfo.lastName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    personalInfo: { ...formData.personalInfo, lastName: e.target.value },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              value={formData.personalInfo.title}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personalInfo: { ...formData.personalInfo, title: e.target.value },
                })
              }
              placeholder="e.g., Senior Software Engineer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              value={formData.contact.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value },
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Create Profile
            </button>
          </div>
        </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                You'll be redirected to the full profile builder where you can add:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1 ml-4 list-disc">
                <li>Work experience & achievements</li>
                <li>Education & certifications</li>
                <li>Skills & projects</li>
                <li>Languages & interests</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleFullProfileBuilder}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Go to Profile Builder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  profile,
  onClose,
  onConfirm,
}: {
  profile: Profile;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Profile?</h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{profile.profileName}</strong>? This action cannot
          be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
