import { useState, useCallback } from 'react';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';
import { z } from 'zod';
import { useFormValidation } from './useFormValidation';
import { useToast } from './useToast';

interface UseFormOptions<T extends Record<string, any>> {
  initialData: T;
  schema?: z.ZodSchema<T>;
  onSubmit?: (data: T) => void | Promise<void>;
}

export function useForm<T extends Record<string, any>>({
  initialData,
  schema,
  onSubmit
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
 
  const { validate, getFieldError, clearErrors } = useFormValidation({
    schema: schema || z.object({}),
    onSuccess: async (data) => {
      try {
        setIsSubmitting(true);
        await onSubmit?.(data as T);
      } catch (error) {
        console.error('Form submission error:', error);
        addToast('error', error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    }
  });

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    if (schema) {
      const isValid = await validate(formData);
      if (!isValid) return;
    }
    if (schema) {
      const isValid = await validate(formData);
      if (!isValid) return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit?.(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      const message = error instanceof Error ? error.message : 'An error occurred';
      setError(message);
      addToast('error', message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, schema, validate, onSubmit, addToast]);

  const reset = useCallback(() => {
    setFormData(initialData);
    clearErrors();
  }, [initialData, clearErrors]);

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    getFieldError,
    reset
  };
}
