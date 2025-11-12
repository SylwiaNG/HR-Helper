import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResetPasswordForm } from '../ResetPasswordForm';

// Mock the server actions
jest.mock('@/app/auth/actions', () => ({
  resetPassword: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with email input', () => {
    render(<ResetPasswordForm />);

    expect(screen.getByText('Resetowanie hasła')).toBeInTheDocument();
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /wyślij link/i })).toBeInTheDocument();
  });

  it('should have email input with correct attributes', () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByLabelText(/adres e-mail/i) as HTMLInputElement;
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('id', 'email');
    expect(emailInput).toBeRequired();
  });

  it('should display card description', () => {
    render(<ResetPasswordForm />);

    expect(screen.getByText(/podaj swój adres e-mail/i)).toBeInTheDocument();
  });

  it('should have email placeholder', () => {
    render(<ResetPasswordForm />);

    const emailInput = screen.getByPlaceholderText('jan.kowalski@example.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('should have submit button with correct type', () => {
    render(<ResetPasswordForm />);

    const submitButton = screen.getByRole('button', { name: /wyślij link/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });
});
