import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CVCard from '../CVCard';
import { CVDTO } from '@/types';

describe('CVCard', () => {
  const mockCV: CVDTO = {
    id: 1,
    job_offer_id: 1,
    first_name: 'Jan',
    last_name: 'Kowalski',
    keywords: ['React', 'TypeScript', 'Node.js'],
    match_percentage: 85,
    matched_keywords_count: 3,
    status: 'new',
    created_at: new Date().toISOString(),
  };

  const mockOnStatusChange = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render CV candidate name', () => {
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
  });

  it('should display match percentage', () => {
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByText(/dopasowanie: 85%/i)).toBeInTheDocument();
  });

  it('should render all keywords as badges', () => {
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should show accept and reject buttons for new CV', () => {
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByRole('button', { name: /akceptuj/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /odrzuć/i })).toBeInTheDocument();
  });

  it('should hide accept button for already accepted CV', () => {
    const acceptedCV = { ...mockCV, status: 'accepted' as const };
    render(<CVCard cv={acceptedCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.queryByRole('button', { name: /akceptuj/i })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /odrzuć/i })).toBeInTheDocument();
  });

  it('should hide reject button for already rejected CV', () => {
    const rejectedCV = { ...mockCV, status: 'rejected' as const };
    render(<CVCard cv={rejectedCV} onStatusChange={mockOnStatusChange} />);

    expect(screen.getByRole('button', { name: /akceptuj/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /odrzuć/i })).not.toBeInTheDocument();
  });

  it('should call onStatusChange when accept button is clicked', async () => {
    const user = userEvent.setup();
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    const acceptButton = screen.getByRole('button', { name: /akceptuj/i });
    await user.click(acceptButton);

    expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'accepted');
    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
  });

  it('should call onStatusChange when reject button is clicked', async () => {
    const user = userEvent.setup();
    render(<CVCard cv={mockCV} onStatusChange={mockOnStatusChange} />);

    const rejectButton = screen.getByRole('button', { name: /odrzuć/i });
    await user.click(rejectButton);

    expect(mockOnStatusChange).toHaveBeenCalledWith(1, 'rejected');
    expect(mockOnStatusChange).toHaveBeenCalledTimes(1);
  });

  it('should handle CV with no keywords', () => {
    const cvWithoutKeywords = { ...mockCV, keywords: null };
    render(<CVCard cv={cvWithoutKeywords} onStatusChange={mockOnStatusChange} />);

    // Should still render name and percentage
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText(/dopasowanie: 85%/i)).toBeInTheDocument();
  });
});
