// apps/web/src/app/onboarding/equipment-selection.test.tsx
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import EquipmentSelection from './equipment-selection';
import { useOnboardingStore } from '@/store/onboardingStore';

// Mock the zustand store directly to control its state for testing
let mockEquipmentState = [];
let mockCustomEquipmentState = '';
const mockSetEquipment = jest.fn((newEquipment) => {
  mockEquipmentState = newEquipment;
});
const mockSetCustomEquipment = jest.fn((newCustomEquipment) => {
  mockCustomEquipmentState = newCustomEquipment;
});

jest.mock('@/store/onboardingStore', () => ({
  useOnboardingStore: jest.fn(() => ({
    equipment: mockEquipmentState,
    customEquipment: mockCustomEquipmentState,
    setEquipment: mockSetEquipment,
    setCustomEquipment: mockSetCustomEquipment,
  })),
}));

describe('EquipmentSelection', () => {
  const mockOnNext = jest.fn();
  const mockOnBack = jest.fn();

  // Reference to the mocked hook for convenience
  const mockedUseOnboardingStore = useOnboardingStore as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEquipmentState = []; // Reset state for each test
    mockCustomEquipmentState = ''; // Reset state for each test

    // Reset the mock implementation for each test to ensure fresh state
    mockedUseOnboardingStore.mockImplementation(() => ({
      equipment: mockEquipmentState,
      customEquipment: mockCustomEquipmentState,
      setEquipment: mockSetEquipment,
      setCustomEquipment: mockSetCustomEquipment,
    }));
  });

  it('renders correctly with initial state', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByText(/What equipment do you have access to?/i)).toBeInTheDocument();
    expect(screen.getByText('No Equipment')).toBeInTheDocument();
    expect(screen.getByText('Basic (Dumbbells, Bands)')).toBeInTheDocument();
    expect(screen.getByText('Full Gym')).toBeInTheDocument();
    expect(screen.getByText('Specify...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Next button should be disabled initially
  });

  it('allows selecting "No Equipment" and enables next button', () => {
    const { rerender } = render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('No Equipment'));
    expect(mockSetEquipment).toHaveBeenCalledWith(['No Equipment']);

    // Manually update the mock state and rerender the component
    act(() => {
      mockEquipmentState = ['No Equipment'];
      // Crucially, re-mock the hook's return value after state change
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('allows selecting multiple equipment types', () => {
    const { rerender } = render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Basic (Dumbbells, Bands)'));
    expect(mockSetEquipment).toHaveBeenCalledWith(['Basic (Dumbbells, Bands)']);
    act(() => {
      mockEquipmentState = ['Basic (Dumbbells, Bands)'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);


    fireEvent.click(screen.getByText('Full Gym'));
    expect(mockSetEquipment).toHaveBeenCalledWith(['Basic (Dumbbells, Bands)', 'Full Gym']);
    act(() => {
      mockEquipmentState = ['Basic (Dumbbells, Bands)', 'Full Gym'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('selects "Specify..." and shows custom input field', () => {
    const { rerender } = render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Specify...'));
    expect(mockSetEquipment).toHaveBeenCalledWith(['Specify...']);
    act(() => {
      mockEquipmentState = ['Specify...'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);


    expect(screen.getByPlaceholderText('Enter your custom equipment')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeDisabled(); // Disabled until custom input is filled
  });

  it('enables next button after custom input is filled when "Specify..." is selected', () => {
    const { rerender } = render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Specify...'));
    expect(mockSetEquipment).toHaveBeenCalledWith(['Specify...']);
    act(() => {
      mockEquipmentState = ['Specify...'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);


    const customInput = screen.getByPlaceholderText('Enter your custom equipment');
    fireEvent.change(customInput, { target: { value: 'Resistance Bands' } });
    expect(mockSetCustomEquipment).toHaveBeenCalledWith('Resistance Bands');

    act(() => {
      mockCustomEquipmentState = 'Resistance Bands';
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    expect(screen.getByRole('button', { name: /arrow_forward/i })).toBeEnabled();
  });

  it('calls onNext when next button is clicked and equipment is selected', () => {
    const { rerender } = render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByText('Full Gym')); // This will call setEquipment
    expect(mockSetEquipment).toHaveBeenCalledWith(['Full Gym']);
    act(() => {
      mockEquipmentState = ['Full Gym'];
      mockedUseOnboardingStore.mockImplementation(() => ({
        equipment: mockEquipmentState,
        customEquipment: mockCustomEquipmentState,
        setEquipment: mockSetEquipment,
        setCustomEquipment: mockSetCustomEquipment,
      }));
    });
    rerender(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_forward/i }));

    expect(mockOnNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when back button is clicked', () => {
    render(<EquipmentSelection onNext={mockOnNext} onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /arrow_back/i }));

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
