import React from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ToastProps {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  onClose: (id: number) => void;
}

export function Toast({ id, type, message, onClose }: ToastProps) {
  const Icon = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }[type];

  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }[type];

  return (
    <div
      className={cn(
        'flex items-center p-4 rounded-lg border shadow-sm',
        styles
      )}
      role="alert"
    >
      <Icon className="h-5 w-5 mr-3" />
      <div className="flex-1">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-3 inline-flex h-5 w-5 items-center justify-center hover:opacity-70"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}