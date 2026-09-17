import React, { useState } from 'react';
import { BellIcon, MenuIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { Sidebar } from '../navigation/Sidebar';
import { MobileTabBar } from '../navigation/MobileNav';
import { UserMenu } from '../navigation/UserMenu';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
import { SearchInput } from '../ui/SearchInput';
import { StatCard } from '../finance/StatCard';
import { AmountText } from '../finance/AmountText';
import { DocBlock, DocSection } from './Showcase';

const breakpoints = [
{
  range: 'Desktop · ≥1280px',
  layout: 'Sidebar + 12-column canvas',
  detail:
  'Persistent dark sidebar (272px), search in the header, 32px gutters, dashboard runs a 3-column grid with the trend panel spanning two.'
},
{
  range: 'Laptop · 1024–1279px',
  layout: 'Sidebar + 2-column canvas',
  detail:
  'Sidebar stays. Header search collapses to an icon. The dashboard drops to two columns; the ledger hides the Method column.'
},
{
  range: 'Tablet · 768–1023px',
  layout: 'Drawer + 2-column canvas',
  detail:
  'Sidebar becomes a slide-over behind a menu button. Content keeps two columns at 24px gutters. Filters move onto one scrollable row.'
},
{
  range: 'Mobile · <768px',
  layout: 'Bottom tabs + single column',
  detail:
  'Bottom tab bar with a centre Add button. Single column, 16px gutters. The ledger table becomes a list of rows; filters move into a bottom sheet.'
}];


export function NavigationSection() {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="flex flex-col gap-12">
      <DocSection
        title="Navigation"
        description="Four primary destinations — Dashboard, Transactions, Categories, Reports — sit above the fold and never move. Profile and Settings are separated below a divider so account admin never competes with the actual work.">
        
        <DocBlock title="Desktop sidebar" note="Dark chrome keeps the data canvas the brightest thing on screen.">
          <div className="flex overflow-hidden rounded-lg border border-line">
            <div className="h-[520px] shrink-0">
              <Sidebar activeId={active} onNavigate={setActive} />
            </div>
            <div className="hidden min-w-0 flex-1 flex-col bg-canvas sm:flex">
              <div className="flex h-15 items-center gap-3 border-b border-line bg-surface px-5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-section text-ink-900">Dashboard</p>
                  <p className="truncate text-caption text-ink-500">September 2026 · INR</p>
                </div>
                <div className="hidden w-56 lg:block">
                  <SearchInput placeholder="Search transactions" shortcutHint="⌘K" readOnly />
                </div>
                <Button size="sm" iconLeft={<PlusIcon className="h-4 w-4" />}>
                  Add
                </Button>
                <UserMenu name="Harsha Vardhan" email="harsha@spendwise.app" />
              </div>
              <div className="grid flex-1 grid-cols-2 content-start gap-4 p-5">
                <StatCard label="Total balance" value={486320} emphasis="primary" delta={4.2} />
                <StatCard label="Expenses this month" value={59100} type="expense" delta={-11.4} />
                <div className="col-span-2 rounded-lg border border-line-subtle bg-surface p-5 shadow-xs">
                  <p className="text-cardtitle text-ink-900">Recent activity</p>
                  <div className="mt-3 space-y-2.5">
                    {[
                    ['Blue Tokai Coffee', 640, 'expense'],
                    ['September salary', 142000, 'income'],
                    ['Metro card top-up', 1200, 'expense']].
                    map(([title, amount, type]) =>
                    <div key={title as string} className="flex items-center justify-between gap-4">
                        <span className="truncate text-body text-ink-700">{title as string}</span>
                        <AmountText
                        value={amount as number}
                        type={type as 'income' | 'expense'}
                        size="sm"
                        signed />
                      
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DocBlock>

        <div className="grid gap-6 lg:grid-cols-2">
          <DocBlock
            title="Mobile navigation"
            note="Not the sidebar shrunk — a different structure for a different hand.">
            
            <div className="mx-auto w-[320px] overflow-hidden rounded-xl border border-line bg-canvas">
              <div className="flex h-13 items-center gap-2 border-b border-line bg-surface px-3">
                <MenuIcon className="h-5 w-5 text-ink-500" aria-hidden="true" />
                <p className="flex-1 text-cardtitle text-ink-900">Dashboard</p>
                <SearchIcon className="h-5 w-5 text-ink-500" aria-hidden="true" />
                <BellIcon className="h-5 w-5 text-ink-500" aria-hidden="true" />
                <Avatar name="Harsha Vardhan" size="xs" />
              </div>

              <div className="space-y-3 p-4 pb-6">
                <div className="rounded-lg bg-ink-900 p-4">
                  <p className="text-label text-white/70">Total balance</p>
                  <p className="tnum mt-1.5 text-amount-lg text-white">₹4,86,320</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-line-subtle bg-surface p-3">
                    <p className="text-caption text-ink-600">Income</p>
                    <AmountText value={170000} type="income" size="sm" signed className="mt-1" />
                  </div>
                  <div className="rounded-lg border border-line-subtle bg-surface p-3">
                    <p className="text-caption text-ink-600">Expenses</p>
                    <AmountText value={59100} type="expense" size="sm" signed className="mt-1" />
                  </div>
                </div>
                <div className="rounded-lg border border-line-subtle bg-surface p-4">
                  <p className="text-cardtitle text-ink-900">Recent</p>
                  <div className="mt-2.5 space-y-2">
                    {[
                    ['Blue Tokai Coffee', 640, 'expense'],
                    ['September salary', 142000, 'income']].
                    map(([title, amount, type]) =>
                    <div key={title as string} className="flex items-center justify-between gap-3">
                        <span className="truncate text-caption text-ink-700">{title as string}</span>
                        <AmountText
                        value={amount as number}
                        type={type as 'income' | 'expense'}
                        size="sm"
                        signed />
                      
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <MobileTabBar activeId="dashboard" inline />
            </div>
            <p className="mt-4 text-caption text-ink-500">
              Add transaction is promoted to the centre of the tab bar because logging a spend is the most
              frequent action on a phone. Profile and Settings live behind “More” rather than taking a tab.
            </p>
          </DocBlock>

          <DocBlock title="Responsive contract" note="How the same screen resolves at each width.">
            <div className="divide-y divide-line-subtle">
              {breakpoints.map((breakpoint) =>
              <div key={breakpoint.range} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="text-label text-ink-900">{breakpoint.range}</p>
                    <p className="text-caption text-ink-500">{breakpoint.layout}</p>
                  </div>
                  <p className="mt-1.5 text-body text-ink-600">{breakpoint.detail}</p>
                </div>
              )}
            </div>
          </DocBlock>
        </div>
      </DocSection>
    </div>);

}