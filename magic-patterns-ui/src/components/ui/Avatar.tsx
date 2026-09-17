import React from 'react';
import { cn } from '../../utils/cn';
import { initials } from '../../utils/format';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-caption',
  md: 'h-9 w-9 text-body',
  lg: 'h-12 w-12 text-body-lg'
};

/**
 * Initials-first avatar. The tint is derived from the name so a user's
 * chip is stable across the app, but the palette stays inside our tokens.
 */
const tints = [
'bg-accent-50 text-accent-700',
'bg-income-bg text-income-strong',
'bg-warning-bg text-warning-strong',
'bg-info-bg text-info-strong',
'bg-ink-100 text-ink-700'];


export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  const tint = tints[name.charCodeAt(0) % tints.length];

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('shrink-0 rounded-full border border-line-subtle object-cover', sizes[size], className)} />);


  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold',
        sizes[size],
        tint,
        className
      )}>
      
      {initials(name)}
    </span>);

}

/** Category icon chip — the Category model stores an `icon` string. */
export function CategoryIcon({
  icon,
  tone = 'neutral',
  size = 'md',
  className





}: {icon: React.ReactNode;tone?: 'neutral' | 'income' | 'expense';size?: 'sm' | 'md';className?: string;}) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700',
    income: 'bg-income-bg text-income',
    expense: 'bg-ink-100 text-ink-700'
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md',
        size === 'sm' ? 'h-7 w-7' : 'h-9 w-9',
        tones[tone],
        className
      )}>
      
      {icon}
    </span>);

}