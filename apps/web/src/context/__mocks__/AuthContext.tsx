// apps/web/src/context/__mocks__/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Mock interface for AuthContextType
interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  // Add other mocked auth related states/functions as needed for tests
}

// Create a mock context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Provide a default mocked access token and a mock setAccessToken function
  const [accessToken, setAccessToken] = useState<string | null>('mock-access-token');

  const value = {
    accessToken,
    setAccessToken: jest.fn(setAccessToken), // Mock the setter
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Mock useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // This should ideally not be thrown if the provider is correctly used in tests
    throw new Error('useAuth must be used within an AuthProvider (mock)');
  }
  return context;
};

// Also export the mock context itself for advanced testing scenarios if needed
export default AuthContext;
