import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

function Card({ children, className, gradient }: CardProps) {
  return (
    <div className={cn(
      'glass p-6',
      gradient && 'card-gradient',
      className
    )}>
      {children}
    </div>
  );
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)}>
      {children}
    </div>
  );
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-lg font-semibold", className)}>
      {children}
    </h2>
  );
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardContent };