import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useToast } from './useToast';

interface ValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: z.ZodError) => void;
}

export function useFormValidation<T>({ schema, onSuccess, onError }: ValidationOptions<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { addToast } = useToast();

  const validate = useCallback(async (data: unknown) => {
    try {
      const validData = await schema.parseAsync(data);
      setErrors({});
      onSuccess?.(validData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join('.');
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
        onError?.(error);
        addToast('error', 'Please fix the form errors');
      }
      return false;
    }
  }, [schema, onSuccess, onError, addToast]);

  const getFieldError = useCallback((field: string) => errors[field], [errors]);

  const setFieldTouched = useCallback((field: string, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [field]: isTouched }));
  }, []);

  const isFieldTouched = useCallback((field: string) => touched[field], [touched]);

  const clearErrors = useCallback(() => {
    setErrors({});
    setTouched({});
  }, []);

  return {
    errors,
    touched,
    validate,
    getFieldError,
    setFieldTouched,
    isFieldTouched,
    clearErrors
  };
}