import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { resetPasswordSchema } from '../../lib/validation';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/Form';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';

interface ResetPasswordFormData {
  email: string;
}

export function ResetPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm<ResetPasswordFormData>({
    initialData: { email: '' },
    schema: resetPasswordSchema,
    onSubmit: async (data) => {
      await resetPassword(data.email);
      setIsSubmitted(true);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay message="Sending reset instructions..." />}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <KeyRound className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {isSubmitted ? (
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
              <p className="mt-2 text-sm text-gray-600">
                We've sent you a link to reset your password. The link will expire in 24 hours.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="mt-6 w-full"
              >
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
                  {error}
                </div>
              )}

              <FormField 
                label="Email address"
                error={getFieldError('email')}
              >
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </FormField>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/login')}
                >
                  Back to Login
                </Button>
                <Button
                  type="submit"
                  isLoading={isLoading}
                >
                  Reset Password
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}