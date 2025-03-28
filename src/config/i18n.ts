import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' }
] as const;

// Currently enabled languages
export const ENABLED_LANGUAGES = ['en', 'es'] as const;

export type LanguageCode = typeof SUPPORTED_LANGUAGES[number]['code'];

// Load all translation files
const resources = Object.fromEntries(
  Object.entries(import.meta.glob('./locales/*/translation.json', { eager: true }))
    .map(([key, value]) => [key.split('/')[2], { translation: value.default }])
);

export function isValidLanguageCode(code: string): code is LanguageCode {
  return SUPPORTED_LANGUAGES.some(lang => lang.code === code);
}

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ENABLED_LANGUAGES,
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['cookie', 'localStorage'],
      lookupQuerystring: 'lang',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
    }
  });

export default i18n;