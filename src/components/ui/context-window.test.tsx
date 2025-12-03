// src/components/ui/context-window.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextWindow } from './context-window';

// Mock the shadcn/ui Dialog component to render its children directly for easier testing
jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>, // Render children directly
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
  DialogDescription: ({ children }: { children: React.ReactNode }) => <p data-testid="dialog-description">{children}</p>,
}));


describe('ContextWindow', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  test('renders correctly and opens the dialog', () => {
    render(<ContextWindow />);
    
    // Check if the trigger button is rendered
    const triggerButton = screen.getByRole('button', { name: /open context window/i });
    expect(triggerButton).toBeInTheDocument();

    // Simulate opening the dialog
    fireEvent.click(triggerButton);

    // Check if dialog content is rendered
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Quick Check-In');
    expect(screen.getByLabelText(/mood/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/energy/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/soreness/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit context/i })).toBeInTheDocument();
  });

  test('allows user to input mood, energy, soreness, and notes', () => {
    render(<ContextWindow />);
    fireEvent.click(screen.getByRole('button', { name: /open context window/i }));

    const moodSelect = screen.getByLabelText(/mood/i);
    fireEvent.change(moodSelect, { target: { value: 'motivated' } });
    expect(moodSelect).toHaveValue('motivated');

    const energySlider = screen.getByLabelText(/energy/i);
    fireEvent.change(energySlider, { target: { value: '75' } });
    expect(energySlider).toHaveValue('75');
    expect(screen.getByText('75')).toBeInTheDocument(); // Check if energy value is displayed

    const legsSorenessButton = screen.getByRole('button', { name: /legs/i });
    fireEvent.click(legsSorenessButton);
    expect(legsSorenessButton).toHaveClass('bg-blue-500'); // Check if it's selected

    const armsSorenessButton = screen.getByRole('button', { name: /arms/i });
    fireEvent.click(armsSorenessButton);
    expect(armsSorenessButton).toHaveClass('bg-blue-500');

    const notesTextarea = screen.getByLabelText(/notes/i);
    fireEvent.change(notesTextarea, { target: { value: 'Had a great workout yesterday.' } });
    expect(notesTextarea).toHaveValue('Had a great workout yesterday.');
  });

  test('submits the form with correct data', () => {
    render(<ContextWindow />);
    fireEvent.click(screen.getByRole('button', { name: /open context window/i }));

    const moodSelect = screen.getByLabelText(/mood/i);
    fireEvent.change(moodSelect, { target: { value: 'motivated' } });

    const energySlider = screen.getByLabelText(/energy/i);
    fireEvent.change(energySlider, { target: { value: '90' } });

    fireEvent.click(screen.getByRole('button', { name: /legs/i }));
    fireEvent.click(screen.getByRole('button', { name: /chest/i }));

    const notesTextarea = screen.getByLabelText(/notes/i);
    fireEvent.change(notesTextarea, { target: { value: 'Ready to crush it!' } });

    fireEvent.click(screen.getByRole('button', { name: /submit context/i }));

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith(
      'Submitting context:',
      {
        mood: 'motivated',
        energy: 90,
        soreness: ['Legs', 'Chest'],
        notes: 'Ready to crush it!',
      }
    );
  });
});
