import React from 'react';
import { CVFormData } from './types';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { Button } from '../../../components/ui/Button';
import { FileUpload } from '../../../components/shared/FileUpload';
import { EXPERIENCE_LEVELS } from '../../../lib/constants';

interface CVFormProps {
  formData: CVFormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CVForm({
  formData,
  isLoading,
  onInputChange,
  onFileChange,
  onSubmit
}: CVFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Upload Your CV">
        <FileUpload
          id="currentCV"
          name="currentCV"
          accept=".pdf,.doc,.docx"
          value={formData.currentCV}
          onChange={onFileChange}
          type="CV"
        />
      </FormField>

      <FormField label="Target Role">
        <Input
          name="targetRole"
          value={formData.targetRole}
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

      <FormField label="Key Skills">
        <TextArea
          name="keySkills"
          value={formData.keySkills}
          onChange={onInputChange}
          rows={3}
          placeholder="List your key skills, separated by commas"
          required
        />
      </FormField>

      <Button type="submit" isLoading={isLoading}>
        Optimize CV
      </Button>
    </form>
  );
}