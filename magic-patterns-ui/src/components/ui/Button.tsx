import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

const base =
'relative inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap ' +
'transition-[background-color,border-color,color,box-shadow] duration-120 ease-out ' +
'focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-50 select-none';

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-900 shadow-xs disabled:bg-ink-300 disabled:opacity-100',
  secondary:
  'bg-surface text-ink-900 border border-line hover:bg-ink-50 hover:border-line-strong active:bg-ink-100 shadow-xs',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 hover:text-ink-900 active:bg-ink-200',
  danger: 'bg-expense text-white hover:bg-expense-strong active:bg-expense-strong shadow-xs',
  link: 'bg-transparent text-accent-500 hover:text-accent-700 hover:underline underline-offset-4 px-0'
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-caption',
  md: 'h-9 px-3.5 text-button',
  lg: 'h-11 px-5 text-button'
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  iconLeft,
  iconRight,
  fullWidth,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        variant === 'link' && 'h-auto p-0',
        fullWidth && 'w-full',
        className
      )}>
      
      {loading &&
      <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" />
      }
      {!loading && iconLeft}
      {children}
      {!loading && iconRight}
    </button>);

}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: Extract<ButtonVariant, 'secondary' | 'ghost' | 'danger'>;
  size?: 'sm' | 'md';
  children: React.ReactNode;
}

export function IconButton({
  label,
  variant = 'ghost',
  size = 'md',
  className,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={label}
      title={label}
      className={cn(
        base,
        variants[variant],
        size === 'sm' ? 'h-8 w-8' : 'h-9 w-9',
        'px-0',
        className
      )}>
      
      {children}
    </button>);

}