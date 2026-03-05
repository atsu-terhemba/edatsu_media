import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import enGb from './locales/en-gb.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import de from './locales/de.json';
import pt from './locales/pt.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            'en-gb': { translation: enGb },
            fr: { translation: fr },
            es: { translation: es },
            de: { translation: de },
            pt: { translation: pt },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'edatsu_lang',
            caches: ['localStorage'],
        },
    });

export default i18n;
