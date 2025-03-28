import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  position?: 'left' | 'right';
}

export function MobileMenu({ 
  isOpen, 
  onClose, 
  children, 
  title,
  position = 'right'
}: MobileMenuProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-gray-800/50 backdrop-blur-sm z-50 transition-opacity duration-200',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
      />

      {/* Menu */}
      <div
        className={cn(
          'fixed inset-y-0 w-full max-w-xs bg-white shadow-xl transform transition-transform duration-200 z-50',
          position === 'left' ? 'left-0' : 'right-0',
          isOpen 
            ? 'translate-x-0' 
            : position === 'left' 
              ? '-translate-x-full' 
              : 'translate-x-full'
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {title && (
                <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              )}
              <Button variant="outline" onClick={onClose} className="p-2">
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}