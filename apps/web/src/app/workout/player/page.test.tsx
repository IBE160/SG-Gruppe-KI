// apps/web/src/app/workout/player/page.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutPlayerPage from './page';

// Mock useRouter from next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  })),
}));

describe('WorkoutPlayerPage', () => {
  it('renders correctly', () => {
    render(<WorkoutPlayerPage />);
    expect(screen.getByText('MAIN WORKOUT')).toBeInTheDocument();
    expect(screen.getByText('Barbell Squat')).toBeInTheDocument();
    expect(screen.getByText('START SET 1')).toBeInTheDocument();
    expect(screen.getByText('Exercises')).toBeInTheDocument();
    expect(screen.getByText('1/2')).toBeInTheDocument(); // 1/2 from mock data
  });

  it('displays the current exercise details', () => {
    render(<WorkoutPlayerPage />);
    // Check exercise name
    expect(screen.getByRole('heading', { level: 2, name: 'Barbell Squat' })).toBeInTheDocument();
    // Check target metrics
    expect(screen.getByText('SETS')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // From mock data
    expect(screen.getByText('REPS')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument(); // From mock data
    expect(screen.getByText('RPE')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument(); // From mock data
  });

  it('displays navigation links in the footer', () => {
    render(<WorkoutPlayerPage />);
    expect(screen.getByRole('link', { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Workout/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /History/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Settings/i })).toBeInTheDocument();
  });
});