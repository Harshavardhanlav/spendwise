import React from 'react';
import { cn } from '../../utils/cn';
import { fieldShell, fieldSizes, fieldStates, type FieldState } from './Field';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  state?: FieldState;
  size?: keyof typeof fieldSizes;
  iconLeft?: React.ReactNode;
  suffix?: React.ReactNode;
}

export function Input({
  state = 'default',
  size = 'md',
  iconLeft,
  suffix,
  className,
  ...props
}: InputProps) {
  const control =
  <input
    {...props}
    aria-invalid={state === 'error' || undefined}
    className={cn(
      fieldShell,
      fieldStates[state],
      fieldSizes[size],
      'outline-none',
      iconLeft && 'pl-9',
      suffix && 'pr-12',
      className
    )} />;



  if (!iconLeft && !suffix) return control;

  return (
    <div className="relative">
      {iconLeft &&
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
          {iconLeft}
        </span>
      }
      {control}
      {suffix &&
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-caption text-ink-400">
          {suffix}
        </span>
      }
    </div>);

}

/** Money input — ₹ prefix, tabular figures, right-aligned like a ledger. */
export function AmountInput({
  state = 'default',
  size = 'md',
  currencySymbol = '₹',
  className,
  ...props
}: InputProps & {currencySymbol?: string;}) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-body text-ink-500">
        {currencySymbol}
      </span>
      <input
        inputMode="decimal"
        {...props}
        aria-invalid={state === 'error' || undefined}
        className={cn(
          fieldShell,
          fieldStates[state],
          fieldSizes[size],
          'tnum pl-7 text-right font-medium outline-none',
          className
        )} />
      
    </div>);

}

export function Textarea({
  state = 'default',
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {state?: FieldState;}) {
  return (
    <textarea
      {...props}
      aria-invalid={state === 'error' || undefined}
      className={cn(fieldShell, fieldStates[state], 'min-h-[80px] px-3 py-2 outline-none', className)} />);


}