import React from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  message: string;
}

export function ErrorMessage({ message }: Props) {
  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Error</h3>
          <div className="mt-2 text-sm text-red-700">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
}