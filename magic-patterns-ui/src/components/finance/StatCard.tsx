import React from 'react';
import { cn } from '../../utils/cn';
import { AmountText, DeltaText } from './AmountText';

interface StatCardProps {
  label: string;
  value: number;
  type?: 'income' | 'expense' | 'net';
  /** `count` renders a plain tabular integer instead of a currency amount. */
  unit?: 'currency' | 'count';
  delta?: number;
  deltaLabel?: string;
  icon?: React.ReactNode;
  /** `primary` is the one metric the screen exists to answer. Use once. */
  emphasis?: 'primary' | 'default';
  footer?: React.ReactNode;
  loading?: boolean;
  currency?: string;
}

/**
 * Stat cards are deliberately NOT all equal weight. One card per screen is
 * `primary` (larger amount, inverse surface); the rest support it. A row of
 * identically-chromed tiles is a filing cabinet, not a hierarchy.
 */
export function StatCard({
  label,
  value,
  type = 'net',
  unit = 'currency',
  delta,
  deltaLabel = 'vs last month',
  icon,
  emphasis = 'default',
  footer,
  loading,
  currency = 'INR'
}: StatCardProps) {
  const primary = emphasis === 'primary';

  if (loading) {
    return (
      <div className="rounded-lg border border-line-subtle bg-surface p-5 shadow-xs">
        <div className="h-3 w-24 animate-pulse rounded bg-ink-100" />
        <div className="mt-3.5 h-8 w-36 animate-pulse rounded bg-ink-100" />
        <div className="mt-3 h-3 w-28 animate-pulse rounded bg-ink-100" />
      </div>);

  }

  return (
    <div
      className={cn(
        'flex flex-col rounded-lg p-5',
        primary ?
        'bg-ink-900 text-white' :
        'border border-line-subtle bg-surface shadow-xs'
      )}>
      
      <div className="flex items-start justify-between gap-3">
        <p className={cn('text-label', primary ? 'text-white/70' : 'text-ink-600')}>{label}</p>
        {icon &&
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-md',
            primary ? 'bg-white/10 text-white/80' : 'bg-ink-50 text-ink-500'
          )}>
          
            {icon}
          </span>
        }
      </div>

      <div className="mt-2.5">
        {primary ?
        <p className="tnum text-amount-xl text-white">
            {unit === 'count' ?
          new Intl.NumberFormat('en-IN').format(value) :
          new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            maximumFractionDigits: 0
          }).format(value)}
          </p> :
        unit === 'count' ?
        <p className="tnum text-amount-lg text-ink-900">{new Intl.NumberFormat('en-IN').format(value)}</p> :

        <AmountText value={value} type={type} size="lg" />
        }
      </div>

      {(delta !== undefined || footer) &&
      <div className={cn('mt-3 flex items-center gap-2', primary && 'text-white/70')}>
          {delta !== undefined && !primary &&
        <DeltaText value={delta} invert={type === 'expense'} label={deltaLabel} />
        }
          {delta !== undefined && primary &&
        <span className="tnum text-caption text-white/75">
              {delta > 0 ? '↑' : '↓'} {Math.abs(delta).toFixed(1)}% {deltaLabel}
            </span>
        }
          {footer}
        </div>
      }
    </div>);

}