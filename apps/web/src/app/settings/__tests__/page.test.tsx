// apps/web/src/app/settings/__tests__/page.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import SettingsPage from '../page';
import '@testing-library/jest-dom'; // For extended DOM matchers

// Mock Next.js Link component since it's used for navigation
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

describe('SettingsPage', () => {
  it('renders the main heading', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('renders a search input', () => {
    render(<SettingsPage />);
    expect(screen.getByPlaceholderText('Search Settings...')).toBeInTheDocument();
  });

  it('renders navigation links to various settings sections', () => {
    render(<SettingsPage />);
    expect(screen.getByRole('link', { name: /General/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Appearance/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Health/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Playback/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /AI & Personalization/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Privacy & Account/i })).toBeInTheDocument();
  });

  it('renders the "User Profile" navigation link with correct href', () => {
    render(<SettingsPage />);
    const userProfileLinks = screen.getAllByRole('link', { name: /User Profile/i });
    expect(userProfileLinks.length).toBeGreaterThan(0); // Ensure at least one link is found
    const userProfileLink = userProfileLinks[0]; // Assert on the first one or a specific one if there are others
    expect(userProfileLink).toBeInTheDocument();
    expect(userProfileLink).toHaveAttribute('href', '/settings/profile');
  });
});
