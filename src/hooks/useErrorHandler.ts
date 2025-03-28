import { useState, useCallback } from 'react';
import { useToast } from './useToast';
import { trackError } from '../services/monitoring';

interface ErrorDetails {
  code?: string;
  status?: number;
  context?: Record<string, any>;
}

interface ErrorState {
  message: string | null;
  details?: ErrorDetails;
}

export function useErrorHandler() {
  const [error, setError] = useState<ErrorState>({ message: null });
  const { addToast } = useToast();

  const handleError = useCallback((err: unknown) => {
    console.error('Error:', err);
    
    // Track error
    if (err instanceof Error) {
      trackError(err);
    }

    let message = 'An unexpected error occurred';
    let code = 'UNKNOWN_ERROR';
    let status = 500;

    if (err instanceof Error) {
      message = err.message;
      if ('code' in err) {
        code = (err as any).code;
      }
      if ('status' in err) {
        status = (err as any).status;
      }
    }

    // Handle specific error types
    if (code === 'PGRST301' || status === 401) {
      message = 'Your session has expired. Please sign in again.';
      // Redirect to login
      window.location.href = '/login';
    } else if (code === 'RATE_LIMIT_EXCEEDED' || status === 429) {
      message = 'Too many requests. Please try again later.';
    } else if (status === 403) {
      message = 'You do not have permission to perform this action.';
    }

    setError({ message, details: { code, status } });
    addToast('error', message);

    return { message, code, status };
  }, [addToast]);

  const clearError = useCallback(() => {
    setError({ message: null });
  }, []);

  return {
    error,
    handleError,
    clearError
  };
}