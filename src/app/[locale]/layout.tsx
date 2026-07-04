import { notFound } from 'next/navigation';

import { isLocale } from '@/lib/locale-paths';
import { LOCALES, type Locale } from '@/lib/types';

export function generateStaticParams(): Array<{ locale: Locale }> {
  return LOCALES.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!isLocale(params.locale)) notFound();
  return children;
}
