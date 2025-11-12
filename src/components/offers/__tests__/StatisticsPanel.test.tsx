import React from 'react';
import { render, screen } from '@testing-library/react';
import StatisticsPanel from '../StatisticsPanel';
import { JobOfferStatsDTO } from '@/types';

describe('StatisticsPanel', () => {
  const mockStats: JobOfferStatsDTO = {
    total_cvs: 50,
    accepted: 15,
    rejected: 10,
  };

  it('should render all three stat cards', () => {
    render(<StatisticsPanel stats={mockStats} />);

    expect(screen.getByText('Total CVs')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  it('should display correct values for each stat', () => {
    render(<StatisticsPanel stats={mockStats} />);

    expect(screen.getByText('50')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('should render with zero values', () => {
    const emptyStats: JobOfferStatsDTO = {
      total_cvs: 0,
      accepted: 0,
      rejected: 0,
    };

    render(<StatisticsPanel stats={emptyStats} />);

    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(3);
  });

  it('should use grid layout for cards', () => {
    const { container } = render(<StatisticsPanel stats={mockStats} />);

    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-4', 'md:grid-cols-3');
  });
});
