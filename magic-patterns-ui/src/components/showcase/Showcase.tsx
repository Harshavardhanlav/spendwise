import React from 'react';
import { cn } from '../../utils/cn';

/** Layout helpers used only by the design-system documentation screen. */

export function DocSection({
  id,
  title,
  description,
  children





}: {id?: string;title: string;description?: string;children: React.ReactNode;}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-5 max-w-2xl">
        <h2 className="text-section text-ink-900">{title}</h2>
        {description && <p className="mt-1.5 text-body text-ink-600">{description}</p>}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>);

}

export function DocBlock({
  title,
  note,
  children,
  className,
  bare = false






}: {title: string;note?: string;children: React.ReactNode;className?: string;bare?: boolean;}) {
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-cardtitle text-ink-900">{title}</h3>
        {note && <p className="text-caption text-ink-500">{note}</p>}
      </div>
      <div
        className={cn(
          bare ? '' : 'rounded-lg border border-line-subtle bg-surface p-5 shadow-xs',
          className
        )}>
        
        {children}
      </div>
    </div>);

}

export function Row({ label, children }: {label?: string;children: React.ReactNode;}) {
  return (
    <div className="flex flex-col gap-2 border-b border-line-subtle py-4 first:pt-0 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-6">
      {label && <p className="w-40 shrink-0 text-label text-ink-500">{label}</p>}
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>);

}

export function Token({ name, value }: {name: string;value: string;}) {
  return (
    <span className="inline-flex items-center gap-2 rounded border border-line-subtle bg-sunken px-2 py-1 font-mono text-[11px] text-ink-600">
      <span className="text-ink-900">{name}</span>
      <span className="text-ink-400">{value}</span>
    </span>);

}