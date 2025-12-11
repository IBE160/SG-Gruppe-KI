// apps/web/src/app/settings/profile/__tests__/layout.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProfileLayout from '../layout';

describe('ProfileLayout', () => {
  it('renders children correctly', () => {
    render(
      <ProfileLayout>
        <h1>Test Child Content</h1>
      </ProfileLayout>
    );

    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
  });

  it('renders the header with correct title', () => {
    render(
      <ProfileLayout>
        <h1>Test Child Content</h1>
      </ProfileLayout>
    );

    expect(screen.getByRole('heading', { name: 'Your Profile' })).toBeInTheDocument();
  });

  // You might want to add more specific tests for the layout structure or any interactive elements in the header if they existed.
});
