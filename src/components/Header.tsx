'use client';

import { faBars, faMoon, faShieldHalved, faSun } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useLocale, useTheme } from './Providers';
import LanguageSwitcher from './LanguageSwitcher';
import { localizePath, stripBasePath, stripLocaleFromPathname } from '@/lib/locale-paths';

const NAV = [
  { href: '/guides', key: 'nav.guides' },
  { href: '/faq', key: 'nav.faq' },
  { href: '/about', key: 'nav.about' },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const updatePath = () => setCurrentPath(stripLocaleFromPathname(stripBasePath(window.location.pathname)));
    updatePath();
    window.addEventListener('popstate', updatePath);
    return () => window.removeEventListener('popstate', updatePath);
  }, []);

  const isActive = (href: string) => currentPath === href || currentPath.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-surface-dim/60 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4">
        <Link href={localizePath('/', locale)} className="flex min-w-0 items-center gap-2 font-bold text-primary">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-surface-low ring-1 ring-surface-dim/70">
            <FontAwesomeIcon icon={faShieldHalved} className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="hidden text-lg sm:inline">{t('brand')}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localizePath(item.href, locale)}
              onClick={() => setCurrentPath(item.href)}
              className={`tap-target rounded px-3 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-surface-low text-primary'
                  : 'text-slate-600 hover:bg-surface-low dark:text-slate-300'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            className="tap-target rounded bg-surface-low text-primary ring-1 ring-surface-dim/60 transition-colors hover:bg-surface-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-pressed={theme === 'dark'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            onClick={toggleTheme}
          >
            <FontAwesomeIcon icon={theme === 'dark' ? faSun : faMoon} className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="tap-target rounded bg-surface-low text-primary ring-1 ring-surface-dim/60 transition-colors hover:bg-surface-dim/50 focus:outline-none focus:ring-2 focus:ring-primary/40 md:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <FontAwesomeIcon icon={faBars} className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-surface-dim/60 bg-surface px-4 py-2 md:hidden">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={localizePath(item.href, locale)}
              onClick={() => {
                setCurrentPath(item.href);
                setOpen(false);
              }}
              className={`tap-target w-full justify-start rounded px-3 text-sm font-medium ${
                isActive(item.href) ? 'bg-surface-low text-primary' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
