// apps/web/src/app/onboarding/layout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import for additional matchers
import OnboardingLayout from './layout';
import { useRouter } from 'next/navigation'; // Import useRouter

// Mock the next/link component
jest.mock('next/link', () => {
  return ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock useRouter for navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
  })),
}));


describe('OnboardingLayout', () => {
  it('renders the layout with header and children', () => {
    render(
      <OnboardingLayout>
        <h1>Test Child Content</h1>
      </OnboardingLayout>
    );

    // Check if the header elements are present
    // Change query to use the accessible name "Back" instead of the icon text
    expect(screen.getByRole('link', { name: /Back/i })).toBeInTheDocument();
    expect(screen.getAllByLabelText(/progress-dot/i).length).toBeGreaterThan(0); // Check for progress dots

    // Check if children are rendered
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  // Add more tests for dynamic header logic once implemented
});
