import React from 'react';
import { AlertCircle } from 'lucide-react';
import { getRecoveryMessage } from '../../services/monitoring';

interface ErrorAlertProps {
  title?: string;
  message: string;
  error?: Error;
}

export function ErrorAlert({ title = 'Error', message, error }: ErrorAlertProps) {
  const recoveryMessage = error ? getRecoveryMessage(error) : null;

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
          {recoveryMessage && (
            <div className="mt-2 text-sm text-red-600">
              <p>{recoveryMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}