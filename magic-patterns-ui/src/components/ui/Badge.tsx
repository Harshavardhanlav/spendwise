import React from 'react';
import { cn } from '../../utils/cn';

export type BadgeTone = 'neutral' | 'accent' | 'income' | 'expense' | 'warning' | 'info';

interface BadgeProps {
  tone?: BadgeTone;
  /** `solid` reserved for counts and statuses that must win attention. */
  variant?: 'soft' | 'outline' | 'solid';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  /** Small colour dot — carries meaning without relying on hue alone. */
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const soft: Record<BadgeTone, string> = {
  neutral: 'bg-ink-100 text-ink-700',
  accent: 'bg-accent-50 text-accent-700',
  income: 'bg-income-bg text-income-strong',
  expense: 'bg-expense-bg text-expense-strong',
  warning: 'bg-warning-bg text-warning-strong',
  info: 'bg-info-bg text-info-strong'
};

const outline: Record<BadgeTone, string> = {
  neutral: 'border border-line text-ink-700 bg-surface',
  accent: 'border border-accent-200 text-accent-700 bg-surface',
  income: 'border border-income-border text-income-strong bg-surface',
  expense: 'border border-expense-border text-expense-strong bg-surface',
  warning: 'border border-warning-border text-warning-strong bg-surface',
  info: 'border border-info-border text-info-strong bg-surface'
};

const solid: Record<BadgeTone, string> = {
  neutral: 'bg-ink-900 text-white',
  accent: 'bg-accent-500 text-white',
  income: 'bg-income text-white',
  expense: 'bg-expense text-white',
  warning: 'bg-warning text-white',
  info: 'bg-info text-white'
};

const dotColor: Record<BadgeTone, string> = {
  neutral: 'bg-ink-400',
  accent: 'bg-accent-500',
  income: 'bg-income',
  expense: 'bg-expense',
  warning: 'bg-warning',
  info: 'bg-info'
};

export function Badge({
  tone = 'neutral',
  variant = 'soft',
  size = 'md',
  icon,
  dot,
  className,
  children
}: BadgeProps) {
  const palette = variant === 'solid' ? solid : variant === 'outline' ? outline : soft;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-medium whitespace-nowrap',
        size === 'sm' ? 'h-5 px-1.5 text-[11px]' : 'h-6 px-2 text-caption',
        palette[tone],
        className
      )}>
      
      {dot &&
      <span
        className={cn('h-1.5 w-1.5 shrink-0 rounded-full', variant === 'solid' ? 'bg-white/80' : dotColor[tone])}
        aria-hidden="true" />

      }
      {icon}
      {children}
    </span>);

}