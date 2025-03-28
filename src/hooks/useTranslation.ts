import { useTranslation as useI18nTranslation } from 'react-i18next';
import { translateText } from '../services/translation';

export function useTranslation() {
  const { t, i18n, ...rest } = useI18nTranslation();

  const translateDynamic = async (text: string): Promise<string> => {
    if (i18n.language === 'en') return text;
    return translateText(text, i18n.language);
  };

  return {
    t,
    i18n,
    translateDynamic,
    ...rest
  };
}