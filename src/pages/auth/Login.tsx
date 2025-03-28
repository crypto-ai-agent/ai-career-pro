import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { loginSchema } from '../../lib/validation';
import { Button } from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/Form';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';

interface LoginFormData {
  email: string;
  password: string;
}

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm<LoginFormData>({
    initialData: { email: '', password: '' },
    schema: loginSchema,
    onSubmit: async (data) => {
      await signIn(data.email, data.password);
      navigate(from, { replace: true });
    }
  });

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay message="Signing in..." />}

      <div className="absolute top-0 right-0 mt-4 mr-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="rounded-full p-2"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
          <LogIn className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField 
              label="Password" 
              error={getFieldError('password')}
            >
              <Input
                name="password"
                type="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormField>

            <div className="text-sm">
              <Link
                to="/reset-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}