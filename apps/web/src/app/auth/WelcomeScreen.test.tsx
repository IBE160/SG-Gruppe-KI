// apps/web/src/app/auth/WelcomeScreen.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeScreen from './WelcomeScreen';

// Mock the next/link component as it's used in WelcomeScreen
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('WelcomeScreen', () => {
  it('renders correctly with main elements', () => {
    render(<WelcomeScreen />);

    expect(screen.getByText('Your Personal AI Trainer')).toBeInTheDocument();
    expect(screen.getByText('Smart, personalized workouts that adapt to you.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByText(/Terms of Service/i)).toBeInTheDocument();
    expect(screen.getByText(/Privacy Policy/i)).toBeInTheDocument();
  });

  it('calls handleCreateAccount when "Create Account" button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<WelcomeScreen />);

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Create Account clicked');
    consoleSpy.mockRestore();
  });

  it('calls handleLogIn when "Log In" button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<WelcomeScreen />);

    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));
    expect(consoleSpy).toHaveBeenCalledWith('Log In clicked');
    consoleSpy.mockRestore();
  });

  it('calls handleGoogleLogin when Google button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<WelcomeScreen />);

    // Assuming the Google button can be found by its SVG content or a more specific role/label if added
    // For now, let's target based on the presence of "Or continue with" and then find buttons
    // This is a bit brittle, ideally, we'd add accessible names to the social buttons
    const socialButtons = screen.getAllByRole('button');
    // Assuming Google button is the first after Create Account and Log In
    fireEvent.click(socialButtons[2]); // Adjust index if more buttons are added or order changes
    expect(consoleSpy).toHaveBeenCalledWith('Google login clicked');
    consoleSpy.mockRestore();
  });

  it('calls handleAppleLogin when Apple button is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log');
    render(<WelcomeScreen />);

    const socialButtons = screen.getAllByRole('button');
    // Assuming Apple button is the second after Create Account and Log In
    fireEvent.click(socialButtons[3]); // Adjust index if more buttons are added or order changes
    expect(consoleSpy).toHaveBeenCalledWith('Apple login clicked');
    consoleSpy.mockRestore();
  });
});