import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useForm } from '../useForm';

describe('useForm', () => {
  const initialData = {
    name: '',
    email: ''
  };

  it('initializes with provided data', () => {
    const { result } = renderHook(() => useForm(initialData));
    expect(result.current.formData).toEqual(initialData);
  });

  it('updates form data on input change', () => {
    const { result } = renderHook(() => useForm(initialData));

    act(() => {
      result.current.handleInputChange({
        target: { name: 'name', value: 'John' }
      } as any);
    });

    expect(result.current.formData.name).toBe('John');
  });

  it('handles form submission', async () => {
    const mockSubmit = vi.fn();
    const { result } = renderHook(() => useForm(initialData));

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as any,
        mockSubmit
      );
    });

    expect(mockSubmit).toHaveBeenCalledWith(initialData);
  });

  it('handles submission errors', async () => {
    const error = new Error('Submit error');
    const mockSubmit = vi.fn().mockRejectedValue(error);
    const { result } = renderHook(() => useForm(initialData));

    await act(async () => {
      await result.current.handleSubmit(
        { preventDefault: vi.fn() } as any,
        mockSubmit
      );
    });

    expect(result.current.error).toBe(error.message);
  });
});