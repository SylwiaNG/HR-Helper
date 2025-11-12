import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import KeywordsPanel from '../KeywordsPanel';
import { JobOfferDTO } from '@/types';

describe('KeywordsPanel', () => {
  const mockOffer: JobOfferDTO = {
    id: 1,
    user_id: 'test-user-id',
    title: 'Senior Developer',
    description: 'Test description',
    keywords: ['React', 'TypeScript', 'Node.js'],
    created_at: new Date().toISOString(),
  };

  const mockOnUpdate = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render title and keywords', () => {
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Słowa kluczowe')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('should show edit button in view mode', () => {
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    expect(screen.getByRole('button', { name: /edytuj/i })).toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // In edit mode, we should see save and cancel buttons
    expect(screen.getByRole('button', { name: /zapisz/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /anuluj/i })).toBeInTheDocument();
  });

  it('should show input field in edit mode', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Should show input for adding new keywords
    expect(screen.getByPlaceholderText(/dodaj słowo kluczowe/i)).toBeInTheDocument();
  });

  it('should show remove buttons for keywords in edit mode', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Each keyword should have a remove button (X)
    const removeButtons = screen.getAllByRole('button', { name: '' });
    // At least 3 remove buttons for 3 keywords (plus save, cancel, add buttons)
    expect(removeButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('should add new keyword when add button is clicked', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Type new keyword
    const input = screen.getByPlaceholderText(/dodaj słowo kluczowe/i);
    await user.type(input, 'Vue.js');

    // Click add button
    const addButton = screen.getByRole('button', { name: /dodaj/i });
    await user.click(addButton);

    // New keyword should appear
    expect(screen.getByText('Vue.js')).toBeInTheDocument();
  });

  it('should call onUpdate when save is clicked', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Click save
    const saveButton = screen.getByRole('button', { name: /zapisz/i });
    await user.click(saveButton);

    // onUpdate should be called with original keywords (no changes)
    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith(['React', 'TypeScript', 'Node.js']);
    });
  });

  it('should exit edit mode when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /anuluj/i });
    await user.click(cancelButton);

    // Should be back in view mode
    expect(screen.getByRole('button', { name: /edytuj/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /zapisz/i })).not.toBeInTheDocument();
  });

  it('should handle offer with no keywords', () => {
    const offerWithoutKeywords = { ...mockOffer, keywords: null };
    render(<KeywordsPanel offer={offerWithoutKeywords} onUpdate={mockOnUpdate} />);

    expect(screen.getByText('Słowa kluczowe')).toBeInTheDocument();
    // Should still be able to edit
    expect(screen.getByRole('button', { name: /edytuj/i })).toBeInTheDocument();
  });

  it('should prevent adding duplicate keywords', async () => {
    const user = userEvent.setup();
    render(<KeywordsPanel offer={mockOffer} onUpdate={mockOnUpdate} />);

    // Enter edit mode
    const editButton = screen.getByRole('button', { name: /edytuj/i });
    await user.click(editButton);

    // Try to add existing keyword
    const input = screen.getByPlaceholderText(/dodaj słowo kluczowe/i);
    await user.type(input, 'React');

    const addButton = screen.getByRole('button', { name: /dodaj/i });
    await user.click(addButton);

    // Should still have only 3 keywords
    const reactElements = screen.getAllByText('React');
    expect(reactElements).toHaveLength(1);
  });
});
