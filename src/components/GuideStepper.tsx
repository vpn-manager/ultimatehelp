'use client';

import { faChevronDown, faListOl } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { GuideStep } from '@/lib/types';

/**
 * Step navigation that tracks reading progress.
 *  - Desktop (lg+): a sticky vertical sidebar.
 *  - Mobile: a horizontal, scrollable progress bar that doubles as a jump list.
 */
export default function GuideStepper({ steps }: { steps: GuideStep[] }) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState<string>(steps[0]?.id ?? '');

  useEffect(() => {
    if (steps.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
    );

    for (const step of steps) {
      const el = document.getElementById(step.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [steps]);

  if (steps.length === 0) return null;

  const activeIndex = Math.max(0, steps.findIndex((s) => s.id === activeId));
  const progress = ((activeIndex + 1) / steps.length) * 100;
  const activeStep = steps[activeIndex];

  return (
    <>
      {/* Mobile: compact progress card + readable vertical jump list. */}
      <nav aria-label={t('guide.stepList')} className="lg:hidden">
        <details open className="group rounded-xl border border-surface-dim bg-white p-3 shadow-sm dark:bg-slate-900">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-surface-low text-primary">
                <FontAwesomeIcon icon={faListOl} className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {t('guide.stepProgress', { current: activeIndex + 1, total: steps.length })}
                </span>
                <span className="block truncate text-sm font-semibold text-primary">
                  {activeStep?.title ?? t('guide.stepList')}
                </span>
              </span>
            </span>
            <FontAwesomeIcon
              icon={faChevronDown}
              className="h-4 w-4 shrink-0 text-primary transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-dim">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <ol className="mt-3 max-h-72 space-y-2 overflow-y-auto pe-1">
            {steps.map((step, i) => {
              const active = step.id === activeId;
              return (
                <li key={step.id}>
                  <a
                    href={`#${step.id}`}
                    aria-current={active ? 'true' : undefined}
                    className={`flex min-h-touch items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      active
                        ? 'border-primary bg-primary text-white'
                        : 'border-surface-dim bg-surface-low text-primary hover:bg-surface-dim/50'
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        active ? 'bg-white/15 text-white' : 'bg-white text-primary dark:bg-slate-900'
                      }`}
                    >
                      {i + 1}
                    </span>
                    <span className="line-clamp-2">{step.title}</span>
                  </a>
                </li>
              );
            })}
          </ol>
        </details>
      </nav>

      {/* Desktop: sticky vertical stepper */}
      <nav
        aria-label={t('guide.onThisPage')}
        className="sticky top-24 hidden max-h-[calc(100vh-7rem)] overflow-y-auto lg:block"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {t('guide.onThisPage')}
        </p>
        <ol className="space-y-1 border-s border-surface-dim">
          {steps.map((step) => (
            <li key={step.id}>
              <a
                href={`#${step.id}`}
                aria-current={step.id === activeId ? 'true' : undefined}
                className={`-ms-px block border-s-2 py-1 text-sm transition-colors ${
                  step.level === 3 ? 'ps-6' : 'ps-4'
                } ${
                  step.id === activeId
                    ? 'border-primary font-medium text-primary'
                    : 'border-transparent text-slate-500 hover:border-surface-dim hover:text-primary dark:text-slate-400'
                }`}
              >
                {step.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
