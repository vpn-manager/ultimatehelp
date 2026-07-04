import { notFound } from 'next/navigation';

import AppView from '@/components/AppView';
import { getApp, getAppParams } from '@/lib/content';
import { isLocale } from '@/lib/locale-paths';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/types';

export async function generateStaticParams() {
  const params = await getAppParams();
  return LOCALES.flatMap((locale) => params.map((param) => ({ locale, ...param })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; os: string; app: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : null;
  const app = await getApp(params.os, params.app);
  const fm = app?.guides[0]
    ? app.guides[0].locales[locale ?? DEFAULT_LOCALE]?.frontmatter ?? Object.values(app.guides[0].locales)[0]?.frontmatter
    : undefined;
  return {
    title: fm ? `${fm.title} — UltimateGuide` : 'UltimateGuide',
    description: fm?.summary,
  };
}

export default async function LocalizedAppPage({
  params,
}: {
  params: { locale: string; os: string; app: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const app = await getApp(params.os, params.app);
  if (!app) notFound();
  return <AppView app={app} />;
}
