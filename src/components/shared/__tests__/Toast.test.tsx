import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Toast } from '../Toast';

describe('Toast', () => {
  const mockOnClose = vi.fn();
  const defaultProps = {
    id: 1,
    type: 'success' as const,
    message: 'Test message',
    onClose: mockOnClose,
  };

  it('renders success toast correctly', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });

  it('renders error toast correctly', () => {
    render(<Toast {...defaultProps} type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');
  });

  it('renders info toast correctly', () => {
    render(<Toast {...defaultProps} type="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-50');
  });

  it('calls onClose when close button is clicked', () => {
    render(<Toast {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClose).toHaveBeenCalledWith(1);
  });
});