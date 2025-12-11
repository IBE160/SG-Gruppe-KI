import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  unit_preference: string; // 'kg' or 'lbs'
  primary_goal?: string; // from Goals table
  training_frequency?: number; // from Goals table
  training_duration?: number; // from Goals table
  injuries_limitations?: string; // from Goals table
  equipment?: string[]; // from Equipment table (names)
}

interface ProfileState {
  userProfile: UserProfile | null;
  isEditing: boolean;
  tempProfileData: Partial<UserProfile> | null;
  
  // Actions
  setProfile: (profile: UserProfile) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  updateTempProfileData: (data: Partial<UserProfile>) => void;
  saveChanges: (updatedProfile: UserProfile) => void;
  resetState: () => void; // For logout or initial load
}

export const useProfileStore = create<ProfileState>((set) => ({
  userProfile: null,
  isEditing: false,
  tempProfileData: null,

  setProfile: (profile) => set({ userProfile: profile }),
  
  startEditing: () => set((state) => ({ 
    isEditing: true, 
    tempProfileData: state.userProfile ? { ...state.userProfile } : {} 
  })),

  cancelEditing: () => set({ 
    isEditing: false, 
    tempProfileData: null 
  }),

  updateTempProfileData: (data) => set((state) => ({
    tempProfileData: { ...state.tempProfileData, ...data }
  })),

  saveChanges: (updatedProfile) => set({
    userProfile: updatedProfile,
    isEditing: false,
    tempProfileData: null,
  }),

  resetState: () => set({
    userProfile: null,
    isEditing: false,
    tempProfileData: null,
  }),
}));