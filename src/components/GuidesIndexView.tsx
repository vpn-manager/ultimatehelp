'use client';

import { useTranslation } from 'react-i18next';

import AppCard from './AppCard';
import type { AppSummary } from '@/lib/types';

export default function GuidesIndexView({ apps }: { apps: AppSummary[] }) {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary">{t('guides.title')}</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">{t('guides.subtitle')}</p>

      {apps.length === 0 ? (
        <p className="mt-8 rounded bg-surface-low px-4 py-6 text-center text-slate-500 dark:text-slate-400">
          {t('guides.empty')}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((a) => (
            <AppCard key={`${a.os}/${a.app}`} app={a} />
          ))}
        </div>
      )}
    </div>
  );
}
