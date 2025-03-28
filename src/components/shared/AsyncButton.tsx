import React from 'react';
import { Button } from '../ui/Button';
import { LoadingSpinner } from './LoadingSpinner';
import { cn } from '../../lib/utils';

interface AsyncButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function AsyncButton({
  children,
  loading,
  loadingText = 'Loading...',
  disabled,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: AsyncButtonProps) {
  return (
    <Button
      disabled={loading || disabled}
      className={cn(
        'relative',
        loading && 'text-transparent',
        className
      )}
      variant={variant}
      size={size}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-current" />
          <span className="ml-2 text-current">{loadingText}</span>
        </div>
      )}
      {children}
    </Button>
  );
}