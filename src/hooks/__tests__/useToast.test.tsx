import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from '../useToast';

describe('useToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds toast correctly', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('success', 'Test message');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      type: 'success',
      message: 'Test message',
    });
  });

  it('removes toast after timeout', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('success', 'Test message');
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it('removes toast manually', () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.addToast('success', 'Test message');
    });

    const toastId = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(toastId);
    });

    expect(result.current.toasts).toHaveLength(0);
  });
});