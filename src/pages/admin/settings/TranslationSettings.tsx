import React from 'react';
import { Languages } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { FormField, Select } from '../../../components/ui/Form';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, ENABLED_LANGUAGES } from '../../../config/i18n';

export function TranslationSettings() {
  const { i18n } = useTranslation();

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Languages className="h-5 w-5 text-gray-400 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">
            Language Settings
          </h3>
        </div>

        <div className="space-y-6">
          <FormField label="Default Language">
            <Select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map(lang => (
                <option 
                  key={lang.code} 
                  value={lang.code}
                  disabled={!ENABLED_LANGUAGES.includes(lang.code)}
                >
                  {lang.flag} {lang.name}
                  {!ENABLED_LANGUAGES.includes(lang.code) && ' (Coming Soon)'}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="mt-4 bg-gray-50 rounded-md p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Language Support Information:
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Currently supporting {ENABLED_LANGUAGES.length} languages</li>
              <li>• Static content is pre-translated</li>
              <li>• Translations are managed through i18next</li>
              <li>• More languages will be added based on user demand</li>
              <li>• All translations are professionally curated</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}