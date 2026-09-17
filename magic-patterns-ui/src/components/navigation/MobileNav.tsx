import React from 'react';
import { MoreHorizontalIcon, PlusIcon, WalletMinimalIcon, XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { primaryNav, secondaryNav } from '../../data/navigation';

/**
 * Mobile is NOT the desktop sidebar shrunk down.
 *
 * - The four primary destinations become a thumb-reachable bottom tab bar.
 * - "Add transaction" is promoted to the centre, because logging a spend
 *   is the single most frequent action on a phone.
 * - Account-level items move behind "More" instead of eating a tab.
 */
export function MobileTabBar({
  activeId,
  onNavigate,
  onAdd,
  onMore,
  /** `true` renders in flow instead of fixed — used by documentation previews. */
  inline = false






}: {activeId: string;onNavigate?: (id: string) => void;onAdd?: () => void;onMore?: () => void;inline?: boolean;}) {
  const tabs = primaryNav.slice(0, 2);
  const trailing = primaryNav.slice(2, 4);

  const renderTab = (item: (typeof primaryNav)[number]) => {
    const Icon = item.icon;
    const active = item.id === activeId;
    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onNavigate?.(item.id)}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'flex min-w-0 flex-1 flex-col items-center gap-1 py-2 transition-colors duration-120 ease-out focus-visible:focus-ring',
          active ? 'text-ink-900' : 'text-ink-400'
        )}>
        
        <Icon className="h-5 w-5" aria-hidden="true" />
        <span className={cn('truncate text-[11px]', active && 'font-medium')}>{item.label}</span>
      </button>);

  };

  return (
    <nav
      aria-label="Primary"
      className={cn(
        'flex items-stretch border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]',
        inline ? 'relative w-full' : 'fixed inset-x-0 bottom-0 z-40 lg:hidden'
      )}>
      
      {tabs.map(renderTab)}

      <div className="flex w-16 shrink-0 items-center justify-center">
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add transaction"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-900 text-white shadow-sm transition-transform duration-120 ease-out active:scale-95 focus-visible:focus-ring">
          
          <PlusIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {trailing.map(renderTab)}

      <button
        type="button"
        onClick={onMore}
        className="flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-ink-400 transition-colors duration-120 ease-out focus-visible:focus-ring">
        
        <MoreHorizontalIcon className="h-5 w-5" aria-hidden="true" />
        <span className="truncate text-[11px]">More</span>
      </button>
    </nav>);

}

/** Slide-over used for tablet / small-laptop widths where the rail is hidden. */
export function MobileNavDrawer({
  open,
  activeId,
  onClose,
  onNavigate





}: {open: boolean;activeId: string;onClose: () => void;onNavigate?: (id: string) => void;}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="absolute inset-0 animate-fade-in bg-overlay" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation"
        className="relative flex h-full w-72 animate-fade-in flex-col bg-ink-900">
        
        <div className="flex h-15 items-center justify-between px-5">
          <span className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-ink-900">
              <WalletMinimalIcon className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <span className="text-cardtitle text-white">SpendWise</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-8 w-8 items-center justify-center rounded-md text-white/60 transition-colors duration-120 ease-out hover:bg-white/10 hover:text-white focus-visible:focus-ring">
            
            <XIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-2">
          {[...primaryNav, ...secondaryNav].map((item) => {
            const Icon = item.icon;
            const active = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate?.(item.id);
                  onClose();
                }}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-body font-medium transition-colors duration-120 ease-out focus-visible:focus-ring',
                  active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
                )}>
                
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                {item.label}
              </button>);

          })}
        </nav>
      </div>
    </div>);

}