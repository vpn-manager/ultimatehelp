'use client';

import { useTranslation } from 'react-i18next';

export default function AboutView() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-bold text-primary">{t('about.title')}</h1>
      <p className="mt-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{t('about.body')}</p>
    </div>
  );
}
