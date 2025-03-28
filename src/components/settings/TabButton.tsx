import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TabButtonProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function TabButton({ icon: Icon, label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon className={cn(
        'mr-3 h-5 w-5',
        isActive ? 'text-indigo-600' : 'text-gray-400'
      )} />
      {label}
    </button>
  );
}