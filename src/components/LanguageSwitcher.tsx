'use client';

import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';

import { useLocale } from './Providers';
import { localizePath, stripBasePath, withBasePath } from '@/lib/locale-paths';
import { LOCALES, type Locale } from '@/lib/types';

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  fa: 'فارسی',
};

/** Native selector keeps language switching familiar and compact on mobile. */
export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  const handleChange = (next: Locale) => {
    setLocale(next);
    const currentPath = stripBasePath(window.location.pathname);
    window.location.assign(withBasePath(localizePath(currentPath, next)));
  };

  return (
    <label className="relative flex min-h-touch items-center rounded bg-surface-low text-primary ring-1 ring-surface-dim/60 transition-colors focus-within:ring-2 focus-within:ring-primary/40">
      <span className="pointer-events-none absolute start-3 flex items-center text-sm" aria-hidden="true">
        <FontAwesomeIcon icon={faLanguage} className="h-4 w-4" />
      </span>
      <span className="sr-only">{t('language.label')}</span>
      <select
        value={locale}
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        onChange={(event) => handleChange(event.target.value as Locale)}
        className="min-h-touch w-[7.75rem] appearance-none rounded bg-transparent py-2 pe-7 ps-9 text-sm font-semibold outline-none sm:w-36"
      >
        {LOCALES.map((code: Locale) => (
          <option key={code} value={code} dir={code === 'fa' ? 'rtl' : 'ltr'}>
            {LANGUAGE_LABELS[code]}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute end-3 text-[0.65rem] text-primary/70" aria-hidden="true">
        ▼
      </span>
    </label>
  );
}
