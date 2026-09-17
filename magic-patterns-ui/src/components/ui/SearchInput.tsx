import React from 'react';
import { SearchIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { fieldShell, fieldSizes, fieldStates } from './Field';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type'> {
  size?: keyof typeof fieldSizes;
  onClear?: () => void;
  shortcutHint?: string;
}

export function SearchInput({
  size = 'md',
  onClear,
  shortcutHint,
  className,
  value,
  ...props
}: SearchInputProps) {
  const hasValue = typeof value === 'string' && value.length > 0;

  return (
    <div className="relative">
      <SearchIcon
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
        aria-hidden="true" />
      
      <input
        type="search"
        value={value}
        {...props}
        className={cn(
          fieldShell,
          fieldStates.default,
          fieldSizes[size],
          'pl-9 pr-9 outline-none [&::-webkit-search-cancel-button]:hidden',
          className
        )} />
      
      {hasValue ?
      <button
        type="button"
        onClick={onClear}
        aria-label="Clear search"
        className="absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded text-ink-400 transition-colors duration-120 ease-out hover:bg-ink-100 hover:text-ink-700 focus-visible:focus-ring">
        
          <XIcon className="h-3.5 w-3.5" aria-hidden="true" />
        </button> :
      shortcutHint ?
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-sunken px-1.5 py-0.5 text-[11px] font-medium text-ink-400">
          {shortcutHint}
        </kbd> :
      null}
    </div>);

}