import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export function LoadingSpinner({ size = 'md', className, message }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return message ? (
    <div className="flex flex-col items-center">
      <Loader2 className={cn(`animate-spin ${sizes[size]}`, className)} />
      <p className="mt-2 text-sm text-gray-600">{message}</p>
    </div>
  ) : (
    <Loader2 className={cn(`animate-spin ${sizes[size]}`, className)} />
  );
}