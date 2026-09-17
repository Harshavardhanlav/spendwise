import React from 'react';
import { BellIcon, MenuIcon, PlusIcon } from 'lucide-react';
import { Button, IconButton } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';
import { UserMenu } from './UserMenu';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onOpenNav?: () => void;
  actions?: React.ReactNode;
}

/**
 * Header. Holds orientation (where am I) on the left and the single
 * primary action plus account controls on the right. Search is desktop-only
 * here; on mobile it lives inside the Transactions screen where it's used.
 */
export function Topbar({ title, subtitle, onOpenNav, actions }: TopbarProps) {
  const [query, setQuery] = React.useState('');

  return (
    <header className="sticky top-0 z-30 flex h-15 items-center gap-3 border-b border-line bg-surface/95 px-4 backdrop-blur-sm lg:px-8">
      <IconButton label="Open navigation" onClick={onOpenNav} className="lg:hidden">
        <MenuIcon className="h-4.5 w-4.5" />
      </IconButton>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-cardtitle text-ink-900 lg:text-section">{title}</h1>
        {subtitle && <p className="hidden truncate text-caption text-ink-500 lg:block">{subtitle}</p>}
      </div>

      <div className="hidden w-72 xl:block">
        <SearchInput
          placeholder="Search transactions"
          value={query}
          shortcutHint="⌘K"
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')} />
        
      </div>

      {actions}

      <IconButton label="Notifications" className="hidden sm:inline-flex">
        <BellIcon className="h-4.5 w-4.5" />
      </IconButton>

      <Button iconLeft={<PlusIcon className="h-4 w-4" />} className="hidden sm:inline-flex">
        Add transaction
      </Button>

      <div className="ml-1">
        <UserMenu name="Harsha Vardhan" email="harsha@spendwise.app" />
      </div>
    </header>);

}