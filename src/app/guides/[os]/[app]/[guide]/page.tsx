import { notFound } from 'next/navigation';

import GuideView from '@/components/GuideView';
import { getApp, getGuide, getGuideParams } from '@/lib/content';

// Required for `output: 'export'` — enumerate every os/app/guide at build time.
export async function generateStaticParams() {
  return getGuideParams();
}

export async function generateMetadata({
  params,
}: {
  params: { os: string; app: string; guide: string };
}) {
  const guide = await getGuide(params.os, params.app, params.guide);
  const fm = guide && Object.values(guide.locales)[0]?.frontmatter;
  return {
    title: fm ? `${fm.title} — UltimateGuide` : 'UltimateGuide',
    description: fm?.summary,
  };
}

export default async function GuidePage({
  params,
}: {
  params: { os: string; app: string; guide: string };
}) {
  const guide = await getGuide(params.os, params.app, params.guide);
  const app = await getApp(params.os, params.app);
  if (!guide || !app) notFound();
  return <GuideView guide={guide} app={app} />;
}
