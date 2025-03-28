import React from 'react';
import { FormData } from '../../types/coverLetter';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  formData: FormData;
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
}: Props) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
            Job Title
          </label>
          <input
            type="text"
            id="jobTitle"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="keySkills" className="block text-sm font-medium text-gray-700">
            Key Skills
          </label>
          <textarea
            id="keySkills"
            name="keySkills"
            value={formData.keySkills}
            onChange={onInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
            Relevant Experience
          </label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={onInputChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label htmlFor="tone" className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <select
            id="tone"
            name="tone"
            value={formData.tone}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="professional">Professional</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="confident">Confident</option>
          </select>
        </div>

        <div>
          <label htmlFor="length" className="block text-sm font-medium text-gray-700">
            Length
          </label>
          <select
            id="length"
            name="length"
            value={formData.length}
            onChange={onInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="short">Short (~250 words, ½ page)</option>
            <option value="medium">Medium (~400 words, ¾ page)</option>
            <option value="long">Long (~600 words, 1 page)</option>
          </select>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onToggleAdvanced}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
          Advanced Settings
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-6 pt-4">
          <div>
            <label htmlFor="recipientDescription" className="block text-sm font-medium text-gray-700">
              Recipient Description (Optional)
            </label>
            <textarea
              id="recipientDescription"
              name="recipientDescription"
              value={formData.recipientDescription}
              onChange={onInputChange}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Hiring Manager, Department Head, etc."
            />
          </div>

          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">
              Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={onInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="English">English</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Cover Letter"}
        </button>
      </div>
    </form>
  );
}