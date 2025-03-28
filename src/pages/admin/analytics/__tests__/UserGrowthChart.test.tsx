import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { UserGrowthChart } from '../UserGrowthChart';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        gte: vi.fn(() => ({
          lte: vi.fn(() => Promise.resolve({
            data: [
              { created_at: '2024-01-01T00:00:00Z' },
              { created_at: '2024-02-01T00:00:00Z' }
            ],
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('UserGrowthChart', () => {
  it('renders loading state initially', () => {
    render(<UserGrowthChart />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders chart when data is loaded', async () => {
    render(<UserGrowthChart />);
    expect(await screen.findByText('Total Users')).toBeInTheDocument();
    expect(await screen.findByText('New Users')).toBeInTheDocument();
  });

  it('handles errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        gte: vi.fn(() => ({
          lte: vi.fn(() => Promise.reject(new Error('Failed to load data')))
        }))
      }))
    }));

    render(<UserGrowthChart />);
    expect(await screen.findByText('No user growth data available')).toBeInTheDocument();
  });
});