import React from 'react';
import { cn } from '../../lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export function Table({ className, ...props }: TableProps) {
  return (
    <table
      className={cn(
        'w-full text-sm text-left text-gray-500 dark:text-gray-400',
        className
      )}
      {...props}
    >
      {props.children}
    </table>
  );
}