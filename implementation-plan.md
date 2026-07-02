# Implementation Plan: Guide Categories & Download Links

## Overview

This plan adds two features to the Next.js static VPN guide platform:
1. **Guide Categories** - Add filtering by category (setup, update, advanced, troubleshooting)
2. **Download Links in Frontmatter** - Add prominent download buttons on cards and guide pages

---

## Feature 1: Guide Categories

### 1.1 Type Changes

**File: `src/lib/types.ts`**

Add new category type and constants after the `Difficulty` type (line 7):

```typescript
export type Category = 'setup' | 'update' | 'advanced' | 'troubleshooting';
export const CATEGORIES: Category[] = ['setup', 'update', 'advanced', 'troubleshooting'];
```

Add `category` field to `GuideFrontmatter` interface (after line 16):

```typescript
/** Optional category for filtering guides. */
category?: Category;
```

### 1.2 i18n String Additions

**File: `src/locales/en.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "Difficulty",
  "setupTime": "Setup time",
  "steps": "Steps",
  "onThisPage": "On this page",
  "stepList": "Step list",
  "stepProgress": "Step {{current}} of {{total}}",
  "fallbackNotice": "This guide isn't translated yet — showing the English version.",
  "category": "Category"
}
```

Add new `categories` section:

```json
"categories": {
  "all": "All",
  "setup": "Setup",
  "update": "Update",
  "advanced": "Advanced",
  "troubleshooting": "Troubleshooting"
}
```

**File: `src/locales/ru.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "Сложность",
  "setupTime": "Время настройки",
  "steps": "Шаги",
  "onThisPage": "На этой странице",
  "stepList": "Список шагов",
  "stepProgress": "Шаг {{current}} из {{total}}",
  "fallbackNotice": "Эта инструкция ещё не переведена — показана английская версия.",
  "category": "Категория"
}
```

Add new `categories` section:

```json
"categories": {
  "all": "Все",
  "setup": "Настройка",
  "update": "Обновление",
  "advanced": "Продвинутое",
  "troubleshooting": "Решение проблем"
}
```

**File: `src/locales/fa.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "سطح دشواری",
  "setupTime": "زمان راه‌اندازی",
  "steps": "مراحل",
  "onThisPage": "در این صفحه",
  "stepList": "فهرست مراحل",
  "stepProgress": "مرحله {{current}} از {{total}}",
  "fallbackNotice": "این راهنما هنوز ترجمه نشده است — نسخه انگلیسی نمایش داده می‌شود.",
  "category": "دسته‌بندی"
}
```

Add new `categories` section:

```json
"categories": {
  "all": "همه",
  "setup": "راه‌اندازی",
  "update": "به‌روزرسانی",
  "advanced": "پیشرفته",
  "troubleshooting": "رفع مشکل"
}
```

### 1.3 Component Changes

#### 1.3.1 Create CategoryFilter Component

**New File: `src/components/CategoryFilter.tsx`**

```typescript
'use client';

import { useTranslation } from 'react-i18next';
import { CATEGORIES, type Category } from '@/lib/types';

interface CategoryFilterProps {
  selected: Category | null;
  onChange: (category: Category | null) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
          selected === null
            ? 'bg-primary text-white'
            : 'bg-surface-low text-slate-600 hover:bg-surface-dim dark:text-slate-300'
        }`}
      >
        {t('categories.all')}
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(selected === cat ? null : cat)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selected === cat
              ? 'bg-primary text-white'
              : 'bg-surface-low text-slate-600 hover:bg-surface-dim dark:text-slate-300'
          }`}
        >
          {t(`categories.${cat}`)}
        </button>
      ))}
    </div>
  );
}
```

#### 1.3.2 Update HomeView.tsx

**File: `src/components/HomeView.tsx`**

1. Add import for CategoryFilter and Category type
2. Add `selectedCategory` state after `selectedOs` state
3. Add CategoryFilter component after OS selection section, before guide grid
4. Filter guides by category when rendering

Changes:

```typescript
// Add imports (line 7)
import CategoryFilter from './CategoryFilter';
import type { Category } from '@/lib/types';

// Add state (after line 13)
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

// Filter apps by category (after line 22)
const filteredApps = selectedCategory
  ? apps.filter((g) => {
      const fm = g.locales['en'] ?? Object.values(g.locales)[0];
      return fm?.category === selectedCategory;
    })
  : apps;

// Add CategoryFilter in Step 2 section (after line 75, before grid)
{apps.length > 0 && (
  <div className="mb-6">
    <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
  </div>
)}

// Update grid to use filteredApps (line 77)
{filteredApps.map((g) => (
  <GuideCard key={`${g.os}/${g.app}`} guide={g} />
))}
```

#### 1.3.3 Update GuidesIndexView.tsx

**File: `src/components/GuidesIndexView.tsx`**

1. Add useState import
2. Add import for CategoryFilter and Category type
3. Add `selectedCategory` state
4. Add CategoryFilter component after title/subtitle
5. Filter guides by category when rendering

Changes:

```typescript
// Add imports (line 3)
import { useState } from 'react';

// Add imports (after line 5)
import CategoryFilter from './CategoryFilter';
import type { Category } from '@/lib/types';

// Add state (inside component, after line 9)
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

// Filter guides (after state declaration)
const filteredGuides = selectedCategory
  ? guides.filter((g) => {
      const fm = g.locales['en'] ?? Object.values(g.locales)[0];
      return fm?.category === selectedCategory;
    })
  : guides;

// Add CategoryFilter after subtitle (after line 14)
<div className="mt-6">
  <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
</div>

// Update grid to use filteredGuides (line 22)
{filteredGuides.map((g) => (
  <GuideCard key={`${g.os}/${g.app}`} guide={g} />
))}
```

#### 1.3.4 Update GuideCard.tsx

**File: `src/components/GuideCard.tsx`**

1. Add category badge display after app/OS labels

Changes (after line 31):

```typescript
{fm.category && (
  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
    {t(`categories.${fm.category}`)}
  </span>
)}
```

Add import for useTranslation:

```typescript
import { useTranslation } from 'react-i18next';
```

Add `const { t } = useTranslation();` inside component.

#### 1.3.5 Update GuideView.tsx

**File: `src/components/GuideView.tsx`**

1. Add category badge in header area (after line 35, before closing header tag)

Changes:

```typescript
{fm.category && (
  <span className="mt-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
    {t(`categories.${fm.category}`)}
  </span>
)}
```

### 1.4 Guide File Frontmatter Updates

Add `category` field to all 27 markdown files. Examples:

**Setup guides (initial configuration):**
- `content/guides/android/hiddify.en.md`: `category: "setup"`
- `content/guides/windows/v2rayn.en.md`: `category: "setup"`
- `content/guides/windows/nekoray.en.md`: `category: "setup"`

**Update guides:**
- Any guide focused on updating subscriptions/apps: `category: "update"`

**Advanced guides:**
- Guides covering advanced features: `category: "advanced"`

**Troubleshooting guides:**
- Guides fixing issues: `category: "troubleshooting"`

---

## Feature 2: Download Links in Frontmatter

### 2.1 Type Changes

**File: `src/lib/types.ts`**

Add `downloadUrl` field to `GuideFrontmatter` interface (after `category` field):

```typescript
/** Optional direct download link for the app. */
downloadUrl?: string;
```

### 2.2 i18n String Additions

**File: `src/locales/en.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "Difficulty",
  "setupTime": "Setup time",
  "steps": "Steps",
  "onThisPage": "On this page",
  "stepList": "Step list",
  "stepProgress": "Step {{current}} of {{total}}",
  "fallbackNotice": "This guide isn't translated yet — showing the English version.",
  "category": "Category",
  "download": "Download"
}
```

**File: `src/locales/ru.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "Сложность",
  "setupTime": "Время настройки",
  "steps": "Шаги",
  "onThisPage": "На этой странице",
  "stepList": "Список шагов",
  "stepProgress": "Шаг {{current}} из {{total}}",
  "fallbackNotice": "Эта инструкция ещё не переведена — показана английская версия.",
  "category": "Категория",
  "download": "Скачать"
}
```

**File: `src/locales/fa.json`**

Add to `guide` section:

```json
"guide": {
  "difficulty": "سطح دشواری",
  "setupTime": "زمان راه‌اندازی",
  "steps": "مراحل",
  "onThisPage": "در این صفحه",
  "stepList": "فهرست مراحل",
  "stepProgress": "مرحله {{current}} از {{total}}",
  "fallbackNotice": "این راهنما هنوز ترجمه نشده است — نسخه انگلیسی نمایش داده می‌شود.",
  "category": "دسته‌بندی",
  "download": "دانلود"
}
```

### 2.3 Icon Changes

**File: `src/components/icons.tsx`**

Add download icon import (line 4):

```typescript
import {
  faCat,
  faDesktop,
  faDownload,
  faNetworkWired,
  faPaperPlane,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';
```

Add DownloadIcon component (after AppIcon function):

```typescript
export function DownloadIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return <FontAwesomeIcon icon={faDownload} className={className} aria-hidden="true" />;
}
```

### 2.4 Component Changes

#### 2.4.1 Update GuideCard.tsx

**File: `src/components/GuideCard.tsx`**

1. Import DownloadIcon
2. Add download button as secondary action (after Link closing tag)

Changes:

```typescript
// Add import (line 6)
import { AppIcon, DownloadIcon, OsIcon, prettyApp, prettyOs } from './icons';

// Replace single Link with wrapper div containing Link and optional download button
// Current structure (lines 16-41):
return (
  <Link
    href={`/guides/${guide.os}/${guide.app}`}
    className="group flex items-center gap-3 rounded border border-surface-dim bg-white p-5 transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 dark:bg-slate-900"
  >
    {/* ... card content ... */}
  </Link>
);

// New structure:
return (
  <div className="relative rounded border border-surface-dim bg-white p-5 transition-shadow hover:shadow-md dark:bg-slate-900">
    <Link
      href={`/guides/${guide.os}/${guide.app}`}
      className="group flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      {/* ... card content ... */}
    </Link>
    {fm.downloadUrl && (
      <a
        href={fm.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
      >
        <DownloadIcon className="h-3 w-3" />
        {t('guide.download')}
      </a>
    )}
  </div>
);
```

#### 2.4.2 Update GuideView.tsx

**File: `src/components/GuideView.tsx`**

1. Import DownloadIcon
2. Add download button in header area

Changes:

```typescript
// Add import (line 8)
import { AppIcon, DownloadIcon, OsIcon, prettyApp, prettyOs } from './icons';

// Add download button in header (after category badge, before closing header tag)
{fm.downloadUrl && (
  <a
    href={fm.downloadUrl}
    target="_blank"
    rel="noopener noreferrer"
    className="mt-4 inline-flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
  >
    <DownloadIcon className="h-4 w-4" />
    {t('guide.download')}
  </a>
)}
```

### 2.5 Guide File Frontmatter Updates

Add `downloadUrl` field to guides that have download links. Based on current markdown content:

**Android Hiddify:**
```yaml
downloadUrl: "https://github.com/hiddify/hiddify-next/releases/latest/download/hiddify-android-arm7.apk"
```

**Windows v2rayN:**
```yaml
downloadUrl: "https://github.com/2dust/v2rayN/releases/latest/download/v2rayN-windows-64.zip"
```

**Other guides:** Add appropriate download URLs based on their markdown content.

---

## Implementation Order

1. **Phase 1: Types & Constants**
   - Update `src/lib/types.ts` with Category type, CATEGORIES constant, and downloadUrl field

2. **Phase 2: i18n Strings**
   - Update all three locale files with category and download strings

3. **Phase 3: New Components**
   - Create `src/components/CategoryFilter.tsx`

4. **Phase 4: Icon Updates**
   - Add DownloadIcon to `src/components/icons.tsx`

5. **Phase 5: Component Updates**
   - Update `GuideCard.tsx` with category badge and download button
   - Update `GuideView.tsx` with category badge and download button
   - Update `HomeView.tsx` with category filter
   - Update `GuidesIndexView.tsx` with category filter

6. **Phase 6: Content Updates**
   - Add `category` field to all 27 markdown files
   - Add `downloadUrl` field to guides with download links

7. **Phase 7: Verification**
   - Run `npm run build` to verify static export
   - Run `npm run typecheck` to verify TypeScript
   - Run `npm run lint` to verify code style
   - Test filtering on home page
   - Test filtering on guides index page
   - Test category badge on individual guide pages
   - Test download button functionality

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/lib/types.ts` | Add Category type, CATEGORIES constant, category & downloadUrl fields |
| `src/locales/en.json` | Add categories section, guide.category, guide.download |
| `src/locales/ru.json` | Add categories section, guide.category, guide.download |
| `src/locales/fa.json` | Add categories section, guide.category, guide.download |
| `src/components/CategoryFilter.tsx` | New component for category filtering |
| `src/components/icons.tsx` | Add DownloadIcon component |
| `src/components/GuideCard.tsx` | Add category badge, download button, useTranslation |
| `src/components/GuideView.tsx` | Add category badge, download button, DownloadIcon import |
| `src/components/HomeView.tsx` | Add category filter state and CategoryFilter component |
| `src/components/GuidesIndexView.tsx` | Add category filter state and CategoryFilter component |
| `content/guides/**/*.md` (27 files) | Add category field to frontmatter |
| `content/guides/**/*.md` (subset) | Add downloadUrl field to frontmatter |

---

## Verification Steps

1. **Type Safety**
   ```bash
   npm run typecheck
   ```

2. **Build Verification**
   ```bash
   npm run build
   ```

3. **Lint Check**
   ```bash
   npm run lint
   ```

4. **Manual Testing**
   - Start dev server: `npm run dev`
   - Home page: Select OS → verify category filter appears → filter guides
   - Guides index: Verify category filter at top → filter guides
   - Individual guide: Verify category badge in header
   - Download button: Click → opens in new tab
   - RTL (Farsi): Verify layout and filtering work correctly

---

## Notes

- **Backward Compatibility**: All new fields are optional (`category?`, `downloadUrl?`), so existing guides without these fields will continue to work.
- **Static Export**: All data is available at build time through frontmatter, no runtime API calls needed.
- **i18n**: Category labels and download button text are translatable via i18n keys.
- **RTL Support**: Category filter and download button use standard Tailwind classes that respect RTL direction.
