import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';
import { getRecoveryMessage } from '../../services/monitoring';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  message?: string;
}

export function ErrorFallback({ error, resetErrorBoundary, message }: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-gray-900">
          {message || 'Something went wrong'}
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          {getRecoveryMessage(error)}
        </p>
        <div className="mt-6">
          <Button onClick={resetErrorBoundary}>
            Try again
          </Button>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Error ID: {Date.now().toString(36)}
        </p>
      </div>
    </div>
  );
}