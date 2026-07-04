import type { Metadata } from 'next';
import { config } from '@fortawesome/fontawesome-svg-core';
import { Inter, Vazirmatn } from 'next/font/google';

import '@fortawesome/fontawesome-svg-core/styles.css';
import './globals.css';
import Providers from '@/components/Providers';
import Header from '@/components/Header';

config.autoAddCss = false;

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn', display: 'swap' });

export const metadata: Metadata = {
  title: 'UltimateGuide — Secure VPN setup guides',
  description: 'Step-by-step, multilingual VPN setup guides for Android, iOS, Windows and more.',
  metadataBase: new URL('https://example.github.io'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // `lang`/`dir` start as the LTR default and are updated client-side by
  // Providers when the user (or their browser) selects Russian or Farsi.
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} ${vazirmatn.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
