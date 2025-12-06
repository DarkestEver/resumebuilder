import { create } from 'zustand';
import { getResumes, createResume, updateResume, deleteResume, exportResumePDF } from '@/lib/api/resume';

export interface Resume {
  id?: string;
  _id?: string;
  name?: string;
  title?: string;
  templateId: string;
  customizations?: {
    colors?: { primary?: string; secondary?: string; accent?: string };
    fonts?: { heading?: string; body?: string };
    layout?: 'single-column' | 'two-column';
    hiddenSections?: string[];
  };
  visibility?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ResumeStore {
  resumes: Resume[] | null;
  selectedResume: Resume | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;

  fetchResumes: () => Promise<void>;
  selectResume: (id: string) => void;
  createResume: (data: { title?: string; name?: string; templateId: string }) => Promise<void>;
  updateResume: (id: string, data: Partial<Resume>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
  exportPDF: (id: string) => Promise<void>;
}

export const resumeStore = create<ResumeStore>((set) => ({
      resumes: null,
      selectedResume: null,
      isLoading: false,
      isSaving: false,
      error: null,

      fetchResumes: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await getResumes();
          set({ resumes: data, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch resumes',
            isLoading: false,
          });
        }
      },

      selectResume: (id: string) => {
        set((state) => ({
          selectedResume: state.resumes?.find((r) => r.id === id || r._id === id) || null,
        }));
      },

      createResume: async (data) => {
        set({ isSaving: true, error: null });
        try {
          const resume = await createResume(data);
          set((state) => ({
            resumes: state.resumes ? [...state.resumes, resume] : [resume],
            selectedResume: resume,
            isSaving: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to create resume',
            isSaving: false,
          });
        }
      },

      updateResume: async (id, data) => {
        set({ isSaving: true, error: null });
        try {
          const updated = await updateResume(id, data);
          set((state) => ({
            resumes: state.resumes?.map((r) => (r.id === id || r._id === id ? updated : r)) || null,
            selectedResume: state.selectedResume?.id === id || state.selectedResume?._id === id ? updated : state.selectedResume,
            isSaving: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update resume',
            isSaving: false,
          });
        }
      },

      deleteResume: async (id) => {
        set({ isSaving: true, error: null });
        try {
          await deleteResume(id);
          set((state) => ({
            resumes: state.resumes?.filter((r) => r.id !== id && r._id !== id) || null,
            selectedResume: state.selectedResume?.id === id || state.selectedResume?._id === id ? null : state.selectedResume,
            isSaving: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete resume',
            isSaving: false,
          });
        }
      },

      exportPDF: async (id) => {
        set({ isSaving: true, error: null });
        try {
          await exportResumePDF(id);
          set({ isSaving: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to export PDF',
            isSaving: false,
          });
        }
      },
    })
);
