import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

interface DropdownProps {
  trigger: React.ReactNode;
  align?: 'start' | 'end';
  width?: string;
  children: React.ReactNode | ((close: () => void) => React.ReactNode);
}

/** Menu surface with outside-click + Escape dismissal and focus return. */
export function Dropdown({ trigger, align = 'start', width = 'w-56', children }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-flex">
      <span onClick={() => setOpen((value) => !value)} className="contents">
        {React.isValidElement(trigger) ?
        React.cloneElement(trigger as React.ReactElement, {
          'aria-haspopup': 'menu',
          'aria-expanded': open
        }) :
        trigger}
      </span>

      {open &&
      <div
        role="menu"
        className={cn(
          'absolute top-[calc(100%+6px)] z-40 animate-pop-in rounded-lg border border-line bg-surface p-1 shadow-pop',
          width,
          align === 'end' ? 'right-0' : 'left-0'
        )}>
        
          {typeof children === 'function' ? children(() => setOpen(false)) : children}
        </div>
      }
    </div>);

}

interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  danger?: boolean;
  shortcut?: string;
}

export function MenuItem({ icon, danger, shortcut, className, children, ...props }: MenuItemProps) {
  return (
    <button
      role="menuitem"
      type="button"
      {...props}
      className={cn(
        'flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left text-body transition-colors duration-120 ease-out',
        'focus-visible:focus-ring-inset disabled:cursor-not-allowed disabled:text-ink-300',
        danger ? 'text-expense hover:bg-expense-bg' : 'text-ink-700 hover:bg-ink-100 hover:text-ink-900',
        className
      )}>
      
      {icon && <span className="shrink-0 text-ink-400">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
      {shortcut && <span className="text-caption text-ink-400">{shortcut}</span>}
    </button>);

}

export function MenuSeparator() {
  return <div role="separator" className="my-1 h-px bg-line-subtle" />;
}

export function MenuLabel({ children }: {children: React.ReactNode;}) {
  return <p className="px-2.5 py-1.5 text-overline uppercase text-ink-400">{children}</p>;
}