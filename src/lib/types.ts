export type Locale = 'en' | 'ru' | 'fa';

export const LOCALES: Locale[] = ['en', 'ru', 'fa'];
export const DEFAULT_LOCALE: Locale = 'en';
export const RTL_LOCALES: Locale[] = ['fa'];

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export type Category = 'setup' | 'update' | 'ping' | 'advanced' | 'troubleshooting';
export const CATEGORIES: Category[] = ['setup', 'update', 'ping', 'advanced', 'troubleshooting'];

/** Frontmatter parsed from each guide Markdown file. */
export interface GuideFrontmatter {
  title: string;
  os: string;
  app: string;
  /** The guide slug (filename without locale), e.g. "setup", "update". */
  guide: string;
  difficulty: Difficulty;
  setupTime: string;
  locale: Locale;
  /** Optional one-line summary shown on cards. */
  summary?: string;
  /** Optional ordering hint for listings (lower = earlier). */
  order?: number;
  /** Optional category for filtering guides. */
  category?: Category;
  /** Optional direct download link for the app. */
  downloadUrl?: string;
}

/** A single rendered guide for one locale. */
export interface GuideContent {
  frontmatter: GuideFrontmatter;
  /** Pre-rendered, sanitised HTML baked at build time. */
  html: string;
  /** Headings extracted for the step navigation sidebar. */
  steps: GuideStep[];
}

export interface GuideStep {
  id: string;
  title: string;
  level: number;
}

/**
 * A guide variant keyed by locale. Holds every locale that exists on disk
 * for one specific guide (e.g. "setup") within an app.
 */
export interface GuideVariant {
  os: string;
  app: string;
  guide: string;
  /** Locale variants keyed by locale code. Always contains DEFAULT_LOCALE. */
  locales: Partial<Record<Locale, GuideContent>>;
}

/**
 * An app grouping all its guide variants.
 * e.g. { os: "android", app: "hiddify", guides: [setup, update, ...] }
 */
export interface AppGuides {
  os: string;
  app: string;
  guides: GuideVariant[];
}

export interface OsSummary {
  os: string;
  guideCount: number;
}

/** Lightweight guide shape for listing pages (no rendered HTML/steps). */
export interface GuideSummary {
  os: string;
  app: string;
  guide: string;
  locales: Partial<Record<Locale, GuideFrontmatter>>;
}

/** Lightweight app shape for home/index pages. */
export interface AppSummary {
  os: string;
  app: string;
  /** The primary guide frontmatter (for title/summary on cards). */
  primary: Partial<Record<Locale, GuideFrontmatter>>;
}
