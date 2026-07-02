import { faAndroid, faApple, faLinux, faWindows } from '@fortawesome/free-brands-svg-icons';
import {
  faCat,
  faDesktop,
  faDownload,
  faNetworkWired,
  faPaperPlane,
  faRocket,
  faServer,
  faShieldHalved,
  faWandMagicSparkles,
  faWrench,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/** Font Awesome OS glyphs used on cards and guide headers. */
export function OsIcon({ os, className = 'h-8 w-8' }: { os: string; className?: string }) {
  const icon =
    {
      android: faAndroid,
      ios: faApple,
      macos: faApple,
      windows: faWindows,
      linux: faLinux,
    }[os.toLowerCase()] ?? faDesktop;

  return <FontAwesomeIcon icon={icon} className={className} aria-hidden="true" />;
}

/** App-specific glyphs for clients that do not have official Font Awesome brands. */
export function AppIcon({ app, className = 'h-8 w-8' }: { app: string; className?: string }) {
  const key = app.toLowerCase();
  const icon =
    {
      hiddify: faShieldHalved,
      nekoray: faCat,
      v2rayn: faNetworkWired,
      v2rayng: faNetworkWired,
      streisand: faPaperPlane,
    }[key] ?? faDesktop;

  return <FontAwesomeIcon icon={icon} className={className} aria-hidden="true" />;
}

export function prettyOs(os: string): string {
  const map: Record<string, string> = {
    android: 'Android',
    ios: 'iOS',
    macos: 'macOS',
    windows: 'Windows',
    linux: 'Linux',
  };
  return map[os.toLowerCase()] ?? os.charAt(0).toUpperCase() + os.slice(1);
}

export function prettyApp(app: string): string {
  const map: Record<string, string> = {
    hiddify: 'Hiddify',
    nekoray: 'NekoRay',
    v2rayn: 'v2rayN',
    v2rayng: 'v2rayNG',
    streisand: 'Streisand',
  };
  return map[app.toLowerCase()] ?? app.charAt(0).toUpperCase() + app.slice(1);
}

export function DownloadIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return <FontAwesomeIcon icon={faDownload} className={className} aria-hidden="true" />;
}

export function CategoryIcon({ category, className = 'h-4 w-4' }: { category: string; className?: string }) {
  const icon =
    {
      setup: faRocket,
      update: faServer,
      advanced: faWandMagicSparkles,
      troubleshooting: faWrench,
    }[category] ?? faDesktop;

  return <FontAwesomeIcon icon={icon} className={className} aria-hidden="true" />;
}
