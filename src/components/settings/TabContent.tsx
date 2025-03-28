import React from 'react';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { ErrorAlert } from '../shared/ErrorAlert';

interface TabContentProps {
  isLoading: boolean;
  error: string | null;
  children: React.ReactNode;
}

export function TabContent({ isLoading, error, children }: TabContentProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" className="text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} />;
  }

  return <>{children}</>;
}