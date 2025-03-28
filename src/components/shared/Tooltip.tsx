import React from 'react';
import { cn } from '../../lib/utils';

interface TooltipProps {
  children: React.ReactNode;
  content?: string;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
  delay?: number;
}

export function Tooltip({ children, content, side = 'top', className, delay = 200 }: TooltipProps) {
  if (!content) return <>{children}</>;

  const sideClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };

  const arrowClasses = {
    top: 'bottom-[-6px] left-1/2 -translate-x-1/2 border-t-gray-700 border-l-transparent border-r-transparent border-b-transparent',
    right: 'left-[-6px] top-1/2 -translate-y-1/2 border-r-gray-700 border-t-transparent border-b-transparent border-l-transparent',
    bottom: 'top-[-6px] left-1/2 -translate-x-1/2 border-b-gray-700 border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -translate-y-1/2 border-l-gray-700 border-t-transparent border-b-transparent border-r-transparent'
  };

  return (
    <div className="group relative inline-block">
      {children}
      <div 
        className={cn(
          'absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200',
          'z-50 px-2 py-1 text-xs font-medium text-white bg-gray-700 rounded pointer-events-none whitespace-nowrap',
          sideClasses[side],
          className
        )}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {content}
        <div className={cn(
          'absolute w-0 h-0 border-4',
          arrowClasses[side]
        )} />
      </div>
    </div>
  );
}