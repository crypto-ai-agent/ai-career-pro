import React from 'react';
import { InterviewFormData } from './types';
import { FormField, Select, Input, TextArea } from '../../../components/ui/Form';
import { Button } from '../../../components/ui/Button';
import { EXPERIENCE_LEVELS, LANGUAGES } from '../../../lib/constants';

interface InterviewFormProps {
  formData: InterviewFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InterviewForm({
  formData,
  isLoading,
  onInputChange,
  onSubmit
}: InterviewFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Interview Type">
        <Select
          name="interviewType"
          value={formData.interviewType}
          onChange={onInputChange}
        >
          <option value="behavioral">Behavioral Interview</option>
          <option value="technical">Technical Interview</option>
          <option value="leadership">Leadership Interview</option>
          <option value="role-specific">Role-Specific Interview</option>
        </Select>
      </FormField>

      <FormField label="Target Role">
        <Input
          name="role"
          value={formData.role}
          onChange={onInputChange}
          placeholder="e.g., Senior Software Engineer"
          required
        />
      </FormField>

      <FormField label="Industry">
        <Input
          name="industry"
          value={formData.industry}
          onChange={onInputChange}
          placeholder="e.g., Technology, Healthcare"
          required
        />
      </FormField>

      <FormField label="Experience Level">
        <Select
          name="experienceLevel"
          value={formData.experienceLevel}
          onChange={onInputChange}
        >
          {EXPERIENCE_LEVELS.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Specific Focus (Optional)">
        <TextArea
          name="specificFocus"
          value={formData.specificFocus}
          onChange={onInputChange}
          rows={3}
          placeholder="Any specific areas or topics you'd like to focus on"
        />
      </FormField>

      <FormField label="Preferred Language">
        <Select
          name="preferredLanguage"
          value={formData.preferredLanguage}
          onChange={onInputChange}
        >
          {LANGUAGES.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </Select>
      </FormField>

      <Button type="submit" isLoading={isLoading}>
        Start Interview
      </Button>
    </form>
  );
}