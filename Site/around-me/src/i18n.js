import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationUk from './locales/uk/translation.json';
import translationEn from './locales/en/translation.json';

const resources = {
  uk: { translation: translationUk },
  en: { translation: translationEn }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uk',
    interpolation: { escapeValue: false }
  });

export default i18n; 