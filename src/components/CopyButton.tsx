'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface CopyButtonProps {
  value: string;
  /** Optional label override; defaults to the i18n "Copy config link" string. */
  label?: string;
  className?: string;
}

type Status = 'idle' | 'copied' | 'failed';

/** Copies `value` to the clipboard via the Web Clipboard API with fallback. */
export default function CopyButton({ value, label, className = '' }: CopyButtonProps) {
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>('idle');

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else {
        // Legacy fallback for non-secure contexts.
        const el = document.createElement('textarea');
        el.value = value;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    setTimeout(() => setStatus('idle'), 2000);
  }

  const text =
    status === 'copied' ? t('copy.copied') : status === 'failed' ? t('copy.failed') : label ?? t('copy.idle');

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      data-status={status}
      className={`tap-target gap-2 rounded bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60 ${className}`}
    >
      <CopyIcon copied={status === 'copied'} />
      <span>{text}</span>
    </button>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return copied ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
