'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import AppCard from './AppCard';
import { useLocale } from './Providers';
import { OsIcon, prettyOs } from './icons';
import { localizePath } from '@/lib/locale-paths';
import type { AppSummary } from '@/lib/types';

export default function HomeView({ apps }: { apps: AppSummary[] }) {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const [selectedOs, setSelectedOs] = useState<string | null>(null);

  const byOs = new Map<string, AppSummary[]>();
  for (const a of apps) {
    if (!byOs.has(a.os)) byOs.set(a.os, []);
    byOs.get(a.os)!.push(a);
  }
  const osList = [...byOs.keys()];
  const filteredApps = selectedOs ? byOs.get(selectedOs) ?? [] : [];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="py-12 text-center md:py-20">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold text-primary md:text-5xl">
          {t('home.heroTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500 dark:text-slate-400">
          {t('home.heroSubtitle')}
        </p>
      </section>

      <section className="pb-8">
        <h2 className="mb-6 text-2xl font-bold text-primary">{t('home.chooseOs')}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {osList.map((os) => {
            const active = os === selectedOs;
            return (
              <button
                key={os}
                type="button"
                onClick={() => setSelectedOs(active ? null : os)}
                aria-pressed={active}
                className={`tap-target flex-col gap-2 rounded border p-5 text-center transition-colors ${
                  active
                    ? 'border-primary bg-primary text-white'
                    : 'border-surface-dim bg-white text-primary hover:bg-surface-low dark:bg-slate-900'
                }`}
              >
                <OsIcon os={os} className="h-8 w-8" />
                <span className="font-semibold">{prettyOs(os)}</span>
              </button>
            );
          })}
        </div>
      </section>

      {selectedOs && (
        <section className="pb-12">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-primary">
              {t('home.chooseApp', { os: prettyOs(selectedOs) })}
            </h2>
            <button
              type="button"
              onClick={() => setSelectedOs(null)}
              className="tap-target rounded px-3 text-sm font-medium text-primary hover:bg-surface-low"
            >
              {t('home.changeOs')}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredApps.map((a) => (
              <AppCard key={`${a.os}/${a.app}`} app={a} />
            ))}
          </div>
        </section>
      )}

      <section className="pb-16 text-center">
        <Link
          href={localizePath('/guides', locale)}
          className="tap-target rounded px-4 text-sm font-medium text-slate-500 underline-offset-4 hover:text-primary hover:underline dark:text-slate-400"
        >
          {t('home.browseGuides')}
        </Link>
      </section>
    </div>
  );
}
