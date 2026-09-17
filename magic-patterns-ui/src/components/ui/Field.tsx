import React from 'react';
import { AlertCircleIcon, CheckIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

export type FieldState = 'default' | 'error' | 'success';

/* ---------------------------------------------------------------- shared */

export const fieldShell =
'w-full rounded-md border bg-surface text-body text-ink-900 placeholder:text-ink-400 ' +
'transition-[border-color,box-shadow] duration-120 ease-out ' +
'disabled:bg-ink-50 disabled:text-ink-400 disabled:cursor-not-allowed disabled:border-line-subtle ' +
'read-only:bg-sunken';

export const fieldStates: Record<FieldState, string> = {
  default: 'border-line hover:border-line-strong focus:border-accent-500 focus:ring-2 focus:ring-accent-100',
  error: 'border-expense hover:border-expense focus:border-expense focus:ring-2 focus:ring-expense-bg',
  success: 'border-income hover:border-income focus:border-income focus:ring-2 focus:ring-income-bg'
};

export const fieldSizes = {
  sm: 'h-8 px-2.5 text-caption',
  md: 'h-9 px-3',
  lg: 'h-11 px-3.5'
};

/* ---------------------------------------------------------------- pieces */

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
}

export function FieldLabel({ required, optional, children, className, ...props }: LabelProps) {
  return (
    <label {...props} className={cn('flex items-center gap-1.5 text-label text-ink-700', className)}>
      {children}
      {required &&
      <span className="text-expense" aria-hidden="true">
          *
        </span>
      }
      {optional && <span className="text-caption font-normal text-ink-400">Optional</span>}
    </label>);

}

export function FieldHint({ children }: {children: React.ReactNode;}) {
  return <p className="text-caption text-ink-500">{children}</p>;
}

/** Errors are announced, icon-marked and coloured — never colour alone. */
export function FieldError({ children, id }: {children: React.ReactNode;id?: string;}) {
  return (
    <p id={id} role="alert" className="flex items-start gap-1.5 text-caption text-expense">
      <AlertCircleIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>);

}

export function FieldSuccess({ children }: {children: React.ReactNode;}) {
  return (
    <p className="flex items-start gap-1.5 text-caption text-income">
      <CheckIcon className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>);

}

interface FieldProps {
  label?: string;
  hint?: string;
  error?: string;
  success?: string;
  required?: boolean;
  optional?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

/** Wraps any control with its label, hint and validation message. */
export function Field({
  label,
  hint,
  error,
  success,
  required,
  optional,
  htmlFor,
  className,
  children
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label &&
      <FieldLabel htmlFor={htmlFor} required={required} optional={optional}>
          {label}
        </FieldLabel>
      }
      {children}
      {error ?
      <FieldError id={htmlFor ? `${htmlFor}-error` : undefined}>{error}</FieldError> :
      success ?
      <FieldSuccess>{success}</FieldSuccess> :
      hint ?
      <FieldHint>{hint}</FieldHint> :
      null}
    </div>);

}