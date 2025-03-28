import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PageError } from '../PageError';

describe('PageError', () => {
  it('renders with default title', () => {
    render(<PageError message="Test error message" />);
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<PageError title="Custom Error" message="Test error message" />);
    expect(screen.getByText('Custom Error')).toBeInTheDocument();
  });

  it('renders retry button when retry function is provided', () => {
    const mockRetry = vi.fn();
    render(<PageError message="Test error" retry={mockRetry} />);
    
    const retryButton = screen.getByText('Try again');
    fireEvent.click(retryButton);
    
    expect(mockRetry).toHaveBeenCalled();
  });

  it('does not render retry button when retry function is not provided', () => {
    render(<PageError message="Test error" />);
    expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  });
});