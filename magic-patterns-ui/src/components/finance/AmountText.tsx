import React from 'react';
import { ArrowDownRightIcon, ArrowUpRightIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/format';
import type { TransactionType } from '../../types/finance';

interface AmountTextProps {
  value: number;
  type?: TransactionType | 'net';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Show the +/− sign. Signs carry the meaning when colour can't. */
  signed?: boolean;
  showIcon?: boolean;
  decimals?: boolean;
  currency?: string;
  className?: string;
}

const sizes = {
  sm: 'text-amount-sm',
  md: 'text-amount-md',
  lg: 'text-amount-lg',
  xl: 'text-amount-xl'
};

/**
 * The single source of truth for rendering money.
 *
 * Income and expense are separated by THREE signals, never colour alone:
 * hue, an explicit +/− sign, and a directional arrow. That keeps the
 * distinction readable for colour-blind users and in greyscale print.
 */
export function AmountText({
  value,
  type = 'net',
  size = 'md',
  signed = false,
  showIcon = false,
  decimals = false,
  currency = 'INR',
  className
}: AmountTextProps) {
  const tone =
  type === 'income' ?
  'text-income' :
  type === 'expense' ?
  'text-expense' :
  value < 0 ?
  'text-expense' :
  'text-ink-900';

  const displayValue = type === 'expense' ? -Math.abs(value) : value;
  const Icon = type === 'income' ? ArrowUpRightIcon : ArrowDownRightIcon;
  const iconSize = size === 'xl' ? 'h-5 w-5' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5';

  return (
    <span className={cn('tnum inline-flex items-center gap-1', sizes[size], tone, className)}>
      {showIcon && type !== 'net' && <Icon className={cn('shrink-0', iconSize)} aria-hidden="true" />}
      {formatCurrency(displayValue, currency, { decimals, sign: signed })}
    </span>);

}

/** Period-over-period change chip used on stat cards. */
export function DeltaText({
  value,
  /** For expenses, an increase is bad — flip the colour meaning. */
  invert = false,
  label




}: {value: number;invert?: boolean;label?: string;}) {
  const positive = value > 0;
  const good = invert ? !positive : positive;
  const Icon = positive ? ArrowUpRightIcon : ArrowDownRightIcon;

  return (
    <span className="inline-flex items-center gap-1 text-caption">
      <span
        className={cn(
          'tnum inline-flex items-center gap-0.5 font-medium',
          value === 0 ? 'text-ink-500' : good ? 'text-income' : 'text-expense'
        )}>
        
        <Icon className="h-3 w-3" aria-hidden="true" />
        {Math.abs(value).toFixed(1)}%
      </span>
      {label && <span className="text-ink-500">{label}</span>}
    </span>);

}