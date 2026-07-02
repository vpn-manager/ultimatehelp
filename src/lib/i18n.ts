'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import ru from '@/locales/ru.json';
import fa from '@/locales/fa.json';
import { DEFAULT_LOCALE, LOCALES, RTL_LOCALES, type Locale } from './types';

export const STORAGE_KEY = 'ultimateguide.locale';

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}

/** Read the persisted locale (browser only); falls back to the default. */
export function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
  if (stored && LOCALES.includes(stored)) return stored;
  const browser = window.navigator.language.slice(0, 2) as Locale;
  return LOCALES.includes(browser) ? browser : DEFAULT_LOCALE;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      fa: { translation: fa },
    },
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    supportedLngs: LOCALES,
    interpolation: { escapeValue: false },
    returnNull: false,
  });
}

export default i18n;
