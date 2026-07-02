'use client';

import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-surface-dim/60 bg-surface-low">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-sm text-slate-500 dark:text-slate-400">
        <p className="font-semibold text-primary">
          {t('brand')} — {t('tagline')}
        </p>
        <p>{t('footer.rights')}</p>
        <p className="text-xs">
          © {year} · {t('footer.madeWith')}
        </p>
      </div>
    </footer>
  );
}
