import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WeeklyReview from './WeeklyReview';
import { useDashboardStore } from '@/store/dashboardStore';

// Mock the zustand store to control its state in tests
jest.mock('@/store/dashboardStore', () => ({
  useDashboardStore: jest.fn(),
}));

const mockWeeklyReviewData = {
  volume: {
    value: "5,450 lbs",
    trend: "up",
    percentage_change: "15%",
    chart_svg: '<svg data-testid="volume-chart"></svg>',
  },
  intensity: {
    value: "85% 1RM",
    trend: "down",
    percentage_change: "2%",
    chart_svg: '<svg data-testid="intensity-chart"></svg>',
  },
  consistency: {
    value: "4/5 Days",
    trend: "up",
    percentage_change: "20%",
    chart_data: [
      { day: "Mon", height_percentage: "75%", trained: true },
      { day: "Tue", height_percentage: "100%", trained: false },
    ],
  },
  coach_corner: {
    message: "Your intensity has been trending down.",
    suggestion: "Implement Suggestion",
  },
};

describe('WeeklyReview', () => {
  beforeEach(() => {
    (useDashboardStore as jest.Mock).mockClear();
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: {
        weekly_review: mockWeeklyReviewData,
        // other dashboard data can be null or mocked minimally
      },
      loading: false,
      error: null,
      fetchDashboard: jest.fn(),
    });
  });

  it('renders Weekly Review sections correctly', () => {
    render(<WeeklyReview />);
    expect(screen.getByText('Volume')).toBeInTheDocument();
    expect(screen.getByText('Intensity')).toBeInTheDocument();
    expect(screen.getByText('Consistency')).toBeInTheDocument();
    expect(screen.getByText("Coach's Corner")).toBeInInTheDocument();
  });

  it('displays correct volume data and trend', () => {
    render(<WeeklyReview />);
    expect(screen.getByText('5,450 lbs')).toBeInTheDocument();
    expect(screen.getByText('15%')).toBeInTheDocument();
    expect(screen.getByText('15%').previousElementSibling).toHaveClass('text-primary'); // Check for up trend color
    expect(screen.getByText('15%').previousElementSibling).toHaveTextContent('arrow_drop_up');
  });

  it('displays correct intensity data and trend', () => {
    render(<WeeklyReview />);
    expect(screen.getByText('85% 1RM')).toBeInTheDocument();
    expect(screen.getByText('2%')).toBeInTheDocument();
    expect(screen.getByText('2%').previousElementSibling).toHaveClass('text-[#fa5538]'); // Check for down trend color
    expect(screen.getByText('2%').previousElementSibling).toHaveTextContent('arrow_drop_down');
  });

  it('displays correct consistency data and chart', () => {
    render(<WeeklyReview />);
    expect(screen.getByText('4/5 Days')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('displays Coach\'s Corner message and suggestion', () => {
    render(<WeeklyReview />);
    expect(screen.getByText('Your intensity has been trending down.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Implement Suggestion/i })).toBeInTheDocument();
  });

  it('does not render if dashboardData is null or loading', () => {
    (useDashboardStore as jest.Mock).mockReturnValue({
      dashboardData: null,
      loading: true,
      error: null,
      fetchDashboard: jest.fn(),
    });
    const { container } = render(<WeeklyReview />);
    expect(container).toBeEmptyDOMElement();
  });
});
