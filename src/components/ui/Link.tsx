import React from 'react';
import { Link as RouterLink, type LinkProps as RouterLinkProps } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface LinkProps extends RouterLinkProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

function Link({ 
  children, 
  className, 
  variant = 'primary',
  size = 'md',
  ...props 
}: LinkProps) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors";
  
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
    <RouterLink
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </RouterLink>
  );
}

export default Link;