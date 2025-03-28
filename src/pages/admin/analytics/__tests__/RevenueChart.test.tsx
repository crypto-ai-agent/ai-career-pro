import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RevenueChart } from '../RevenueChart';
import { supabase } from '../../../../lib/supabase';

vi.mock('../../../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({
            data: [
              { date: '2024-01-01', mrr: 5000 },
              { date: '2024-02-01', mrr: 5500 }
            ],
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('RevenueChart', () => {
  it('renders loading state initially', () => {
    render(<RevenueChart />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders chart when data is loaded', async () => {
    render(<RevenueChart />);
    expect(await screen.findByText('$5,000')).toBeInTheDocument();
  });

  it('shows empty state when no data', async () => {
    vi.mocked(supabase.from).mockImplementationOnce(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }));

    render(<RevenueChart />);
    expect(await screen.findByText('No revenue data available')).toBeInTheDocument();
  });
});