"use client";

// apps/web/src/context/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'; // Import useEffect
import { supabase } from '@/lib/supabase'; // Import Supabase client
import { Session } from '@supabase/supabase-js'; // Import Session type

interface AuthContextType {
  session: Session | null; // Store the whole session
  accessToken: string | null; // Keep accessToken for convenience
  loading: boolean; // Add a loading state
  // Add other auth related states/functions as needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    // Function to get the session and set up the listener
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        setSession(session);
        setAccessToken(session?.access_token || null);
        console.log("AuthContext: Initial Session", session);
        console.log("AuthContext: Initial AccessToken", session?.access_token);
      }
      setLoading(false); // Set loading to false after initial session check
    };

    getSession(); // Call it once on mount

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setAccessToken(session?.access_token || null);
        setLoading(false); // Also set loading to false on state changes
        console.log("AuthContext: Auth State Change Event", event);
        console.log("AuthContext: Auth State Change Session", session);
        console.log("AuthContext: Auth State Change AccessToken", session?.access_token);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Run only once on mount

  const value = {
    session,
    accessToken,
    loading,
    // Add other auth related states/functions as needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
