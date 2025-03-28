import React from 'react';
import { cn } from '../../lib/utils';

interface TabPanelProps {
  id: string;
  isActive: boolean;
  children: React.ReactNode;
}

function TabPanel({ id, isActive, children }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      id={`${id}-panel`}
      aria-labelledby={`${id}-tab`}
      className={cn(
        'transition-opacity duration-200',
        isActive ? 'opacity-100' : 'opacity-0 hidden'
      )}
    >
      {children}
    </div>
  );
}

export { TabPanel }