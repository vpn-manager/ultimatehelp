import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

import {
  DEFAULT_LOCALE,
  LOCALES,
  type AppGuides,
  type AppSummary,
  type GuideContent,
  type GuideFrontmatter,
  type GuideStep,
  type GuideSummary,
  type GuideVariant,
  type Locale,
  type OsSummary,
} from './types';

const GUIDES_DIR = path.join(process.cwd(), 'content', 'guides');

const CALLOUT_LABELS: Record<Locale, { warning: string; tip: string }> = {
  en: { warning: 'Warning', tip: 'Pro Tip' },
  ru: { warning: 'Внимание', tip: 'Совет' },
  fa: { warning: 'هشدار', tip: 'نکته حرفه‌ای' },
};

function remarkCallouts(locale: Locale) {
  const labels = CALLOUT_LABELS[locale] ?? CALLOUT_LABELS.en;
  const variants: Record<string, { label: string; cls: string }> = {
    warning: { label: labels.warning, cls: 'callout callout-warning' },
    tip: { label: labels.tip, cls: 'callout callout-tip' },
    'pro-tip': { label: labels.tip, cls: 'callout callout-tip' },
  };

  return (tree: unknown) => {
    visit(tree as any, (node: any) => {
      if (node.type !== 'containerDirective') return;
      const variant = variants[node.name];
      if (!variant) return;

      const data = node.data || (node.data = {});
      data.hName = 'div';
      data.hProperties = {
        className: variant.cls,
        role: 'note',
        'data-callout': node.name,
        'data-label': variant.label,
      };
    });
  };
}

function rehypeCollectSteps(steps: GuideStep[]) {
  return (tree: unknown) => {
    visit(tree as any, 'element', (node: any) => {
      if (node.tagName !== 'h2' && node.tagName !== 'h3') return;
      const id = node.properties?.id;
      if (!id) return;
      const title = toText(node).trim();
      if (!title) return;
      steps.push({ id, title, level: node.tagName === 'h2' ? 2 : 3 });
    });
  };
}

function toText(node: any): string {
  if (node.type === 'text') return node.value as string;
  if (!node.children) return '';
  return node.children.map(toText).join('');
}

async function renderMarkdown(
  raw: string,
  locale: Locale,
): Promise<{ html: string; steps: GuideStep[] }> {
  const steps: GuideStep[] = [];
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDirective)
    .use(remarkCallouts, locale)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeCollectSteps, steps)
    .use(rehypeStringify)
    .process(raw);

  return { html: String(file), steps };
}

async function readGuideFile(filePath: string): Promise<GuideContent> {
  const source = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(source);
  const frontmatter = data as GuideFrontmatter;
  const { html, steps } = await renderMarkdown(content, frontmatter.locale ?? DEFAULT_LOCALE);
  return { frontmatter, html, steps };
}

/**
 * Discover files with the new structure: `<os>/<app>/<guide>.<locale>.md`
 * Also supports legacy flat structure: `<os>/<app>.<locale>.md`
 */
function discoverFiles(): Array<{
  os: string;
  app: string;
  guide: string;
  locale: Locale;
  file: string;
}> {
  if (!fs.existsSync(GUIDES_DIR)) return [];
  const out: Array<{
    os: string;
    app: string;
    guide: string;
    locale: Locale;
    file: string;
  }> = [];

  for (const os of fs.readdirSync(GUIDES_DIR)) {
    const osDir = path.join(GUIDES_DIR, os);
    if (!fs.statSync(osDir).isDirectory()) continue;

    for (const appEntry of fs.readdirSync(osDir)) {
      const appDir = path.join(osDir, appEntry);
      const appStat = fs.statSync(appDir);

      if (appStat.isDirectory()) {
        // New structure: <os>/<app>/<guide>.<locale>.md
        for (const fileName of fs.readdirSync(appDir)) {
          if (!fileName.endsWith('.md')) continue;
          const base = fileName.replace(/\.md$/, '');
          const parts = base.split('.');
          let locale: Locale = DEFAULT_LOCALE;
          let guide = base;
          if (parts.length >= 2 && LOCALES.includes(parts[parts.length - 1] as Locale)) {
            locale = parts.pop() as Locale;
            guide = parts.join('.');
          }
          out.push({
            os,
            app: appEntry,
            guide,
            locale,
            file: path.join(appDir, fileName),
          });
        }
      } else if (appEntry.endsWith('.md')) {
        // Legacy flat structure: <os>/<app>.<locale>.md
        const base = appEntry.replace(/\.md$/, '');
        const parts = base.split('.');
        let locale: Locale = DEFAULT_LOCALE;
        let app = base;
        if (parts.length >= 2 && LOCALES.includes(parts[parts.length - 1] as Locale)) {
          locale = parts.pop() as Locale;
          app = parts.join('.');
        }
        out.push({ os, app, guide: 'setup', locale, file: appDir });
      }
    }
  }
  return out;
}

let _appsCache: AppGuides[] | null = null;

/** Load and render every guide, grouped by os/app with locale variants. */
export async function getAllApps(): Promise<AppGuides[]> {
  if (_appsCache) return _appsCache;

  // Key: "os/app/guide" -> GuideVariant
  const variantMap = new Map<string, GuideVariant>();

  for (const { os, app, guide, locale, file } of discoverFiles()) {
    const key = `${os}/${app}/${guide}`;
    if (!variantMap.has(key)) {
      variantMap.set(key, { os, app, guide, locales: {} });
    }
    variantMap.get(key)!.locales[locale] = await readGuideFile(file);
  }

  // Group by os/app
  const appMap = new Map<string, AppGuides>();
  for (const variant of variantMap.values()) {
    const appKey = `${variant.os}/${variant.app}`;
    if (!appMap.has(appKey)) {
      appMap.set(appKey, { os: variant.os, app: variant.app, guides: [] });
    }
    appMap.get(appKey)!.guides.push(variant);
  }

  // Sort guides within each app by order, then by guide name
  for (const app of appMap.values()) {
    app.guides.sort((a, b) => {
      const oa = a.locales[DEFAULT_LOCALE]?.frontmatter.order ?? 0;
      const ob = b.locales[DEFAULT_LOCALE]?.frontmatter.order ?? 0;
      return oa - ob || a.guide.localeCompare(b.guide);
    });
  }

  _appsCache = [...appMap.values()].sort((a, b) => {
    // Sort apps by first guide's order
    const oa = a.guides[0]?.locales[DEFAULT_LOCALE]?.frontmatter.order ?? 0;
    const ob = b.guides[0]?.locales[DEFAULT_LOCALE]?.frontmatter.order ?? 0;
    return oa - ob || a.app.localeCompare(b.app);
  });

  return _appsCache;
}

/** Get a single app with all its guide variants. */
export async function getApp(os: string, app: string): Promise<AppGuides | undefined> {
  const apps = await getAllApps();
  return apps.find((a) => a.os === os && a.app === app);
}

/** Get a single guide variant within an app. */
export async function getGuide(
  os: string,
  app: string,
  guide: string,
): Promise<GuideVariant | undefined> {
  const apps = await getAllApps();
  const appGuides = apps.find((a) => a.os === os && a.app === app);
  return appGuides?.guides.find((g) => g.guide === guide);
}

/** Params for Next.js generateStaticParams — one entry per os/app/guide. */
export async function getGuideParams(): Promise<
  Array<{ os: string; app: string; guide: string }>
> {
  const apps = await getAllApps();
  const params: Array<{ os: string; app: string; guide: string }> = [];
  for (const a of apps) {
    for (const g of a.guides) {
      params.push({ os: a.os, app: a.app, guide: g.guide });
    }
  }
  return params;
}

/** Params for app pages — one entry per os/app. */
export async function getAppParams(): Promise<Array<{ os: string; app: string }>> {
  const apps = await getAllApps();
  return apps.map(({ os, app }) => ({ os, app }));
}

/** Slim app list for home / index pages. */
export async function getAppSummaries(): Promise<AppSummary[]> {
  const apps = await getAllApps();
  return apps.map(({ os, app, guides }) => {
    const primary = guides[0];
    const fm: AppSummary['primary'] = {};
    if (primary) {
      for (const [loc, content] of Object.entries(primary.locales)) {
        fm[loc as Locale] = content!.frontmatter;
      }
    }
    return { os, app, primary: fm };
  });
}

/** Slim guide list for app landing pages. */
export async function getGuideSummaries(
  os: string,
  app: string,
): Promise<GuideSummary[]> {
  const appGuides = await getApp(os, app);
  if (!appGuides) return [];
  return appGuides.guides.map((g) => {
    const fm: GuideSummary['locales'] = {};
    for (const [loc, content] of Object.entries(g.locales)) {
      fm[loc as Locale] = content!.frontmatter;
    }
    return { os, app, guide: g.guide, locales: fm };
  });
}

export async function getOsSummaries(): Promise<OsSummary[]> {
  const apps = await getAllApps();
  const counts = new Map<string, number>();
  for (const a of apps) counts.set(a.os, (counts.get(a.os) ?? 0) + a.guides.length);
  return [...counts.entries()].map(([os, guideCount]) => ({ os, guideCount }));
}

export function resolveLocale(
  variant: GuideVariant,
  locale: Locale,
): GuideContent {
  return (
    variant.locales[locale] ??
    variant.locales[DEFAULT_LOCALE] ??
    Object.values(variant.locales)[0]!
  );
}
