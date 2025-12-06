/**
 * Profile Store (Zustand)
 * Manages profile state and auto-save
 */

import { create } from 'zustand';
import { profileApi, ProfileData } from '@/lib/api/profile';

interface ProfileState {
  profile: ProfileData | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  isDirty: boolean;
  completionPercentage: number;
  missingSections: string[];
}

interface ProfileActions {
  fetchProfile: () => Promise<void>;
  createProfile: (data?: Partial<ProfileData>) => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  updateSection: (section: string, data: any) => Promise<void>;
  setProfile: (profile: ProfileData) => void;
  setError: (error: string | null) => void;
  setDirty: (dirty: boolean) => void;
  reset: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  isSaving: false,
  error: null,
  isDirty: false,
  completionPercentage: 0,
  missingSections: [],
};

export const profileStore = create<ProfileStore>((set) => ({
  ...initialState,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await profileApi.getProfile();
      
      // Backend returns { profile: null } if no profile exists yet
      if (!response.data.profile) {
        set({
          profile: null,
          completionPercentage: 0,
          isLoading: false,
        });
        return;
      }
      
      set({
        profile: response.data.profile,
        completionPercentage: response.data.profile?.completionPercentage || 0,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      set({ error: errorMessage, isLoading: false });
    }
  },

  createProfile: async (data: Partial<ProfileData> = {}) => {
    set({ isSaving: true, error: null });
    try {
      const response = await profileApi.createProfile(data);
      set({
        profile: response.data.profile,
        completionPercentage: response.data.profile.completionPercentage || 0,
        isSaving: false,
        isDirty: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create profile';
      set({ error: errorMessage, isSaving: false });
      throw error;
    }
  },

  updateProfile: async (data: Partial<ProfileData>) => {
    set({ isSaving: true, error: null });
    try {
      const response = await profileApi.updateProfile(data);
      set({
        profile: response.data.profile,
        completionPercentage: response.data.profile.completionPercentage || 0,
        isSaving: false,
        isDirty: false,
      });
    } catch (error: any) {
      // Extract detailed error message
      let errorMessage = 'Failed to update profile';
      if (error.response?.data) {
        const data = error.response.data;
        if (data.errors) {
          // Show detailed validation errors
          errorMessage = typeof data.errors === 'string' ? data.errors : JSON.stringify(data.errors);
        } else if (data.message) {
          errorMessage = data.message;
        }
      }
      set({ error: errorMessage, isSaving: false });
    }
  },

  updateSection: async (section: string, data: any) => {
    set({ isSaving: true, error: null });
    try {
      const response = await profileApi.updateSection(section, data);
      set({
        profile: response.data.profile,
        completionPercentage: response.data.profile.completionPercentage || 0,
        isSaving: false,
        isDirty: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update section';
      set({ error: errorMessage, isSaving: false });
    }
  },

  setProfile: (profile) => set({ profile }),

  setError: (error) => set({ error }),

  setDirty: (dirty) => set({ isDirty: dirty }),

  reset: () => set(initialState),
}));
