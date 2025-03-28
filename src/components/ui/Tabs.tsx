import React from 'react';
import { cn } from '../../lib/utils';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
}

interface TabsListProps {
  children: React.ReactNode;
}

export function TabsList({ children }: TabsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-1 inline-flex mb-6">
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  onValueChange?: (value: string) => void;
}

export function TabsTrigger({ value, children, onValueChange }: TabsTriggerProps) {
  return (
    <button
      onClick={() => onValueChange?.(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded transition-colors',
        onValueChange ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:text-gray-900'
      )}
    >
      {children}
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  return (
    <div className="mt-4">
      {children}
    </div>
  );
}