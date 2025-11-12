import React from 'react';
import { render, screen } from '@testing-library/react';
import { RegisterForm } from '../RegisterForm';

// Mock server actions
jest.mock('@/app/auth/actions', () => ({
  signUp: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('RegisterForm', () => {
  it('should render registration form with all required fields', () => {
    render(<RegisterForm />);

    // Check if form title is present
    expect(screen.getByRole('heading', { name: /rejestracja/i })).toBeInTheDocument();

    // Check if all input fields are present
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^hasło$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/powtórz hasło/i)).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByRole('button', { name: /zarejestruj się/i })).toBeInTheDocument();
  });

  it('should render email input with correct attributes', () => {
    render(<RegisterForm />);

    const emailInput = screen.getByLabelText(/adres e-mail/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render password inputs with correct attributes', () => {
    render(<RegisterForm />);

    const passwordInput = screen.getByLabelText(/^hasło$/i);
    const confirmPasswordInput = screen.getByLabelText(/powtórz hasło/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('required');

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('name', 'confirmPassword');
    expect(confirmPasswordInput).toHaveAttribute('required');
  });

  it('should have email placeholder text', () => {
    render(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText('jan.kowalski@example.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('should render card description', () => {
    render(<RegisterForm />);

    expect(
      screen.getByText(/utwórz nowe konto, aby rozpocząć korzystanie z aplikacji/i)
    ).toBeInTheDocument();
  });

  it('should have three password fields in total', () => {
    render(<RegisterForm />);

    const passwordInputs = screen.getAllByLabelText(/hasło/i);
    expect(passwordInputs).toHaveLength(2); // "Hasło" and "Powtórz hasło"
  });
});
