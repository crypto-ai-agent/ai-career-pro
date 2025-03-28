import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { useToast } from './useToast';
import { apiClient } from '../services/api/client';

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  loadingMessage?: string;
}

export function useApi(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number>();
  const { handleError } = useErrorHandler();
  const { addToast } = useToast();

  const request = useCallback(async <T>(
    promise: Promise<T>,
    successMessage?: string
  ): Promise<T | undefined> => {
    setLoading(true);
    setProgress(undefined);
    try {
      const data = await promise;
      
      if (options.showSuccessToast && successMessage) {
        addToast('success', successMessage);
      }
      
      options.onSuccess?.(data);
      return data;
    } catch (error) {
      const { message } = handleError(error);
      
      if (options.showErrorToast) {
        addToast('error', message);
      }
      
      options.onError?.(error as Error);
      return undefined;
    } finally {
      setLoading(false);
      setProgress(undefined);
    }
  }, [handleError, addToast, options]);

  const uploadWithProgress = useCallback(async <T>(
    url: string,
    formData: FormData,
    config?: RequestInit
  ): Promise<T> => {
    setLoading(true);
    setProgress(0);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          setProgress(Math.round(percentComplete));
        }
      });

      const response = await new Promise<T>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error(xhr.statusText));
          }
        };
        xhr.onerror = () => reject(new Error('Network error'));
        
        xhr.open('POST', url);
        Object.entries(config?.headers || {}).forEach(([key, value]) => {
          xhr.setRequestHeader(key, value as string);
        });
        xhr.send(formData);
      });

      return response;
    } finally {
      setLoading(false);
      setProgress(undefined);
    }
  }, []);

  return { 
    loading, 
    progress,
    request,
    uploadWithProgress,
    loadingMessage: options.loadingMessage
  };
}