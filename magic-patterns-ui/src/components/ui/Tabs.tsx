import React from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (id: string) => void;
  /** `underline` for page-level sections, `segmented` for in-card filters. */
  variant?: 'underline' | 'segmented';
  className?: string;
}

export function Tabs({ items, value, onChange, variant = 'underline', className }: TabsProps) {
  if (variant === 'segmented') {
    return (
      <div
        role="tablist"
        className={cn('inline-flex items-center gap-0.5 rounded-md bg-ink-100 p-0.5', className)}>
        
        {items.map((item) => {
          const active = item.id === value;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              onClick={() => onChange(item.id)}
              className={cn(
                'rounded px-3 py-1.5 text-caption font-medium transition-colors duration-120 ease-out focus-visible:focus-ring',
                active ? 'bg-surface text-ink-900 shadow-xs' : 'text-ink-600 hover:text-ink-900'
              )}>
              
              {item.label}
            </button>);

        })}
      </div>);

  }

  return (
    <div role="tablist" className={cn('flex items-center gap-1 border-b border-line', className)}>
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cn(
              'relative -mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-body font-medium',
              'transition-colors duration-120 ease-out focus-visible:focus-ring',
              active ?
              'border-ink-900 text-ink-900' :
              'border-transparent text-ink-500 hover:border-line-strong hover:text-ink-900'
            )}>
            
            {item.label}
            {typeof item.count === 'number' &&
            <span
              className={cn(
                'tnum rounded px-1.5 py-0.5 text-[11px] font-medium',
                active ? 'bg-ink-100 text-ink-700' : 'bg-ink-100 text-ink-500'
              )}>
              
                {item.count}
              </span>
            }
          </button>);

      })}
    </div>);

}