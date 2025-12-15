
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExportDataPage from '../page';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock API client
const mockExportData = jest.fn();
jest.mock('@/lib/api', () => ({
  api: {
    exportData: (token: string) => mockExportData(token),
  },
}));

describe('ExportDataPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Screen 1 (request form) initially', () => {
    render(<ExportDataPage />);
    expect(screen.getByRole('heading', { name: /Export Your Data/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Request Data Export/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Export Request Received!/i })).not.toBeInTheDocument();
  });

  it('navigates back to privacy settings when back button is clicked', () => {
    render(<ExportDataPage />);
    const backButton = screen.getByRole('link', { name: /arrow_back_ios_new/i }); // Assuming Material Symbol as accessibility label
    expect(backButton).toHaveAttribute('href', '/settings/privacy');
  });

  it('transitions to Screen 2 (confirmation) on successful data export request', async () => {
    mockExportData.mockResolvedValue({ data: { message: 'Export initiated' } });

    render(<ExportDataPage />);
    const requestButton = screen.getByRole('button', { name: /Request Data Export/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(mockExportData).toHaveBeenCalledTimes(1);
      expect(mockExportData).toHaveBeenCalledWith('YOUR_AUTH_TOKEN_HERE'); // Check if token passed
      expect(screen.getByRole('heading', { name: /Export Request Received!/i })).toBeInTheDocument();
      expect(screen.getByText(/Your data export is now being compiled./i)).toBeInTheDocument();
    });
  });

  it('displays an error message if data export request fails', async () => {
    mockExportData.mockResolvedValue({ error: { message: 'Failed to initiate export' } });

    render(<ExportDataPage />);
    const requestButton = screen.getByRole('button', { name: /Request Data Export/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(mockExportData).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/Failed to initiate export/i)).toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: /Export Request Received!/i })).not.toBeInTheDocument();
    });
  });

  it('disables request button while loading', async () => {
    mockExportData.mockReturnValue(new Promise(() => {})); // Never resolve to simulate loading

    render(<ExportDataPage />);
    const requestButton = screen.getByRole('button', { name: /Request Data Export/i });
    fireEvent.click(requestButton);

    await waitFor(() => {
      expect(requestButton).toBeDisabled();
      expect(requestButton).toHaveTextContent('Requesting...');
    });
  });

  it('navigates to settings/privacy when "Go to Settings" is clicked from confirmation screen', async () => {
    mockExportData.mockResolvedValue({ data: { message: 'Export initiated' } });
    render(<ExportDataPage />);
    fireEvent.click(screen.getByRole('button', { name: /Request Data Export/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /Export Request Received!/i })).toBeInTheDocument());

    const goToSettingsButton = screen.getByRole('button', { name: /Go to Settings/i });
    fireEvent.click(goToSettingsButton);
    expect(mockPush).toHaveBeenCalledWith('/settings/privacy');
  });

  it('navigates to dashboard when "Go to Dashboard" is clicked from confirmation screen', async () => {
    mockExportData.mockResolvedValue({ data: { message: 'Export initiated' } });
    render(<ExportDataPage />);
    fireEvent.click(screen.getByRole('button', { name: /Request Data Export/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: /Export Request Received!/i })).toBeInTheDocument());

    const goToDashboardButton = screen.getByRole('button', { name: /Go to Dashboard/i });
    fireEvent.click(goToDashboardButton);
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });
});
