import { notFound } from 'next/navigation';

import AppView from '@/components/AppView';
import { getApp, getAppParams } from '@/lib/content';

// Required for `output: 'export'` — enumerate every os/app at build time.
export async function generateStaticParams() {
  return getAppParams();
}

export async function generateMetadata({
  params,
}: {
  params: { os: string; app: string };
}) {
  const app = await getApp(params.os, params.app);
  const fm = app?.guides[0] && Object.values(app.guides[0].locales)[0]?.frontmatter;
  return {
    title: fm ? `${fm.title} — UltimateGuide` : 'UltimateGuide',
    description: fm?.summary,
  };
}

export default async function AppPage({
  params,
}: {
  params: { os: string; app: string };
}) {
  const app = await getApp(params.os, params.app);
  if (!app) notFound();
  return <AppView app={app} />;
}
