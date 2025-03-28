import { useState, useCallback } from 'react';

interface UseConfirmationOptions {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export function useConfirmation(options: UseConfirmationOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [callback, setCallback] = useState<(() => Promise<void>) | null>(null);

  const confirm = useCallback(async (action: () => Promise<void>) => {
    setCallback(() => action);
    setIsOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!callback) return;
    
    setIsLoading(true);
    try {
      await callback();
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setCallback(null);
    }
  }, [callback]);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    setCallback(null);
  }, []);

  return {
    isOpen,
    isLoading,
    confirm,
    handleConfirm,
    handleCancel,
    dialogProps: {
      isOpen,
      title: options.title || 'Confirm Action',
      message: options.message || 'Are you sure you want to perform this action?',
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: options.cancelLabel || 'Cancel',
      isDestructive: options.isDestructive || false,
      isLoading,
      onConfirm: handleConfirm,
      onCancel: handleCancel
    }
  };
}