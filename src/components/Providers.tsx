'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nextProvider } from 'react-i18next';

import i18n, { getInitialLocale, isRtl, STORAGE_KEY } from '@/lib/i18n';
import { getLocaleFromPathname, stripBasePath } from '@/lib/locale-paths';
import { DEFAULT_LOCALE, type Locale } from '@/lib/types';

type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'ultimateguide:theme';

interface LocaleContextValue {
  locale: Locale;
  dir: 'ltr' | 'rtl';
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  dir: 'ltr',
  setLocale: () => {},
});

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

function getInitialTheme(): Theme {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    /* storage may be unavailable; ignore */
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [theme, setThemeState] = useState<Theme>('light');

  // Hydrate from storage / browser once mounted (avoids SSR mismatch).
  useEffect(() => {
    const pathLocale = getLocaleFromPathname(stripBasePath(window.location.pathname));
    const initial = pathLocale ?? getInitialLocale();
    setLocaleState(initial);
    void i18n.changeLanguage(initial);

    setThemeState(getInitialTheme());
  }, []);

  // Keep <html lang> and <html dir> in sync so RTL mirrors the whole layout.
  useEffect(() => {
    const dir = isRtl(locale) ? 'rtl' : 'ltr';
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
  }, [locale]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    void i18n.changeLanguage(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable; ignore */
    }
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir: isRtl(locale) ? 'rtl' : 'ltr', setLocale }),
    [locale, setLocale],
  );

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable; ignore */
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, next);
      } catch {
        /* storage may be unavailable; ignore */
      }
      return next;
    });
  }, []);

  const themeValue = useMemo<ThemeContextValue>(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return (
    <I18nextProvider i18n={i18n}>
      <LocaleContext.Provider value={value}>
        <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
      </LocaleContext.Provider>
    </I18nextProvider>
  );
}
