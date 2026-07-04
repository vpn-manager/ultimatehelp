import GuidesIndexView from '@/components/GuidesIndexView';
import { getAppSummaries } from '@/lib/content';

export default async function LocalizedGuidesPage() {
  const apps = await getAppSummaries();
  return <GuidesIndexView apps={apps} />;
}
