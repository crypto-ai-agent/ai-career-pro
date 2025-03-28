import React from 'react';
import { cn } from '../../lib/utils';
import { FormValidationError } from './FormValidationError';
import { HelpCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
  description?: string;
  tooltip?: string;
  touched?: boolean;
}

export function FormField({
  label,
  error,
  required,
  className,
  children,
  description,
  tooltip,
  touched
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="flex text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && (
          <span className="ml-1 group relative inline-block">
            <HelpCircle className="h-4 w-4 text-gray-400" />
            <span className="invisible group-hover:visible absolute left-full ml-2 w-48 p-2 bg-gray-900 text-white text-xs rounded">
              {tooltip}
            </span>
          </span>
        )}
      </label>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
      {children}
      {error && touched && (
        <FormValidationError message={error} />
      )}
    </div>
  );
}