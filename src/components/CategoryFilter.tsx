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
