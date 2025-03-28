import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function ServerError() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-16 w-16 text-red-600" />
        <h1 className="mt-4 text-3xl font-bold text-gray-900">Server Error</h1>
        <p className="mt-2 text-lg text-gray-600">
          Sorry, something went wrong on our end. Please try again later.
        </p>
        <div className="mt-8">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}