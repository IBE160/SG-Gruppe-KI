// apps/web/src/app/onboarding/injuries-limitations.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InjuriesLimitations from './injuries-limitations';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store for isolated testing
jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    injuriesLimitations: [],
    customInjuriesLimitations: null,
    setInjuriesLimitations: jest.fn(),
    setCustomInjuriesLimitations: jest.fn(),
  })),
}));

describe('InjuriesLimitations', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const mockStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue({
      injuriesLimitations: [],
      customInjuriesLimitations: null,
      setInjuriesLimitations: jest.fn(),
      setCustomInjuriesLimitations: jest.fn(),
    });
  });

  it('renders correctly with initial state', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText('do you have any injuries or limitations I should be aware of?')).toBeInTheDocument();
    expect(screen.getByText('Knees')).toBeInTheDocument();
    expect(screen.getByText('Shoulders')).toBeInTheDocument();
    expect(screen.getByText('Back')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Specific details or other limitations...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "None" and enables next button', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('None'));

    expect(useOnboardingStore.getState().injuriesLimitations).toEqual(['None']);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting multiple limitations', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Knees'));
    fireEvent.click(screen.getByText('Shoulders'));

    expect(useOnboardingStore.getState().injuriesLimitations).toEqual(['Knees', 'Shoulders']);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows entering custom limitations', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    const customInput = screen.getByPlaceholderText('Specific details or other limitations...');
    fireEvent.change(customInput, { target: { value: 'Tight hamstrings' } });

    expect(useOnboardingStore.getState().customInjuriesLimitations).toBe('Tight hamstrings');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('disables next button if no selection and no custom input', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled();
  });

  it('calls onNext when next button is clicked and a limitation is selected', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Back'));
    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<InjuriesLimitations onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
