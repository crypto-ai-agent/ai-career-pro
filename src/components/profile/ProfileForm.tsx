import React from 'react';
import { Card } from '../ui/Card';
import { FormField, Input, Select } from '../ui/Form';
import { Button } from '../ui/Button';
import { EXPERIENCE_LEVELS } from '../../lib/constants';
import { useForm } from '../../hooks/useForm';
import { profileSchema } from '../../lib/validation';
import type { Profile } from '../../types/database';

interface ProfileFormData {
  fullName: string;
  company: string;
  jobTitle: string;
  experienceLevel: string;
  email: string;
}

interface ProfileFormProps {
  profile: Profile;
  onSave: (data: ProfileFormData) => Promise<void>;
}

export function ProfileForm({ profile, onSave }: ProfileFormProps) {
  const {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit,
    getFieldError
  } = useForm({
    initialData: {
      fullName: profile.full_name || '',
      company: profile.company || '',
      jobTitle: profile.job_title || '',
      experienceLevel: profile.experience_level || 'mid-level',
      email: profile.email || ''
    },
    schema: profileSchema,
    onSubmit: onSave
  });

  return (
    <Card>
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}