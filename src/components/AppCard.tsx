'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLocale } from './Providers';
import { AppIcon, OsIcon, prettyApp, prettyOs } from './icons';
import { localizePath } from '@/lib/locale-paths';
import type { AppSummary } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/lib/types';

export default function AppCard({ app }: { app: AppSummary }) {
  const { locale } = useLocale();
  const { t } = useTranslation();
  const fm = app.primary[locale] ?? app.primary[DEFAULT_LOCALE] ?? Object.values(app.primary)[0];

  return (
    <Link
      href={localizePath(`/guides/${app.os}/${app.app}`, locale)}
      className="group flex items-center gap-3 rounded border border-surface-dim bg-white p-5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-900"
    >
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-low text-primary ring-1 ring-surface-dim/70">
        <AppIcon app={app.app} className="h-6 w-6" />
        <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary ring-1 ring-surface-dim dark:bg-slate-950">
          <OsIcon os={app.os} className="h-3 w-3" />
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-lg font-semibold text-primary group-hover:underline">
          {prettyApp(app.app)}
        </span>
        <span className="mt-0.5 block text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {prettyOs(app.os)}
        </span>
        {fm?.summary ? (
          <span className="mt-0.5 block line-clamp-2 text-sm text-slate-500 dark:text-slate-400">
            {fm.summary}
          </span>
        ) : (
          <span className="mt-0.5 block text-sm text-slate-500 dark:text-slate-400">
            {t('app.guidesAvailable')}
          </span>
        )}
      </span>
    </Link>
  );
}
