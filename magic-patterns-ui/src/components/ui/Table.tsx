import React from 'react';
import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Ledger table. Rules:
 * - Header row is sunken, uppercase-micro, sticky-ready.
 * - Row separators are hairlines only; no zebra striping (it fights the
 *   income/expense colour language).
 * - Numeric columns are right-aligned and tabular.
 */

export function Table({ className, children, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto scrollbar-slim">
      <table {...props} className={cn('w-full border-collapse text-body', className)}>
        {children}
      </table>
    </div>);

}

export function THead({ children }: {children: React.ReactNode;}) {
  return <thead className="bg-sunken">{children}</thead>;
}

export function TBody({ children }: {children: React.ReactNode;}) {
  return <tbody className="divide-y divide-line-subtle">{children}</tbody>;
}

type SortDirection = 'asc' | 'desc' | null;

interface THProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
}

export function TH({
  align = 'left',
  sortable,
  sortDirection = null,
  onSort,
  className,
  children,
  ...props
}: THProps) {
  const content = sortable ?
  <button
    type="button"
    onClick={onSort}
    className={cn(
      'group inline-flex items-center gap-1 rounded text-overline uppercase text-ink-500 transition-colors duration-120 ease-out hover:text-ink-900 focus-visible:focus-ring',
      align === 'right' && 'flex-row-reverse'
    )}>
    
      {children}
      {sortDirection === 'asc' ?
    <ArrowUpIcon className="h-3 w-3 text-ink-900" aria-hidden="true" /> :
    sortDirection === 'desc' ?
    <ArrowDownIcon className="h-3 w-3 text-ink-900" aria-hidden="true" /> :

    <ChevronsUpDownIcon
      className="h-3 w-3 text-ink-300 transition-colors duration-120 ease-out group-hover:text-ink-500"
      aria-hidden="true" />

    }
    </button> :

  children;


  return (
    <th
      scope="col"
      aria-sort={sortDirection === 'asc' ? 'ascending' : sortDirection === 'desc' ? 'descending' : undefined}
      {...props}
      className={cn(
        'border-b border-line px-4 py-2.5 text-overline uppercase text-ink-500',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left',
        className
      )}>
      
      {content}
    </th>);

}

interface TRProps extends React.HTMLAttributes<HTMLTableRowElement> {
  interactive?: boolean;
  selected?: boolean;
}

export function TR({ interactive, selected, className, children, ...props }: TRProps) {
  return (
    <tr
      {...props}
      aria-selected={selected || undefined}
      tabIndex={interactive ? 0 : undefined}
      className={cn(
        'bg-surface transition-colors duration-120 ease-out',
        interactive && 'cursor-pointer hover:bg-ink-50 focus-visible:focus-ring-inset',
        selected && 'bg-accent-50 hover:bg-accent-50',
        className
      )}>
      
      {children}
    </tr>);

}

interface TDProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: 'left' | 'right' | 'center';
  numeric?: boolean;
  muted?: boolean;
}

export function TD({ align = 'left', numeric, muted, className, children, ...props }: TDProps) {
  return (
    <td
      {...props}
      className={cn(
        'px-4 py-3 align-middle',
        align === 'right' && 'text-right',
        align === 'center' && 'text-center',
        numeric && 'tnum text-amount-sm',
        muted ? 'text-ink-600' : 'text-ink-900',
        className
      )}>
      
      {children}
    </td>);

}