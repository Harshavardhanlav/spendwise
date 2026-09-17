import React from 'react';
import { CalendarIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { fieldShell, fieldSizes, fieldStates, type FieldState } from './Field';

interface DateFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  state?: FieldState;
  size?: keyof typeof fieldSizes;
}

/**
 * Native date input with the UA indicator hidden and our own icon shown.
 * Native keeps the mobile date wheel and full keyboard entry intact.
 */
export function DateField({ state = 'default', size = 'md', className, ...props }: DateFieldProps) {
  return (
    <div className="relative">
      <input
        type="date"
        {...props}
        aria-invalid={state === 'error' || undefined}
        className={cn(
          fieldShell,
          fieldStates[state],
          fieldSizes[size],
          'tnum cursor-pointer pr-9 outline-none',
          '[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0',
          '[&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-9',
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0',
          className
        )} />
      
      <CalendarIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden="true" />
      
    </div>);

}

interface DateRangeFieldProps {
  from: string;
  to: string;
  onFromChange?: (value: string) => void;
  onToChange?: (value: string) => void;
  disabled?: boolean;
}

/** Paired range control used by Transactions and Reports filtering. */
export function DateRangeField({
  from,
  to,
  onFromChange,
  onToChange,
  disabled
}: DateRangeFieldProps) {
  return (
    <div className="flex items-center gap-2">
      <DateField
        value={from}
        disabled={disabled}
        aria-label="From date"
        onChange={(e) => onFromChange?.(e.target.value)} />
      
      <span className="text-caption text-ink-400" aria-hidden="true">
        to
      </span>
      <DateField
        value={to}
        disabled={disabled}
        aria-label="To date"
        onChange={(e) => onToChange?.(e.target.value)} />
      
    </div>);

}