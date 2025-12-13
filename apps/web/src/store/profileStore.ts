// apps/web/src/store/profileStore.ts
import { create } from 'zustand';

// Define the shape of the user profile data
// This should eventually be replaced with a proper UserProfile type
interface UserProfileData {
  email: string;
  unit_preference: string;
  primary_goal?: string;
  training_frequency?: number;
  training_duration?: number;
  injuries_limitations?: string;
  equipment?: string[];
  // Add other profile fields as they become relevant
}

interface ProfileState {
  isEditing: boolean;
  // This will hold the data currently being edited, allowing to cancel without saving
  tempUserData: UserProfileData | null;
  // This will hold the actual current user data fetched from the backend
  currentUserData: UserProfileData | null; 
}

interface ProfileActions {
  startEditing: (initialData: UserProfileData) => void;
  cancelEditing: () => void;
  updateTempUserData: (data: Partial<UserProfileData>) => void;
  setCurrentUserData: (data: UserProfileData) => void;
  resetTempUserData: () => void;
}

type ProfileStore = ProfileState & ProfileActions;

const initialState: ProfileState = {
  isEditing: false,
  tempUserData: null,
  currentUserData: null,
};

export const useProfileStore = create<ProfileStore>((set) => ({
  ...initialState, // Initialize with default values

  startEditing: (initialData) => set({ isEditing: true, tempUserData: { ...initialData } }),
  cancelEditing: () => set((state) => ({ isEditing: false, tempUserData: state.currentUserData ? { ...state.currentUserData } : null })), // Revert to current data or null
  updateTempUserData: (data) =>
    set((state) => ({
      tempUserData: state.tempUserData ? { ...state.tempUserData, ...data } : { ...data } as UserProfileData,
    })),
  setCurrentUserData: (data) => set({ currentUserData: data, tempUserData: data ? { ...data } : null }), // Also update temp on initial set
  resetTempUserData: () => set((state) => ({ tempUserData: state.currentUserData ? { ...state.currentUserData } : null })),
  resetState: () => set(initialState), // New action to reset the state
}));
