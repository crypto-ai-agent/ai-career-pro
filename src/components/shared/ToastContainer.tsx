import React from 'react';
import { Toast } from './Toast';

interface ToastContainerProps {
  toasts: Array<{
    id: number;
    type: 'success' | 'error' | 'info';
    message: string;
  }>;
  onClose: (id: number) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4 max-w-sm w-full">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          id={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={onClose}
        />
      ))}
    </div>
  );
}