import React from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { fieldShell, fieldSizes, fieldStates, type FieldState } from './Field';

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  state?: FieldState;
  size?: keyof typeof fieldSizes;
  options: {value: string;label: string;}[];
  placeholder?: string;
}

/**
 * Native select, styled. Native is deliberate: it gives correct keyboard and
 * mobile behaviour for free, which matters more than a custom listbox here.
 */
export function Select({
  state = 'default',
  size = 'md',
  options,
  placeholder,
  className,
  ...props
}: SelectProps) {
  return (
    <div className="relative">
      <select
        {...props}
        aria-invalid={state === 'error' || undefined}
        className={cn(
          fieldShell,
          fieldStates[state],
          fieldSizes[size],
          'cursor-pointer appearance-none pr-9 outline-none',
          !props.value && placeholder && 'text-ink-400',
          className
        )}>
        
        {placeholder &&
        <option value="" disabled>
            {placeholder}
          </option>
        }
        {options.map((option) =>
        <option key={option.value} value={option.value} className="text-ink-900">
            {option.label}
          </option>
        )}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden="true" />
      
    </div>);

}