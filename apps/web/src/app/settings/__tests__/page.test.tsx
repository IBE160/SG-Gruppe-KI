// apps/web/src/app/settings/__tests__/page.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../page';
import '@testing-library/jest-dom';
import { AuthProvider } from '@/context/AuthContext'; // Import the mock AuthProvider

// Mock Next.js Link component since it's used for navigation
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('SettingsPage', () => {
  it('renders the main heading', () => {
    render(
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    );
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders a search input', () => {
    render(
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    );
    expect(screen.getByPlaceholderText('Search Settings...')).toBeInTheDocument();
  });

  it('renders navigation links to various settings sections', () => {
    render(
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    );
    expect(screen.getByRole('link', { name: /General/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Appearance/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Health/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Playback/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /AI & Personalization/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy & Account/i })).toBeInTheDocument();
  });

  it('renders the "User Profile" navigation link with correct href', () => {
    render(
      <AuthProvider>
        <SettingsPage />
      </AuthProvider>
    );
    const userProfileLinks = screen.getAllByRole('link', { name: /User Profile/i });
    expect(userProfileLinks.length).toBeGreaterThan(0);
    const userProfileLink = userProfileLinks[0];
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute('href', '/settings/profile');
  });
});

