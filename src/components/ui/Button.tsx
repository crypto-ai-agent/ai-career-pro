import React from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

function Button({ 
  children, 
  className, 
  variant = 'primary', 
  size = 'md',
  isLoading, 
  disabled,
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors";
  
  const variants = {
    primary: "bg-primary hover:bg-secondary text-white focus:ring-primary/50",
    secondary: "bg-secondary hover:bg-primary text-white focus:ring-secondary/50",
    outline: "border border-white/20 hover:bg-white/10 text-white focus:ring-white/20"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <LoadingSpinner size="sm" className="mr-2" />
          <span>Processing...</span>
        </div>
      ) : children}
    </button>
  );
}

export default Button;

export { Button }