/**
 * ShieldGuard — Next.js config for fully static export (GitHub Pages).
 *
 * `output: 'export'` produces a static `out/` directory at build time, with
 * every guide pre-rendered from the Markdown files under `/content`.
 *
 * GitHub Pages serves project sites from a sub-path
 * (e.g. https://<user>.github.io/<repo>). When that is the case, set
 * NEXT_PUBLIC_BASE_PATH="/<repo>" so assets and links resolve correctly.
 * For a user/organisation page or a custom domain, leave it empty.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  // GitHub Pages does not run the Next.js image optimiser.
  images: { unoptimized: true },
  // Emit `/guides/android/hiddify/index.html` so static hosts route cleanly.
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
