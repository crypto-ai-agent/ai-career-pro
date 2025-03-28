import React from 'react';
import { AlertCircle } from 'lucide-react';

interface FormValidationErrorProps {
  message: string;
}

export function FormValidationError({ message }: FormValidationErrorProps) {
  return (
    <div className="flex items-center text-sm text-red-600 mt-1 animate-shake">
      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}