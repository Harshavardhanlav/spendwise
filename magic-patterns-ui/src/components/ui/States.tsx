import React from 'react';
import { Loader2Icon, RefreshCwIcon, TriangleAlertIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Button } from './Button';

/* ------------------------------------------------------------- loading */

export function Spinner({ size = 'md', className }: {size?: 'sm' | 'md' | 'lg';className?: string;}) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-5 w-5', lg: 'h-7 w-7' };
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('animate-spin text-ink-400', sizes[size], className)} />);


}

/**
 * Skeletons mirror the shape of the content they replace — a skeleton that
 * doesn't match the final layout causes a jump and is worse than nothing.
 */
export function Skeleton({ className }: {className?: string;}) {
  return (
    <div
      aria-hidden="true"
      className={cn('rounded bg-ink-100 motion-safe:animate-pulse', className)} />);


}

export function SkeletonText({ lines = 3, className }: {lines?: number;className?: string;}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) =>
      <Skeleton key={index} className={cn('h-3', index === lines - 1 ? 'w-2/3' : 'w-full')} />
      )}
    </div>);

}

export function SkeletonStatCard() {
  return (
    <div className="rounded-lg border border-line-subtle bg-surface p-5 shadow-xs">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-3.5 h-8 w-36" />
      <Skeleton className="mt-3 h-3 w-28" />
    </div>);

}

export function SkeletonTableRows({ rows = 5, columns = 5 }: {rows?: number;columns?: number;}) {
  return (
    <div className="divide-y divide-line-subtle">
      {Array.from({ length: rows }).map((_, rowIndex) =>
      <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: columns }).map((_, colIndex) =>
        <Skeleton
          key={colIndex}
          className={cn('h-3.5', colIndex === 0 ? 'w-1/3' : colIndex === columns - 1 ? 'ml-auto w-16' : 'w-1/6')} />

        )}
        </div>
      )}
    </div>);

}

/* --------------------------------------------------------------- empty */

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  /** Say what this screen will show once it has data, not just "No data". */
  description: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  size?: 'sm' | 'md';
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  size = 'md'
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'sm' ? 'px-6 py-10' : 'px-6 py-14'
      )}>
      
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-line bg-sunken text-ink-400">
        {icon}
      </span>
      <h3 className="mt-4 text-cardtitle text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-body text-ink-600">{description}</p>
      {(action || secondaryAction) &&
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      }
    </div>);

}

/* --------------------------------------------------------------- error */

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  size?: 'sm' | 'md';
}

export function ErrorState({
  title = 'Couldn’t load this',
  message = 'Something went wrong while fetching your data. Check your connection and try again.',
  onRetry,
  size = 'md'
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'sm' ? 'px-6 py-10' : 'px-6 py-14'
      )}>
      
      <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-expense-border bg-expense-bg text-expense">
        <TriangleAlertIcon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 text-cardtitle text-ink-900">{title}</h3>
      <p className="mt-1.5 max-w-sm text-body text-ink-600">{message}</p>
      {onRetry &&
      <Button variant="secondary" className="mt-5" onClick={onRetry} iconLeft={<RefreshCwIcon className="h-3.5 w-3.5" />}>
          Try again
        </Button>
      }
    </div>);

}

/** Inline banner for non-blocking errors, e.g. a failed background refresh. */
export function InlineAlert({
  tone = 'error',
  title,
  children,
  action





}: {tone?: 'error' | 'warning' | 'info' | 'success';title: string;children?: React.ReactNode;action?: React.ReactNode;}) {
  const tones = {
    error: 'border-expense-border bg-expense-bg text-expense-strong',
    warning: 'border-warning-border bg-warning-bg text-warning-strong',
    info: 'border-info-border bg-info-bg text-info-strong',
    success: 'border-income-border bg-income-bg text-income-strong'
  };

  return (
    <div role="status" className={cn('flex items-start gap-3 rounded-md border px-3.5 py-3', tones[tone])}>
      <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium">{title}</p>
        {children && <div className="mt-0.5 text-caption opacity-90">{children}</div>}
      </div>
      {action}
    </div>);

}