import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default size', () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('w-6 h-6');
  });

  it('renders with small size', () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('w-4 h-4');
  });

  it('renders with large size', () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('w-8 h-8');
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="text-red-500" />);
    const spinner = container.firstChild;
    expect(spinner).toHaveClass('text-red-500');
  });
});