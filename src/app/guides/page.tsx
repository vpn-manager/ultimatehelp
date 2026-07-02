import GuidesIndexView from '@/components/GuidesIndexView';
import { getAppSummaries } from '@/lib/content';

export default async function GuidesPage() {
  const apps = await getAppSummaries();
  return <GuidesIndexView apps={apps} />;
}
