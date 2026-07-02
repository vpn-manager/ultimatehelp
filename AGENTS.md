# AGENTS.md

## Project overview

Static, Markdown-powered VPN setup guide platform. Next.js 14 App Router with `output: 'export'` → deploys to GitHub Pages.

## Quick commands

```bash
npm run dev          # http://localhost:3000
npm run build        # static export to ./out
npm run typecheck    # tsc --noEmit
npm run lint         # next lint
```

No test suite exists. Verify changes with `npm run build` (catches TypeScript, MDX, and route errors).

## Content authoring

Guides live at `content/guides/<os>/<app>.<locale>.md`. Adding a file auto-generates a route at `/guides/<os>/<app>/` — no code changes needed.

**Frontmatter is required:**
```yaml
---
title: "Set Up Hiddify on Android"
os: "android"
app: "hiddify"
difficulty: "Beginner"     # Beginner | Intermediate | Advanced
setupTime: "5 mins"
locale: "en"               # en | ru | fa
order: 1                   # optional listing order
summary: "Shown on cards"  # optional
---
```

**Markdown conventions:**
- `## Heading` → step in the progress sidebar (h2 and h3 both count)
- `:::warning` / `:::tip` → branded callout divs
- Fenced code blocks auto-get a Copy button (Web Clipboard API)
- Locale fallback: if `<app>.<locale>.md` is missing, English version shows with a notice

## Architecture

| Layer | Location |
|-------|----------|
| Routes | `src/app/` (App Router) |
| Components | `src/components/` |
| Content pipeline | `src/lib/content.ts` — reads MD, runs remark→rehype, caches |
| i18n | `src/lib/i18n.ts` + `src/locales/{en,ru,fa}.json` |
| Design tokens | `tailwind.config.ts` + `src/app/globals.css` CSS variables |

**Content pipeline:** `remark-parse → remark-gfm → remark-directive → remark-rehype → rehype-raw → rehype-slug → rehype-stringify`. Callouts use `remark-directive` container syntax.

## i18n

- Client-side via `react-i18next`, persisted to `localStorage`
- Farsi (`fa`) triggers RTL layout (`dir="rtl"`)
- UI strings in `src/locales/*.json`; guide content in per-locale `.md` files
- Adding a new locale: add file to `src/locales/`, update `LOCALES` in `src/lib/types.ts`, update `src/lib/i18n.ts`

## Deployment

Push to `main` → `.github/workflows/deploy.yml` builds and deploys to GitHub Pages.

- `NEXT_PUBLIC_BASE_PATH` auto-set for project pages (`/<repo>`)
- `images: { unoptimized: true }` — no Next.js image optimization (GitHub Pages)
- `trailingSlash: true` — generates `/guides/os/app/index.html`

## Gotchas

- No `npm test` — verify with `npm run build` instead
- Design tokens are CSS custom properties in `globals.css`, referenced via `rgb(var(--color-*) / <alpha-value>)` in Tailwind
- `content.ts` caches guides in-memory (`_cache`) — fine for build, not for dev hot-reload of new content files
- `generateStaticParams()` in `src/app/guides/[os]/[app]/page.tsx` enumerates all guides at build time
- `dangerouslySetInnerHTML` used in `MarkdownContent.tsx` — HTML is build-time trusted, not user input
