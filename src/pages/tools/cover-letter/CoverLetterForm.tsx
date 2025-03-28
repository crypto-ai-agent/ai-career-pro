import React from 'react';
import { CoverLetterFormData } from './types';
import { FormField, Input, TextArea, Select } from '../../../components/ui/Form';
import { Button } from '../../../components/ui/Button';
import { COVER_LETTER_TONES, LANGUAGES } from '../../../lib/constants';

interface CoverLetterFormProps {
  formData: CoverLetterFormData;
  showAdvanced: boolean;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onToggleAdvanced: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CoverLetterForm({
  formData,
  showAdvanced,
  isLoading,
  onInputChange,
  onToggleAdvanced,
  onSubmit
}: CoverLetterFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <FormField label="Job Title">
        <Input
          name="jobTitle"
          value={formData.jobTitle}
          onChange={onInputChange}
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

      <FormField label="Key Skills">
        <TextArea
          name="keySkills"
          value={formData.keySkills}
          onChange={onInputChange}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Relevant Experience">
        <TextArea
          name="experience"
          value={formData.experience}
          onChange={onInputChange}
          rows={3}
          required
        />
      </FormField>

      <FormField label="Tone">
        <Select
          name="tone"
          value={formData.tone}
          onChange={onInputChange}
        >
          {COVER_LETTER_TONES.map(tone => (
            <option key={tone.value} value={tone.value}>
              {tone.label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Length">
        <Select
          name="length"
          value={formData.length}
          onChange={onInputChange}
        >
          <option value="short">Short (~250 words, ½ page)</option>
          <option value="medium">Medium (~400 words, ¾ page)</option>
          <option value="long">Long (~600 words, 1 page)</option>
        </Select>
      </FormField>

      <div className="pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onToggleAdvanced}
        >
          {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </Button>
      </div>

      {showAdvanced && (
        <div className="space-y-6 pt-4">
          <FormField label="Recipient Description (Optional)">
            <TextArea
              name="recipientDescription"
              value={formData.recipientDescription}
              onChange={onInputChange}
              rows={2}
              placeholder="e.g., Hiring Manager, Department Head, etc."
            />
          </FormField>

          <FormField label="Language">
            <Select
              name="language"
              value={formData.language}
              onChange={onInputChange}
            >
              {LANGUAGES.map(lang => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      )}

      <Button type="submit" isLoading={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Cover Letter'}
      </Button>
    </form>
  );
}