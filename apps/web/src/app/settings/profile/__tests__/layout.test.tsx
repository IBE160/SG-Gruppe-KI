// apps/web/src/app/settings/profile/__tests__/layout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileLayout from '../layout';
import '@testing-library/jest-dom';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ProfileLayout', () => {
  it('renders the layout with correct title and back button', () => {
    render(
      <ProfileLayout>
        <div>Test Children</div>
      </ProfileLayout>
    );

    // Check if the title is rendered
    expect(screen.getByRole('heading', { name: /user profile/i })).toBeInTheDocument();

    // Check if the back button link is rendered and points to the correct href
    const backButton = screen.getByRole('link', { name: /arrow_back_ios_new/i });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveAttribute('href', '/settings/privacy');

    // Check if children are rendered
    expect(screen.getByText('Test Children')).toBeInTheDocument();
  });
});