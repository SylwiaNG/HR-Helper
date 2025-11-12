import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../LoginForm';

// Mock server actions
jest.mock('@/app/auth/actions', () => ({
  signIn: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe('LoginForm', () => {
  it('should render login form with all required fields', () => {
    render(<LoginForm />);

    // Check if form title is present
    expect(screen.getByRole('heading', { name: /logowanie/i })).toBeInTheDocument();

    // Check if email input is present
    expect(screen.getByLabelText(/adres e-mail/i)).toBeInTheDocument();

    // Check if password input is present
    expect(screen.getByLabelText(/hasło/i)).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByRole('button', { name: /zaloguj się/i })).toBeInTheDocument();
  });

  it('should render email input with correct attributes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/adres e-mail/i);
    
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('name', 'email');
    expect(emailInput).toHaveAttribute('required');
  });

  it('should render password input with correct attributes', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText(/hasło/i);
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('name', 'password');
    expect(passwordInput).toHaveAttribute('required');
  });

  it('should have email placeholder text', () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('jan.kowalski@example.com');
    expect(emailInput).toBeInTheDocument();
  });

  it('should render card description', () => {
    render(<LoginForm />);

    expect(
      screen.getByText(/wprowadź swoje dane, aby uzyskać dostęp do platformy/i)
    ).toBeInTheDocument();
  });
});
