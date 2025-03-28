import { useState, useCallback } from 'react';
import { useToast } from './useToast';

interface UseLoadingStateOptions {
  onError?: (error: Error) => void;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const { addToast } = useToast();

  const startLoading = useCallback((message: string = '') => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage(message);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingMessage('');
  }, []);

  const handleError = useCallback((err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : 'An error occurred';
    setError(errorMessage);
    addToast('error', errorMessage);
    options.onError?.(err instanceof Error ? err : new Error(errorMessage));
  }, [addToast, options]);

  const withLoading = useCallback(async <T>(
    fn: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T | undefined> => {
    try {
      startLoading(loadingMessage);
      const result = await fn();
      return result;
    } catch (err) {
      handleError(err);
      return undefined;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading, handleError]);

  return {
    isLoading,
    error,
    loadingMessage,
    startLoading,
    stopLoading,
    handleError,
    withLoading
  };
}