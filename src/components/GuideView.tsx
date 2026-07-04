'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

import { useLocale } from './Providers';
import MarkdownContent from './MarkdownContent';
import { AppIcon, CategoryIcon, DownloadIcon, OsIcon, prettyApp, prettyOs, StoreIcon } from './icons';
import { localizePath } from '@/lib/locale-paths';
import type { AppGuides, Category, GuideVariant } from '@/lib/types';
import { DEFAULT_LOCALE } from '@/lib/types';

function prettyGuideLabel(value: string) {
  return value
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function storeLabelKey(os: string) {
  if (os === 'android') return 'guide.googlePlay';
  if (os === 'ios' || os === 'macos') return 'guide.appStore';
  return 'guide.store';
}

export default function GuideView({ guide, app }: { guide: GuideVariant; app: AppGuides }) {
  const { t } = useTranslation();
  const { locale } = useLocale();

  const content =
    guide.locales[locale] ?? guide.locales[DEFAULT_LOCALE] ?? Object.values(guide.locales)[0]!;
  const usedFallback = !guide.locales[locale];
  const fm = content.frontmatter;
  const directDownloadUrl = fm.directDownloadUrl ?? fm.downloadUrl;
  const guideLabel = fm.category
    ? t(`categories.${fm.category}`, { defaultValue: prettyGuideLabel(fm.category) })
    : prettyGuideLabel(guide.guide);
  const relatedGuides = app.guides.filter((candidate) => candidate.guide !== guide.guide);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        <Link href={localizePath('/guides', locale)} className="hover:text-primary">{t('nav.guides')}</Link>
        <span className="mx-2">/</span>
        <Link href={localizePath(`/guides/${guide.os}/${guide.app}`, locale)} className="hover:text-primary">
          {prettyApp(guide.app)}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-primary font-medium">{guideLabel}</span>
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

        {(fm.category || directDownloadUrl || fm.storeUrl) && (
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {fm.category && (
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {t(`categories.${fm.category}`)}
              </span>
            )}

            {directDownloadUrl && (
              <a
                href={directDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
              >
                <DownloadIcon className="h-4 w-4" />
                {t('guide.directDownload')}
              </a>
            )}

            {fm.storeUrl && (
              <a
                href={fm.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <StoreIcon os={guide.os} className="h-4 w-4" />
                {t(storeLabelKey(guide.os))}
              </a>
            )}
          </div>
        )}

        {usedFallback && (
          <p className="mt-4 rounded border border-warning/30 bg-warning/10 px-4 py-2 text-sm text-rose-800 dark:text-rose-100">
            {t('guide.fallbackNotice')}
          </p>
        )}
      </header>

      <div className={relatedGuides.length > 0 ? 'grid grid-cols-1 gap-8 lg:grid-cols-[1fr_16rem]' : ''}>
        {relatedGuides.length > 0 && (
          <aside className="order-last lg:order-last">
            <nav
              aria-label={t('guide.relatedGuides')}
              className="space-y-3 lg:sticky lg:top-24"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                {t('guide.relatedGuides')}
              </h2>
              <ul className="space-y-2">
                {relatedGuides.map((related) => {
                  const relatedContent =
                    related.locales[locale] ??
                    related.locales[DEFAULT_LOCALE] ??
                    Object.values(related.locales)[0];
                  if (!relatedContent) return null;

                  const category = relatedContent.frontmatter.category as Category | undefined;
                  const label = category
                    ? t(`categories.${category}`, {
                        defaultValue: prettyGuideLabel(category),
                      })
                    : relatedContent.frontmatter.title;

                  return (
                    <li key={related.guide}>
                      <Link
                        href={localizePath(
                          `/guides/${related.os}/${related.app}/${related.guide}`,
                          locale,
                        )}
                        className="group flex items-center gap-3 rounded-xl border border-surface-dim bg-white p-3 text-sm font-semibold text-primary transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md dark:bg-slate-900"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <CategoryIcon category={category ?? 'setup'} className="h-4 w-4" />
                        </span>
                        <span>{label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>
        )}
        <article className="order-first min-w-0 lg:order-first">
          <MarkdownContent key={`${guide.os}/${guide.app}/${guide.guide}/${locale}`} html={content.html} />
        </article>
      </div>
    </div>
  );
}
