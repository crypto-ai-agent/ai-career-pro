import React from 'react';
import { Upload } from 'lucide-react';
import { FILE_SIZE_LIMIT, SUPPORTED_FILE_TYPES } from '../../lib/constants';

interface FileUploadProps {
  id: string;
  name: string;
  accept: string;
  onChange: (file: File | null) => void;
  type: keyof typeof SUPPORTED_FILE_TYPES;
  error?: string;
  value?: File | null;
}
interface FileUploadProps {
  id: string;
  name: string;
  accept: string;
  onChange: (file: File | null) => void;
  type: keyof typeof SUPPORTED_FILE_TYPES;
  error?: string;
}

export function FileUpload({ id, name, accept, onChange, type, error, value }: FileUploadProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const validationError = validateFile(file, type);
      if (validationError) {
        alert(validationError);
        e.target.value = '';
        onChange(null);
        return;
      }
    }
    onChange(file);
  };

  const validateFile = (file: File, type: keyof typeof SUPPORTED_FILE_TYPES): string | null => {
    if (!file) {
      return 'Please select a file';
    }

    if (file.size > FILE_SIZE_LIMIT) {
      return 'File size must be less than 10MB';
    }

    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!SUPPORTED_FILE_TYPES[type].includes(fileExtension)) {
      return `File type not supported. Supported types: ${SUPPORTED_FILE_TYPES[type].join(', ')}`;
    }

    return null;
  };

  return (
    <div className="mt-1">
      <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
        <div className="space-y-1 text-center w-full">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          {value ? (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected file:</p>
              <p className="text-sm font-medium text-indigo-600">{value.name}</p>
            </div>
          ) : (
            <div className="flex text-sm text-gray-600 justify-center">
            <label
              htmlFor={id}
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id={id}
                name={name}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="sr-only"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          )}
          <p className="text-xs text-gray-500">
            {SUPPORTED_FILE_TYPES[type].join(', ')} up to 10MB
          </p>
        </div>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}