'use client';

import { useTranslation } from 'react-i18next';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqView() {
  const { t } = useTranslation();
  const items = (t('faq.items', { returnObjects: true }) as FaqItem[]) ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary">{t('faq.title')}</h1>
      <dl className="mt-8 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="rounded border border-surface-dim bg-white p-5 dark:bg-slate-900">
            <dt className="font-semibold text-primary">{item.q}</dt>
            <dd className="mt-2 text-slate-600 dark:text-slate-300">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
