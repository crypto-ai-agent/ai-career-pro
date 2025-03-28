import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { SUPPORTED_LANGUAGES } from './languages';

// Load all translation files
const resources = Object.fromEntries(
  Object.entries(import.meta.glob('./locales/*/translation.json', { eager: true }))
    .map(([key, value]) => [key.split('/')[2], { translation: value.default }])
);

i18n
  .use(resourcesToBackend(resources))
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES.map(lang => lang.code),
    debug: process.env.NODE_ENV === 'development',
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
