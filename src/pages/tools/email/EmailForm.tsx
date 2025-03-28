import React from 'react';
import { EmailFormData } from './types';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { Button } from '../../../components/ui/Button';
import { EMAIL_TYPES, EMAIL_TONES } from '../../../lib/constants';

interface EmailFormProps {
  formData: EmailFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function EmailForm({
  formData,
  isLoading,
  onInputChange,
  onSubmit
}: EmailFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Email Type">
        <Select
          name="emailType"
          value={formData.emailType}
          onChange={onInputChange}
        >
          {EMAIL_TYPES.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Recipient">
        <Input
          name="recipient"
          value={formData.recipient}
          onChange={onInputChange}
          placeholder="e.g., Hiring Manager, John Smith"
          required
        />
      </FormField>

      <FormField label="Company">
        <Input
          name="company"
          value={formData.company}
          onChange={onInputChange}
          required
        />
      </FormField>

      <FormField label="Role">
        <Input
          name="role"
          value={formData.role}
          onChange={onInputChange}
          required
        />
      </FormField>

      <FormField label="Context">
        <TextArea
          name="context"
          value={formData.context}
          onChange={onInputChange}
          rows={3}
          placeholder="Add any relevant context or specific points you'd like to mention"
          required
        />
      </FormField>

      <FormField label="Tone">
        <Select
          name="tone"
          value={formData.tone}
          onChange={onInputChange}
        >
          {EMAIL_TONES.map(tone => (
            <option key={tone.value} value={tone.value}>
              {tone.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Additional Notes (Optional)">
        <TextArea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={onInputChange}
          rows={2}
          placeholder="Any additional information you'd like to include"
        />
      </FormField>

      <Button type="submit" isLoading={isLoading}>
        Generate Email
      </Button>
    </form>
  );
}