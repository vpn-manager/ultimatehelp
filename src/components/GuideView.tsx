'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLocale } from './Providers';
import GuideStepper from './GuideStepper';
import MarkdownContent from './MarkdownContent';
import { AppIcon, DownloadIcon, OsIcon, prettyApp, prettyOs } from './icons';
import type { GuideVariant } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/lib/types';

export default function GuideView({ guide }: { guide: GuideVariant }) {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const content =
    guide.locales[locale] ?? guide.locales[DEFAULT_LOCALE] ?? Object.values(guide.locales)[0]!;
  const usedFallback = !guide.locales[locale];
  const fm = content.frontmatter;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        <Link href="/guides" className="hover:text-primary">{t('nav.guides')}</Link>
        <span className="mx-2">/</span>
        <Link href={`/guides/${guide.os}/${guide.app}`} className="hover:text-primary">
          {prettyApp(guide.app)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary font-medium">{fm.title}</span>
      </nav>

      {/* Header */}
      <header className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-surface-low text-primary ring-1 ring-surface-dim/70">
            <AppIcon app={guide.app} className="h-4 w-4" />
          </span>
          <span className="font-medium text-primary">{prettyApp(guide.app)}</span>
          <span aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1.5">
            <OsIcon os={guide.os} className="h-4 w-4 text-primary" />
            {prettyOs(guide.os)}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-primary md:text-4xl">{fm.title}</h1>

        {fm.category && (
          <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {t(`categories.${fm.category}`)}
          </span>
        )}

        {fm.downloadUrl && (
          <a
            href={fm.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
          >
            <DownloadIcon className="h-4 w-4" />
            {t('guide.download')}
          </a>
        )}

        {usedFallback && (
          <p className="mt-4 rounded border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-rose-800 dark:text-rose-100">
            {t('guide.fallbackNotice')}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_16rem]">
        <aside className="order-first lg:order-last">
          <GuideStepper steps={content.steps} />
        </aside>
        <article className="order-last min-w-0 lg:order-first">
          <MarkdownContent key={`${guide.os}/${guide.app}/${guide.guide}/${locale}`} html={content.html} />
        </article>
      </div>
    </div>
  );
}
