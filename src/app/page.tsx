import HomeView from '@/components/HomeView';
import { getAppSummaries } from '@/lib/content';

export default async function HomePage() {
  const apps = await getAppSummaries();
  return <HomeView apps={apps} />;
}
