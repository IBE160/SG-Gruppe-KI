// apps/web/src/components/PlanReview/PlanReview.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PlanReview } from './PlanReview';

// Mock the MaterialSymbol component
jest.mock('@/components/MaterialSymbol', () => ({
  MaterialSymbol: ({ icon, className }: { icon: string; className?: string }) => (
    <span className={`mock-material-symbol ${className}`}>{icon}</span>
  ),
}));

describe('PlanReview', () => {
  it('renders the plan details correctly', () => {
    render(<PlanReview />);

    // Check for header
    expect(screen.getByText('Review Your Plan')).toBeInTheDocument();

    // Check for AI explanation
    expect(screen.getByText('Plan Adjusted!')).toBeInTheDocument();
    expect(screen.getByText("We've added a challenge because you're feeling motivated and energetic today. Let's do this!")).toBeInTheDocument();

    // Check for exercises
    expect(screen.getByText('Barbell Squats')).toBeInTheDocument();
    expect(screen.getByText('4 sets x 8-10')).toBeInTheDocument();
    expect(screen.getByText('MODIFIED')).toBeInTheDocument();

    expect(screen.getByText('Push-ups')).toBeInTheDocument();
    expect(screen.getByText('3 sets x 15')).toBeInTheDocument();

    expect(screen.getByText('Kettlebell Swings')).toBeInTheDocument();
    expect(screen.getByText('3 sets x 12')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();

    expect(screen.getByText('Plank')).toBeInTheDocument();
    expect(screen.getByText('3 sets x 45 sec')).toBeInTheDocument();
  });

  it('renders the action buttons', () => {
    render(<PlanReview />);
    expect(screen.getByRole('button', { name: 'Confirm Plan' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit Plan' })).toBeInTheDocument();
  });
});
