import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RecentItems } from '../RecentItems';

describe('RecentItems', () => {
  const mockItems = [
    { id: 1, title: 'Item 1', date: '2024-03-15', content: 'Content 1' },
    { id: 2, title: 'Item 2', date: '2024-03-14', content: 'Content 2' }
  ];

  it('renders items correctly', () => {
    render(
      <MemoryRouter>
        <RecentItems
          title="Recent Items"
          items={mockItems}
          renderItem={(item) => (
            <div key={item.id}>{item.title}</div>
          )}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('Recent Items')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(
      <MemoryRouter>
        <RecentItems
          title="Recent Items"
          items={[]}
          renderItem={() => null}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('No recent items')).toBeInTheDocument();
  });

  it('renders view all history link', () => {
    render(
      <MemoryRouter>
        <RecentItems
          title="Recent Items"
          items={mockItems}
          renderItem={(item) => (
            <div key={item.id}>{item.title}</div>
          )}
        />
      </MemoryRouter>
    );

    expect(screen.getByText('View All History')).toBeInTheDocument();
  });
});