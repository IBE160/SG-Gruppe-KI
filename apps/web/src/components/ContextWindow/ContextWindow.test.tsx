// apps/web/src/components/ContextWindow/ContextWindow.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ContextWindow } from './ContextWindow';

// Mock the MaterialSymbol component as it's an external dependency
jest.mock('@/components/MaterialSymbol', () => ({
  MaterialSymbol: ({ icon, className }: { icon: string; className?: string }) => (
    <span className={`mock-material-symbol ${className}`}>{icon}</span>
  ),
}));

describe('ContextWindow', () => {
  beforeEach(() => {
    // Reset the mock for each test if necessary
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ContextWindow />);
    expect(screen.getByText('Your Daily Plan')).toBeInTheDocument();
    expect(screen.getByText('How are you feeling today?')).toBeInTheDocument();
    expect(screen.getByText("Generate Today's Plan")).toBeInTheDocument();
  });

  it('allows mood selection', () => {
    // Mock Date to be a non-Monday for consistent default
    const mockDate = new Date('2025-12-16T12:00:00.000Z'); // Tuesday, Dec 16, 2025
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);
    render(<ContextWindow />);

    const neutralMood = screen.getByLabelText(/Neutral/i);
    const motivatedMood = screen.getByLabelText(/Motivated/i);

    expect(neutralMood).toBeChecked(); 

    fireEvent.click(motivatedMood);
    expect(motivatedMood).toBeChecked();
    expect(neutralMood).not.toBeChecked();

    jest.spyOn(global, 'Date').mockRestore();
  });

  it('allows energy level selection', () => {
    // Mock Date to be a non-Monday for consistent default
    const mockDate = new Date('2025-12-16T12:00:00.000Z'); // Tuesday, Dec 16, 2025
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    render(<ContextWindow />);

    const mediumEnergy = screen.getByLabelText(/Medium/i);
    const highEnergy = screen.getByLabelText(/High/i);

    expect(mediumEnergy).toBeChecked();

    fireEvent.click(highEnergy);
    expect(highEnergy).toBeChecked();
    expect(mediumEnergy).not.toBeChecked();

    jest.spyOn(global, 'Date').mockRestore();
  });

  it('allows soreness input', () => {
    render(<ContextWindow />);
    const sorenessInput = screen.getByPlaceholderText(/Any specific muscle soreness/i);

    fireEvent.change(sorenessInput, { target: { value: 'Lower back is tight' } });
    expect(sorenessInput).toHaveValue('Lower back is tight');
  });

  it('initializes mood and energy based on current day (Monday scenario)', () => {
    // Mock Date to be a Monday
    const mockDate = new Date('2025-12-15T12:00:00.000Z'); // Monday, Dec 15, 2025
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    render(<ContextWindow />);

    expect(screen.getByLabelText(/Motivated/i)).toBeChecked();
    expect(screen.getByLabelText(/High/i)).toBeChecked();

    // Restore original Date
    jest.spyOn(global, 'Date').mockRestore();
  });

  it('initializes mood and energy based on current day (non-Monday scenario)', () => {
    // Mock Date to be a Tuesday
    const mockDate = new Date('2025-12-16T12:00:00.000Z'); // Tuesday, Dec 16, 2025
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

    render(<ContextWindow />);

    expect(screen.getByLabelText(/Neutral/i)).toBeChecked();
    expect(screen.getByLabelText(/Medium/i)).toBeChecked();

    // Restore original Date
    jest.spyOn(global, 'Date').mockRestore();
  });

  it('calls generatePlan with correct context on submit', async () => {
    // Mock generatePlan to resolve successfully
    (generatePlan as jest.Mock).mockResolvedValue({ message: 'Plan generated', data: {} });

    render(<ContextWindow />);

    // Simulate user input
    fireEvent.click(screen.getByLabelText(/Motivated/i));
    fireEvent.click(screen.getByLabelText(/High/i));
    fireEvent.change(screen.getByPlaceholderText(/Any specific muscle soreness/i), { target: { value: 'Arms are sore' } });

    fireEvent.click(screen.getByText("Generate Today's Plan"));

    await waitFor(() => {
      expect(generatePlan).toHaveBeenCalledTimes(1);
      expect(generatePlan).toHaveBeenCalledWith({
        mood: 'Motivated',
        energy: 'High',
        soreness: 'Arms are sore',
      });
    });
  });

  it('shows loading state during API call', async () => {
    // Mock generatePlan to be a pending promise
    (generatePlan as jest.Mock).mockReturnValue(new Promise(() => {}));

    render(<ContextWindow />);
    const submitButton = screen.getByText("Generate Today's Plan");

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveTextContent('Generating Plan...');
  });

  it('displays error message on API call failure', async () => {
    // Mock generatePlan to reject with an error
    const errorMessage = 'Network error occurred!';
    (generatePlan as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(<ContextWindow />);
    const submitButton = screen.getByText("Generate Today's Plan");

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
      expect(submitButton).toHaveTextContent("Generate Today's Plan");
    });
  });
});
