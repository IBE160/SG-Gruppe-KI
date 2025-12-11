import { create } from 'zustand';

interface Session {
  access_token: string;
  // Add other session properties as needed
}

interface AuthState {
  session: Session | null;
  user: any | null; // Placeholder for user object
  isLoading: boolean;

  setSession: (session: Session | null) => void;
  setUser: (user: any | null) => void;
  setIsLoading: (loading: boolean) => void;
  // Add other auth-related actions
}

export const useAuthStore = create<AuthState>((set) => ({
  session: { access_token: 'mock_jwt_token' }, // Mock session for development
  user: { id: 'user-123', email: 'test@example.com' }, // Mock user for development
  isLoading: false,

  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
}));