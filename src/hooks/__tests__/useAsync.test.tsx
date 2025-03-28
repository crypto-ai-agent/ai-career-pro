import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAsync } from '../useAsync';

describe('useAsync', () => {
  it('handles successful async operation', async () => {
    const { result } = renderHook(() => useAsync());
    const mockData = { id: 1, name: 'Test' };
    const promise = Promise.resolve(mockData);

    await act(async () => {
      await result.current.run(promise);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('handles async operation failure', async () => {
    const { result } = renderHook(() => useAsync());
    const error = new Error('Test error');
    const promise = Promise.reject(error);

    await act(async () => {
      try {
        await result.current.run(promise);
      } catch (e) {
        // Expected error
      }
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toEqual(error);
  });

  it('resets state correctly', async () => {
    const { result } = renderHook(() => useAsync());
    const mockData = { id: 1, name: 'Test' };
    const promise = Promise.resolve(mockData);

    await act(async () => {
      await result.current.run(promise);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});