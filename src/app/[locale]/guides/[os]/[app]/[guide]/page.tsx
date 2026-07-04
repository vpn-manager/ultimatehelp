import { notFound } from 'next/navigation';

import GuideView from '@/components/GuideView';
import { getApp, getGuide, getGuideParams } from '@/lib/content';
import { isLocale } from '@/lib/locale-paths';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/types';

export async function generateStaticParams() {
  const params = await getGuideParams();
  return LOCALES.flatMap((locale) => params.map((param) => ({ locale, ...param })));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; os: string; app: string; guide: string };
}) {
  const locale = isLocale(params.locale) ? params.locale : null;
  const guide = await getGuide(params.os, params.app, params.guide);
  const fm = guide
    ? guide.locales[locale ?? DEFAULT_LOCALE]?.frontmatter ?? Object.values(guide.locales)[0]?.frontmatter
    : undefined;
  return {
    title: fm ? `${fm.title} — UltimateGuide` : 'UltimateGuide',
    description: fm?.summary,
  };
}

export default async function LocalizedGuidePage({
  params,
}: {
  params: { locale: string; os: string; app: string; guide: string };
}) {
  if (!isLocale(params.locale)) notFound();
  const guide = await getGuide(params.os, params.app, params.guide);
  const app = await getApp(params.os, params.app);
  if (!guide || !app) notFound();
  return <GuideView guide={guide} app={app} />;
}
