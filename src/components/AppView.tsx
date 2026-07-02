'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLocale } from './Providers';
import { AppIcon, CategoryIcon, DownloadIcon, OsIcon, prettyApp, prettyOs } from './icons';
import type { AppGuides, Category } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/lib/types';

const CATEGORY_COLORS: Record<Category, { bg: string; border: string; text: string }> = {
  setup: { bg: 'bg-blue-50 dark:bg-blue-950/30', border: 'border-l-blue-500', text: 'text-blue-700 dark:text-blue-300' },
  update: { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-l-amber-500', text: 'text-amber-700 dark:text-amber-300' },
  advanced: { bg: 'bg-purple-50 dark:bg-purple-950/30', border: 'border-l-purple-500', text: 'text-purple-700 dark:text-purple-300' },
  troubleshooting: { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-l-rose-500', text: 'text-rose-700 dark:text-rose-300' },
};

export default function AppView({ app }: { app: AppGuides }) {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const firstGuide = app.guides[0];
  const primaryContent = firstGuide
    ? firstGuide.locales[locale] ?? firstGuide.locales[DEFAULT_LOCALE] ?? Object.values(firstGuide.locales)[0]
    : null;
  const primaryFm = primaryContent?.frontmatter;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/guides" className="hover:text-primary transition-colors">{t('nav.guides')}</Link>
        <span className="mx-2 text-slate-300 dark:text-slate-600">/</span>
        <span className="text-primary font-medium">{prettyApp(app.app)}</span>
      </nav>

      <header className="mb-10">
        <div className="flex items-center gap-5">
          <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-surface-low text-primary ring-1 ring-surface-dim/70 shadow-sm">
            <AppIcon app={app.app} className="h-10 w-10" />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-primary md:text-4xl">
              {prettyApp(app.app)}
            </h1>
            <div className="mt-1.5 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <OsIcon os={app.os} className="h-4 w-4" />
              {prettyOs(app.os)}
            </div>
          </div>
        </div>

        {primaryFm?.downloadUrl && (
          <a
            href={primaryFm.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2.5 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          >
            <DownloadIcon className="h-4 w-4" />
            {t('guide.download')} {prettyApp(app.app)}
          </a>
        )}
      </header>

      <section>
        <h2 className="mb-5 text-xl font-bold text-primary">{t('app.guides')}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {app.guides.map((guide) => {
            const content =
              guide.locales[locale] ?? guide.locales[DEFAULT_LOCALE] ?? Object.values(guide.locales)[0];
            if (!content) return null;
            const fm = content.frontmatter;

            const cat = fm.category as Category | undefined;
            const colors = cat ? CATEGORY_COLORS[cat] : null;
            const categoryLabel = cat ? t(`categories.${cat}`) : null;

            return (
              <Link
                key={guide.guide}
                href={`/guides/${app.os}/${app.app}/${guide.guide}`}
                className={`group relative overflow-hidden rounded-xl border border-surface-dim border-l-4 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-900 ${
                  colors ? colors.border : 'border-l-primary'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${colors ? colors.bg : 'bg-primary/10'} ${colors ? colors.text : 'text-primary'}`}>
                    <CategoryIcon category={cat ?? 'setup'} className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                      {categoryLabel ?? fm.title}
                    </h3>
                    {fm.summary && (
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {fm.summary}
                      </p>
                    )}
                  </div>
                  <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-low text-slate-400 transition-all group-hover:bg-primary group-hover:text-white dark:bg-slate-800">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
