import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from './page';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the next/link component
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('DashboardPage', () => {
  it('renders the Dashboard title', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('renders the "Generate Plan" button', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('button', { name: /Generate Plan/i })).toBeInTheDocument();
  });

  it('renders the "Celebrate Your Wins" section', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Celebrate Your Wins')).toBeInTheDocument();
  });

  it('renders the "Your Widgets" section with an edit button', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Your Widgets')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('renders the Goal Progress Widget', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Goal: Bench Press')).toBeInTheDocument();
  });

  it('renders the Workout Streak Widget', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Workout Streak')).toBeInTheDocument();
    expect(screen.getByText('5 Days')).toBeInTheDocument();
  });

  it('renders the Weekly Volume Widget', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Weekly Volume')).toBeInTheDocument();
  });

  it('renders the Today\'s Context Widget', () => {
    render(<DashboardPage />);
    expect(screen.getByText("Today's Context")).toBeInTheDocument();
  });

  it('renders the Recent Workouts Widget', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
  });

  it('renders the bottom navigation bar with Dashboard, Workout, History, and Settings links', () => {
    render(<DashboardPage />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Workout')).toBeInTheDocument();
    expect(screen.getByText('History')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });
});
