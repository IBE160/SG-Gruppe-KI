import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MetricsDisplay from './MetricsDisplay';
import { useDashboardStore } from '@/store/dashboardStore';
import { fetchDashboardData } from '@/lib/api/dashboard';

// Mock the next/image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the fetchDashboardData function
jest.mock('@/lib/api/dashboard', () => ({
  fetchDashboardData: jest.fn(),
}));

// Mock the zustand store to control its state in tests
jest.mock('@/store/dashboardStore', () => ({
  useDashboardStore: jest.fn(),
}));

const mockDashboardData = {
  goal_progress: {
    name: 'Bench Press',
    current: 85,
    target: 100,
    unit: 'kg',
  },
  workout_streak: {
    days: 5,
  },
  weekly_volume: {
    total: 5450,
    unit: 'lbs',
    chart_data_url: 'mock_chart_url',
  },
  todays_context: {
    message: 'You seem rested.',
  },
  recent_workouts: [
    { name: 'Push Day', date: 'Yesterday' },
    { name: 'Leg Day', date: 'Mar 15' },
  ],
};

describe('MetricsDisplay', () => {
  beforeEach(() => {
    // Reset mocks before each test
    (fetchDashboardData as jest.Mock).mockClear();
    (useDashboardStore as jest.Mock).mockClear();

    // Default mock for Zustand store state
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: null,
      loading: false,
      error: null,
      fetchDashboard: jest.fn(),
    });
  });

  it('renders loading state initially', () => {
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: null,
      loading: true,
      error: null,
      fetchDashboard: jest.fn(),
    });
    render(<MetricsDisplay />);
    expect(screen.getByText('Loading dashboard data...')).toBeInTheDocument();
  });

  it('renders error state if data fetching fails', async () => {
    const mockFetchDashboard = jest.fn().mockImplementationOnce(async () => {
      throw new Error('API Error');
    });
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: null,
      loading: false,
      error: 'Failed to load dashboard data.',
      fetchDashboard: mockFetchDashboard,
    });
    render(<MetricsDisplay />);
    expect(screen.getByText('Failed to load dashboard data.')).toBeInTheDocument();
  });

  it('renders dashboard data when successfully fetched', async () => {
    const mockFetchDashboard = jest.fn();
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: mockDashboardData,
      loading: false,
      error: null,
      fetchDashboard: mockFetchDashboard,
    });
    render(<MetricsDisplay />);

    // Assert that the fetchDashboard was called
    expect(mockFetchDashboard).toHaveBeenCalledTimes(1);

    // Assert elements from mock data are displayed
    expect(screen.getByText('Goal: Bench Press')).toBeInTheDocument();
    expect(screen.getByText('85kg / 100kg')).toBeInTheDocument();
    expect(screen.getByText('5 Days')).toBeInTheDocument();
    expect(screen.getByText('Workout Streak')).toBeInTheDocument();
    expect(screen.getByText('Weekly Volume')).toBeInTheDocument();
    expect(screen.getByText("Today's Context")).toBeInTheDocument();
    expect(screen.getByText('You seem rested.')).toBeInTheDocument();
    expect(screen.getByText('Recent Workouts')).toBeInTheDocument();
    expect(screen.getByText('Push Day')).toBeInTheDocument();
    expect(screen.getByText('Leg Day')).toBeInTheDocument();
  });
});
