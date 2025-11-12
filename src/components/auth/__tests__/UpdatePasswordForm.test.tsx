import React from 'react';
import { render, screen } from '@testing-library/react';
import { UpdatePasswordForm } from '../UpdatePasswordForm';

// Mock the server actions
jest.mock('@/app/auth/actions', () => ({
  updatePassword: jest.fn(),
}));

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render form with password fields', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByText('Aktualizacja hasła')).toBeInTheDocument();
    const passwordInputs = screen.getAllByLabelText(/hasło/i);
    expect(passwordInputs).toHaveLength(2);
    expect(screen.getByRole('button', { name: /zaktualizuj hasło/i })).toBeInTheDocument();
  });

  it('should have password inputs with correct attributes', () => {
    render(<UpdatePasswordForm />);

    const passwordInputs = screen.getAllByLabelText(/hasło/i) as HTMLInputElement[];
    passwordInputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'password');
      expect(input).toBeRequired();
    });
  });

  it('should display card description', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByText(/wprowadź nowe hasło, aby odzyskać dostęp/i)).toBeInTheDocument();
  });

  it('should have submit button with correct type', () => {
    render(<UpdatePasswordForm />);

    const submitButton = screen.getByRole('button', { name: /zaktualizuj hasło/i });
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('should have two password fields (new password and confirm)', () => {
    render(<UpdatePasswordForm />);

    expect(screen.getByLabelText('Nowe hasło')).toBeInTheDocument();
    expect(screen.getByLabelText('Powtórz nowe hasło')).toBeInTheDocument();
  });
});
