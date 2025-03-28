import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardLayout } from '../DashboardLayout';
import { useAuth } from '../../../contexts/AuthContext';

vi.mock('../../../contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('DashboardLayout', () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: { id: '1', email: 'test@example.com' },
      loading: false,
      signIn: vi.fn(),
      signUp: vi.fn(),
      signOut: mockSignOut
    });
  });

  it('renders navigation items', () => {
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('CV Optimizer')).toBeInTheDocument();
    expect(screen.getByText('Cover Letters')).toBeInTheDocument();
    expect(screen.getByText('Email Preparer')).toBeInTheDocument();
  });

  it('handles sign out', async () => {
    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    expect(mockSignOut).toHaveBeenCalled();
  });
});