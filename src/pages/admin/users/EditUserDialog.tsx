import React from 'react';
import { User } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { FormField, Input, Select } from '../../../components/ui/Form';
import { EXPERIENCE_LEVELS } from '../../../lib/constants';
import { useForm } from '../../../hooks/useForm';
import { profileSchema } from '../../../lib/validation';

interface EditUserFormData {
  fullName: string;
  email: string;
  company: string;
  jobTitle: string;
  experienceLevel: string;
}

interface EditUserDialogProps {
  user: {
    id: string;
    email: string;
    full_name?: string;
    company?: string;
    job_title?: string;
    experience_level?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EditUserFormData) => Promise<void>;
}

export function EditUserDialog({ user, isOpen, onClose, onSave }: EditUserDialogProps) {
  const {
    formData,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm<EditUserFormData>({
    initialData: {
      fullName: user.full_name || '',
      email: user.email,
      company: user.company || '',
      jobTitle: user.job_title || '',
      experienceLevel: user.experience_level || 'mid-level'
    },
    schema: profileSchema,
    onSubmit: onSave
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        {/* Dialog panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Edit User
                </h3>

                {error && (
                  <div className="mt-2 bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  <FormField 
                    label="Full Name" 
                    error={getFieldError('fullName')}
                  >
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </FormField>

                  <FormField 
                    label="Email" 
                    error={getFieldError('email')}
                  >
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </FormField>

                  <FormField 
                    label="Company" 
                    error={getFieldError('company')}
                  >
                    <Input
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                    />
                  </FormField>

                  <FormField 
                    label="Job Title" 
                    error={getFieldError('jobTitle')}
                  >
                    <Input
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                    />
                  </FormField>

                  <FormField 
                    label="Experience Level" 
                    error={getFieldError('experienceLevel')}
                  >
                    <Select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                    >
                      {EXPERIENCE_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </Select>
                  </FormField>
                </form>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <Button
              type="submit"
              onClick={handleSubmit}
              isLoading={isSubmitting}
              className="w-full sm:ml-3 sm:w-auto"
            >
              Save Changes
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}