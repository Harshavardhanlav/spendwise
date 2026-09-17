import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `flat` drops the shadow — used when cards sit inside another surface. */
  tone?: 'raised' | 'flat' | 'sunken';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const tones = {
  raised: 'bg-surface border border-line-subtle shadow-xs',
  flat: 'bg-surface border border-line-subtle',
  sunken: 'bg-sunken border border-line-subtle'
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6'
};

export function Card({ tone = 'raised', padding = 'none', className, children, ...props }: CardProps) {
  return (
    <div {...props} className={cn('rounded-lg', tones[tone], paddings[padding], className)}>
      {children}
    </div>);

}

interface CardHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, description, action, className }: CardHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-line-subtle px-5 py-4',
        className
      )}>
      
      <div className="min-w-0">
        <h3 className="text-cardtitle text-ink-900">{title}</h3>
        {description && <p className="mt-0.5 text-caption text-ink-500">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>);

}

export function CardBody({
  className,
  children,
  padding = 'md'




}: {className?: string;children: React.ReactNode;padding?: keyof typeof paddings;}) {
  return <div className={cn(paddings[padding], className)}>{children}</div>;
}

export function CardFooter({ className, children }: {className?: string;children: React.ReactNode;}) {
  return (
    <div
      className={cn(
        'mt-auto flex items-center justify-between gap-3 border-t border-line-subtle px-5 py-3',
        className
      )}>
      
      {children}
    </div>);

}

/** Section heading used between cards, outside of any surface. */
export function SectionHeader({
  title,
  description,
  action,
  className
}: CardHeaderProps) {
  return (
    <div className={cn('mb-4 flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        <h2 className="text-section text-ink-900">{title}</h2>
        {description && <p className="mt-1 text-body text-ink-600">{description}</p>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>);

}