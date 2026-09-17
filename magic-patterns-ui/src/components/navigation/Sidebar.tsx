import React from 'react';
import { WalletMinimalIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { primaryNav, secondaryNav, type NavItem } from '../../data/navigation';

interface SidebarProps {
  activeId: string;
  onNavigate?: (id: string) => void;
  className?: string;
}

function NavLink({
  item,
  active,
  onClick




}: {item: NavItem;active: boolean;onClick?: () => void;}) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group flex w-full items-center gap-3 rounded-md px-3 py-2 text-body font-medium',
        'transition-colors duration-120 ease-out focus-visible:focus-ring',
        active ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/[0.06] hover:text-white'
      )}>
      
      <Icon className={cn('h-4.5 w-4.5 shrink-0', active ? 'text-white' : 'text-white/50 group-hover:text-white/80')} />
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge &&
      <span
        className={cn(
          'tnum rounded px-1.5 py-0.5 text-[11px] font-medium',
          active ? 'bg-white/15 text-white' : 'bg-white/[0.08] text-white/50'
        )}>
        
          {item.badge}
        </span>
      }
    </button>);

}

/**
 * Desktop sidebar. Dark ink surface so the content canvas stays the
 * brightest thing on screen — the data is the product, the chrome isn't.
 */
export function Sidebar({ activeId, onNavigate, className }: SidebarProps) {
  return (
    <aside
      className={cn('flex h-full w-68 shrink-0 flex-col bg-ink-900 text-white', className)}
      aria-label="Main navigation">
      
      <div className="flex h-15 items-center gap-2.5 px-5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-ink-900">
          <WalletMinimalIcon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <span className="text-cardtitle tracking-tight text-white">SpendWise</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-3">
        {primaryNav.map((item) =>
        <NavLink
          key={item.id}
          item={item}
          active={item.id === activeId}
          onClick={() => onNavigate?.(item.id)} />

        )}

        <div className="my-3 h-px bg-white/10" />

        {secondaryNav.map((item) =>
        <NavLink
          key={item.id}
          item={item}
          active={item.id === activeId}
          onClick={() => onNavigate?.(item.id)} />

        )}
      </nav>

      <div className="border-t border-white/10 p-3">
        <div className="rounded-md bg-white/[0.06] px-3 py-3">
          <p className="text-caption font-medium text-white">This month</p>
          <p className="tnum mt-1 text-amount-md text-white">₹59,100</p>
          <p className="mt-0.5 text-[11px] text-white/50">spent across 84 transactions</p>
        </div>
      </div>
    </aside>);

}