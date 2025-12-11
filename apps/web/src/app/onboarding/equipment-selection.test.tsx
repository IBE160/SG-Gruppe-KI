// apps/web/src/app/onboarding/equipment-selection.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EquipmentSelection from './equipment-selection';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store for isolated testing
jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    equipment: [],
    customEquipment: null,
    setEquipment: jest.fn(),
    setCustomEquipment: jest.fn(),
  })),
}));

describe('EquipmentSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  const mockStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.mockReturnValue({
      equipment: [],
      customEquipment: null,
      setEquipment: jest.fn(),
      setCustomEquipment: jest.fn(),
    });
  });

  it('renders correctly with initial state', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText('What equipment do you have access to?')).toBeInTheDocument();
    expect(screen.getByText('No Equipment')).toBeInTheDocument();
    expect(screen.getByText('Basic (Dumbbells, Bands)')).toBeInTheDocument();
    expect(screen.getByText('Full Gym')).toBeInTheDocument();
    expect(screen.getByText('Specify...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "No Equipment" and enables next button', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('No Equipment'));

    expect(useOnboardingStore.getState().equipment).toEqual(['No Equipment']);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting multiple equipment types', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Basic (Dumbbells, Bands)'));
    fireEvent.click(screen.getByText('Full Gym'));

    expect(useOnboardingStore.getState().equipment).toEqual(['Basic (Dumbbells, Bands)', 'Full Gym']);
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('selects "Specify..." and shows custom input field', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Specify...'));

    expect(useOnboardingStore.getState().equipment).toContain('Specify...');
    expect(screen.getByPlaceholderText('Enter your custom equipment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Disabled until custom input is filled
  });

  it('enables next button after custom input is filled when "Specify..." is selected', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Specify...'));
    const customInput = screen.getByPlaceholderText('Enter your custom equipment');
    fireEvent.change(customInput, { target: { value: 'Resistance Bands' } });

    expect(useOnboardingStore.getState().customEquipment).toBe('Resistance Bands');
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('calls onNext when next button is clicked and equipment is selected', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Full Gym'));
    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
