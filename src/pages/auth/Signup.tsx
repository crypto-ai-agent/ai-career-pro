import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { signupSchema } from '../../lib/validation';
import { Button } from '../../components/ui/Button';
import { FormField, Input } from '../../components/ui/Form';
import { LoadingOverlay } from '../../components/shared/LoadingOverlay';

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export function Signup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const {
    formData,
    isLoading,
    error,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm<SignupFormData>({
    initialData: { email: '', password: '', confirmPassword: '' },
    schema: signupSchema,
    onSubmit: async (data) => {
      await signUp(data.email, data.password);
      navigate('/dashboard');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {isLoading && <LoadingOverlay message="Creating your account..." />}

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
          <UserPlus className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your account
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
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </FormField>

            <FormField 
              label="Confirm Password" 
              error={getFieldError('confirmPassword')}
            >
              <Input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </FormField>

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
                Create account
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}