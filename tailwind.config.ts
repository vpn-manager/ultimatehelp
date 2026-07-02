import type { Config } from 'tailwindcss';

/**
 * UltimateGuide "Secure Guide System" design tokens.
 *
 * These values are the single source of truth for the brand and are kept in
 * sync with the high-fidelity Stitch designs. When the Stitch MCP server writes
 * updated tokens, they land here.
 */
const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)', // Deep Blue
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        // Accents
        success: 'rgb(var(--color-success) / <alpha-value>)', // Success Green
        warning: 'rgb(var(--color-warning) / <alpha-value>)', // Warning Rose
        // Surfaces
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)', // Background
          low: 'rgb(var(--color-surface-low) / <alpha-value>)', // Container-Low
          dim: 'rgb(var(--color-surface-dim) / <alpha-value>)', // Surface-Dim
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        // Cards, buttons, inputs all use 8px per the design system.
        DEFAULT: '0.5rem',
        lg: '0.5rem',
        xl: '0.75rem',
      },
      minHeight: {
        touch: '44px', // Minimum touch target
      },
      minWidth: {
        touch: '44px',
      },
      typography: () => ({
        ultimateguide: {
          css: {
            '--tw-prose-body': '#334155',
            '--tw-prose-headings': '#1a365d',
            '--tw-prose-links': '#1a365d',
            '--tw-prose-bold': '#1a365d',
            '--tw-prose-counters': '#1a365d',
            '--tw-prose-bullets': '#ccdbf4',
            '--tw-prose-hr': '#ccdbf4',
            '--tw-prose-quotes': '#1a365d',
            '--tw-prose-code': '#1a365d',
            '--tw-prose-pre-bg': '#13294a',
            'h2, h3, h4': { scrollMarginTop: '6rem' },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
