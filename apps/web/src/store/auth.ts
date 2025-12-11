// apps/web/src/store/auth.ts
import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setIsLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true, // Initial state assumes loading until session check is done
  setSession: (session) => set({ session, user: session?.user || null }),
  setUser: (user) => set({ user }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  clearAuth: () => set({ session: null, user: null, isLoading: false }),
}));
