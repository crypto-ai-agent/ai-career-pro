import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import { cn } from '../../lib/utils';

interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  children: React.ReactNode;
  loadingMessage?: string;
  progress?: number;
  className?: string;
  overlay?: boolean;
}

export function LoadingState({
  loading,
  error,
  children,
  loadingMessage = 'Loading...',
  progress,
  className,
  overlay = false
}: LoadingStateProps) {
  const loadingContent = (
    <div className="flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" className="mb-4" />
      <p className="text-gray-600">{loadingMessage}</p>
      {progress !== undefined && (
        <div className="w-48 mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500 text-center">{progress}%</p>
        </div>
      )}
    </div>
  );

  if (overlay && loading) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
          {loadingContent}
        </div>
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn("min-h-[200px] flex items-center justify-center", className)}>
        {loadingContent}
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return <>{children}</>;
}