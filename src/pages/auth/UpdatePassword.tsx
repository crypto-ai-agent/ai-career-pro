import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { updatePasswordSchema } from '../../lib/validation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/Form';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';
import { useErrorHandler } from '../../hooks/useErrorHandler';

interface UpdatePasswordFormData {
  password: string;
  confirmPassword: string;
}

export function UpdatePassword() {
  const navigate = useNavigate();
  const { updatePassword } = useAuth();
  const { handleError } = useErrorHandler();

  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm<UpdatePasswordFormData>({
    initialData: { password: '', confirmPassword: '' },
    schema: updatePasswordSchema,
    onSubmit: async (data) => {
      await updatePassword(data.password);
      navigate('/dashboard');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay message="Updating your password..." />}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
                {error}
              </div>
            )}

            <FormField 
              label="New Password"
              error={getFieldError('password')}
            >
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </FormField>

            <FormField 
              label="Confirm New Password"
              error={getFieldError('confirmPassword')}
            >
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
            </FormField>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
            >
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}