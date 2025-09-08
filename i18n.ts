import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files as standard ES modules for universal compatibility
import translationEN from './locales/en/translation';
import translationES from './locales/es/translation';
import translationPT from './locales/pt/translation';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['pt', 'en', 'es'],
    fallbackLng: 'pt',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupQuerystring: 'lang',
    },
    resources: {
      en: {
        translation: translationEN,
      },
      es: {
        translation: translationES,
      },
      pt: {
        translation: translationPT,
      },
    },
    react: {
      // Suspense is no longer needed as translations are bundled.
      useSuspense: false,
    },
  });

export default i18next;
