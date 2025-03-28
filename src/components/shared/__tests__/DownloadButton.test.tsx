import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DownloadButton } from '../DownloadButton';

describe('DownloadButton', () => {
  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();
  });

  it('renders download button', () => {
    render(
      <DownloadButton
        content="Test content"
        filename="test-file"
      />
    );

    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('handles download when clicked', () => {
    const mockClick = vi.fn();
    const mockAppendChild = vi.fn();
    const mockRemoveChild = vi.fn();

    // Mock document.createElement
    const mockAnchor = {
      click: mockClick,
      href: '',
      download: ''
    };
    global.document.createElement = vi.fn(() => mockAnchor as any);
    global.document.body.appendChild = mockAppendChild;
    global.document.body.removeChild = mockRemoveChild;

    render(
      <DownloadButton
        content="Test content"
        filename="test-file"
      />
    );

    fireEvent.click(screen.getByText('Download'));

    expect(mockClick).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(global.URL.createObjectURL).toHaveBeenCalled();
    expect(global.URL.revokeObjectURL).toHaveBeenCalled();
  });
});