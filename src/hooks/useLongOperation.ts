import { useState, useCallback } from 'react';
import { useToast } from './useToast';

interface LongOperationOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useLongOperation(options: LongOperationOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>();
  const [currentStep, setCurrentStep] = useState(0);
  const { addToast } = useToast();

  const execute = useCallback(async <T>(
    operation: () => Promise<T>,
    steps?: Array<{
      id: string;
      label: string;
      description?: string;
    }>
  ): Promise<T | undefined> => {
    setLoading(true);
    setProgress(0);
    setCurrentStep(0);

    try {
      const result = await operation();
      
      if (options.successMessage) {
        addToast('success', options.successMessage);
      }
      
      options.onSuccess?.();
      return result;
    } catch (error) {
      const message = options.errorMessage || 
        (error instanceof Error ? error.message : 'Operation failed');
      
      addToast('error', message);
      options.onError?.(error as Error);
      return undefined;
    } finally {
      setLoading(false);
      setProgress(undefined);
      setCurrentStep(0);
    }
  }, [addToast, options]);

  const updateProgress = useCallback((value: number) => {
    setProgress(value);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => prev + 1);
  }, []);

  return {
    loading,
    progress,
    currentStep,
    execute,
    updateProgress,
    nextStep
  };
}