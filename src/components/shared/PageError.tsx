import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface PageErrorProps {
  title?: string;
  message: string;
  retry?: () => void;
}

export function PageError({ 
  title = 'Error', 
  message, 
  retry 
}: PageErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {message}
        </p>
        {retry && (
          <div className="mt-6">
            <Button onClick={retry} variant="outline">
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}