import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  totalItems?: number;
  pageSize?: number;
  onChange: (page: number) => void;
}

function pageRange(page: number, pageCount: number): (number | 'gap')[] {
  if (pageCount <= 7) return Array.from({ length: pageCount }, (_, i) => i + 1);
  if (page <= 4) return [1, 2, 3, 4, 5, 'gap', pageCount];
  if (page >= pageCount - 3) return [1, 'gap', pageCount - 4, pageCount - 3, pageCount - 2, pageCount - 1, pageCount];
  return [1, 'gap', page - 1, page, page + 1, 'gap', pageCount];
}

export function Pagination({ page, pageCount, totalItems, pageSize = 25, onChange }: PaginationProps) {
  const from = (page - 1) * pageSize + 1;
  const to = totalItems ? Math.min(page * pageSize, totalItems) : page * pageSize;

  const stepClass =
  'inline-flex h-8 items-center gap-1 rounded-md border border-line bg-surface px-2.5 text-caption font-medium text-ink-700 ' +
  'transition-colors duration-120 ease-out hover:bg-ink-50 focus-visible:focus-ring ' +
  'disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-surface';

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col-reverse items-center justify-between gap-3 px-5 py-3 sm:flex-row">
      
      {totalItems !== undefined &&
      <p className="text-caption text-ink-500">
          <span className="tnum font-medium text-ink-700">
            {from}–{to}
          </span>{' '}
          of <span className="tnum font-medium text-ink-700">{totalItems}</span> transactions
        </p>
      }

      <div className="flex items-center gap-1">
        <button type="button" className={stepClass} disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeftIcon className="h-3.5 w-3.5" aria-hidden="true" />
          Prev
        </button>

        <div className="hidden items-center gap-1 xs:flex">
          {pageRange(page, pageCount).map((item, index) =>
          item === 'gap' ?
          <span key={`gap-${index}`} className="px-1 text-caption text-ink-400">
                …
              </span> :

          <button
            key={item}
            type="button"
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
            className={cn(
              'tnum inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-caption font-medium',
              'transition-colors duration-120 ease-out focus-visible:focus-ring',
              item === page ?
              'bg-ink-900 text-white' :
              'border border-line bg-surface text-ink-700 hover:bg-ink-50'
            )}>
            
                {item}
              </button>

          )}
        </div>

        <button
          type="button"
          className={stepClass}
          disabled={page === pageCount}
          onClick={() => onChange(page + 1)}>
          
          Next
          <ChevronRightIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </nav>);

}