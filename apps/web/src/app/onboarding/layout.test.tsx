// apps/web/src/app/onboarding/layout.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import OnboardingLayout from './layout';

describe('OnboardingLayout', () => {
  it('renders the layout with header and children', () => {
    render(
      <OnboardingLayout>
        <h1>Test Child Content</h1>
      </OnboardingLayout>
    );

    // Check if the header elements are present
    expect(screen.getByRole('button', { name: /arrow_back_ios_new/i })).toBeInTheDocument();
    expect(screen.getAllByLabelText(/progress-dot/i).length).toBeGreaterThan(0); // Check for progress dots

    // Check if children are rendered
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  // Add more tests for dynamic header logic once implemented
});
