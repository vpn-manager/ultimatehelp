import { LOCALES, type Locale } from './types';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function getLocaleFromPathname(pathname: string): Locale | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0];
  return firstSegment && isLocale(firstSegment) ? firstSegment : null;
}

export function stripLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments[0] && isLocale(segments[0])) {
    segments.shift();
  }

  return segments.length ? `/${segments.join('/')}` : '/';
}

export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path;

  const suffixIndex = path.search(/[?#]/);
  const pathname = suffixIndex === -1 ? path : path.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : path.slice(suffixIndex);
  const unlocalizedPath = stripLocaleFromPathname(pathname);

  return `/${locale}${unlocalizedPath === '/' ? '' : unlocalizedPath}${suffix}`;
}

export function stripBasePath(pathname: string): string {
  if (!BASE_PATH) return pathname;
  if (pathname === BASE_PATH) return '/';
  if (pathname.startsWith(`${BASE_PATH}/`)) return pathname.slice(BASE_PATH.length);
  return pathname;
}

export function withBasePath(pathname: string): string {
  if (!BASE_PATH || !pathname.startsWith('/') || pathname.startsWith(`${BASE_PATH}/`)) {
    return pathname;
  }
  return `${BASE_PATH}${pathname}`;
}
