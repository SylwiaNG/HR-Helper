import React from 'react';
import { render, screen } from '@testing-library/react';
import { SignOutButton } from '../SignOutButton';

// Mock server actions
jest.mock('@/app/auth/actions', () => ({
  signOut: jest.fn(),
}));

describe('SignOutButton', () => {
  it('should render sign out button', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /wyloguj/i });
    expect(button).toBeInTheDocument();
  });

  it('should render button with outline variant', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /wyloguj/i });
    // Button component adds specific classes for outline variant
    expect(button).toHaveClass('border', 'bg-background', 'shadow-xs');
  });

  it('should render as submit button in a form', () => {
    render(<SignOutButton />);

    const button = screen.getByRole('button', { name: /wyloguj/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should be wrapped in a form element', () => {
    const { container } = render(<SignOutButton />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
    expect(form).toContainElement(screen.getByRole('button', { name: /wyloguj/i }));
  });
});
