import React from 'react';
import { render, screen } from '@testing-library/react';
import CVList from '../CVList';
import { CVDTO } from '@/types';

describe('CVList', () => {
  const mockCVs: CVDTO[] = [
    {
      id: 1,
      job_offer_id: 1,
      first_name: 'Jan',
      last_name: 'Kowalski',
      keywords: ['React', 'TypeScript'],
      match_percentage: 85,
      matched_keywords_count: 2,
      status: 'new',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      job_offer_id: 1,
      first_name: 'Anna',
      last_name: 'Nowak',
      keywords: ['JavaScript'],
      match_percentage: 70,
      matched_keywords_count: 1,
      status: 'new',
      created_at: new Date().toISOString(),
    },
  ];

  const mockOnStatusChange = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title with CV count', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={mockCVs}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Zakwalifikowane (2)')).toBeInTheDocument();
  });

  it('should render all CVs in the list', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={mockCVs}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
    expect(screen.getByText('Anna Nowak')).toBeInTheDocument();
  });

  it('should apply green background for qualified CVs', () => {
    const { container } = render(
      <CVList
        title="Zakwalifikowane"
        cvs={mockCVs}
        onStatusChange={mockOnStatusChange}
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-green-50');
  });

  it('should apply red background for rejected CVs', () => {
    const { container } = render(
      <CVList
        title="Odrzucone"
        cvs={mockCVs}
        onStatusChange={mockOnStatusChange}
      />
    );

    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-red-50');
  });

  it('should display empty message when no CVs', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={[]}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Brak CV w tej kategorii.')).toBeInTheDocument();
  });

  it('should show zero count when no CVs', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={[]}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Zakwalifikowane (0)')).toBeInTheDocument();
  });

  it('should pass onStatusChange prop to each CVCard', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={mockCVs}
        onStatusChange={mockOnStatusChange}
      />
    );

    // Both CVCards should render accept buttons
    const acceptButtons = screen.getAllByRole('button', { name: /akceptuj/i });
    expect(acceptButtons).toHaveLength(2);
  });

  it('should render with single CV', () => {
    render(
      <CVList
        title="Zakwalifikowane"
        cvs={[mockCVs[0]]}
        onStatusChange={mockOnStatusChange}
      />
    );

    expect(screen.getByText('Zakwalifikowane (1)')).toBeInTheDocument();
    expect(screen.getByText('Jan Kowalski')).toBeInTheDocument();
  });
});
