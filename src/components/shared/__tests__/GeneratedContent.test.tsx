import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Sparkles } from 'lucide-react';
import { GeneratedContent } from '../GeneratedContent';

describe('GeneratedContent', () => {
  const defaultProps = {
    content: '',
    icon: Sparkles,
    emptyTitle: 'Ready to Generate',
    emptyDescription: 'Fill out the form to generate content'
  };

  it('shows empty state when no content', () => {
    render(<GeneratedContent {...defaultProps} />);

    expect(screen.getByText('Ready to Generate')).toBeInTheDocument();
    expect(screen.getByText('Fill out the form to generate content')).toBeInTheDocument();
  });

  it('renders generated content when available', () => {
    const content = 'Generated test content';
    render(<GeneratedContent {...defaultProps} content={content} />);

    expect(screen.getByText('Generated Content')).toBeInTheDocument();
    expect(screen.getByText(content)).toBeInTheDocument();
  });

  it('renders copy to clipboard button with content', () => {
    const content = 'Generated test content';
    render(<GeneratedContent {...defaultProps} content={content} />);

    expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
  });
});