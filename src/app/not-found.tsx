'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-bold text-surface-dim">404</p>
      <h1 className="mt-4 text-2xl font-bold text-primary">{t('notFound.title')}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{t('notFound.body')}</p>
      <Link
        href="/"
        className="tap-target mt-8 rounded bg-primary px-6 text-base font-semibold text-white hover:bg-primary-900"
      >
        {t('notFound.home')}
      </Link>
    </div>
  );
}
