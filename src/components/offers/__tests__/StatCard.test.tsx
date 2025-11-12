import React from 'react';
import { render, screen } from '@testing-library/react';
import StatCard from '../StatCard';

describe('StatCard', () => {
  it('should render title and numeric value', () => {
    render(<StatCard title="Total Applications" value={25} />);

    expect(screen.getByText('Total Applications')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('should render title and string value', () => {
    render(<StatCard title="Status" value="Active" />);

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('should render with value of zero', () => {
    render(<StatCard title="Rejected" value={0} />);

    expect(screen.getByText('Rejected')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should render with large numbers', () => {
    render(<StatCard title="Views" value={1234567} />);

    expect(screen.getByText('Views')).toBeInTheDocument();
    expect(screen.getByText('1234567')).toBeInTheDocument();
  });

  it('should have correct CSS classes for styling', () => {
    const { container } = render(<StatCard title="Test" value={100} />);

    // Check if card structure is present
    const titleElement = screen.getByText('Test');
    const valueElement = screen.getByText('100');

    expect(titleElement).toHaveClass('text-sm', 'font-medium');
    expect(valueElement).toHaveClass('text-2xl', 'font-bold');
  });
});
