# UltimateGuide

A fully static, **Markdown-powered** VPN setup guide platform. Built with Next.js
(App Router, `output: 'export'`), Tailwind CSS, and `react-i18next`. Guide content
lives as `.md` files and is pre-rendered to HTML at build time, so the whole site
deploys to GitHub Pages with zero server.

## Tech stack

| Concern        | Choice |
| -------------- | ------ |
| Framework      | Next.js 14 (App Router) with `output: 'export'` |
| Content        | Markdown in `content/guides/**`, parsed with `gray-matter` |
| Rendering      | `remark` / `rehype` → sanitised HTML at build time |
| Styling        | Tailwind CSS + `@tailwindcss/typography` (mobile-first) |
| i18n           | `react-i18next` — English, Russian, Farsi (RTL) |
| Hosting        | GitHub Pages via GitHub Actions |

## Getting started

> Requires Node.js 18+ and npm.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static export to ./out
npm run typecheck  # tsc --noEmit
```

## Authoring guides

Each guide is one Markdown file under `content/guides/<os>/<app>.<locale>.md`.
The locale suffix is optional and defaults to English.

```
content/guides/
  android/
    hiddify.en.md
    hiddify.ru.md
    hiddify.fa.md
  windows/
    nekoray.en.md
  ios/
    streisand.en.md
```

### Frontmatter

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

A new file at `content/guides/<os>/<app>.md` automatically becomes a static page at
`/guides/<os>/<app>` — no code changes needed. The GitHub Actions workflow rebuilds
the site whenever anything under `content/**` changes.

### Special Markdown

- `## Heading` lines become **steps** in the progress sidebar / mobile stepper.
- Fenced code blocks (e.g. config links) automatically get a **Copy** button
  (Web Clipboard API).
- Branded callouts:

  ```markdown
  :::warning
  Never share your private config link publicly.
  :::

  :::tip
  Always download from the official source.
  :::
  ```

## Design system — "Secure Guide System"

Defined once in `tailwind.config.ts` and `src/app/globals.css`:

| Token            | Value     |
| ---------------- | --------- |
| Primary          | `#1a365d` |
| Success Green    | `#22c55e` |
| Warning Rose     | `#f43f5e` |
| Background       | `#f8f9ff` |
| Container-Low    | `#eff4ff` |
| Surface-Dim      | `#ccdbf4` |
| Rounding         | `0.5rem`  |
| Font             | Inter     |

## Deployment (GitHub Pages)

1. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. For a project page (`https://<user>.github.io/<repo>`), the workflow auto-sets
   `NEXT_PUBLIC_BASE_PATH=/<repo>`. For a user page or custom domain, it stays empty.

## Internationalisation

- UI strings live in `src/locales/{en,ru,fa}.json`.
- Language is chosen client-side and persisted to `localStorage`.
- Selecting **FA** flips the document to `dir="rtl"`, mirroring the whole layout.
- Guide content follows the active locale and falls back to English when a
  translation is missing (with an on-page notice).

## Stitch MCP

The design tokens above are the contract the Stitch MCP server reads and writes.
Keeping them centralised in `tailwind.config.ts` lets the assistant sync screen
structures and tokens without touching component logic.
