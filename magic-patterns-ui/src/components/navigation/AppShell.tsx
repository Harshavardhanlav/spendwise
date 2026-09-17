import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNavDrawer, MobileTabBar } from './MobileNav';

interface AppShellProps {
  title: string;
  subtitle?: string;
  activeId: string;
  onNavigate?: (id: string) => void;
  children: React.ReactNode;
}

/**
 * Layout contract for every SpendWise screen.
 *
 * Desktop ≥1024px : persistent dark sidebar + sticky header + fluid canvas.
 * Tablet  768–1023: sidebar collapses to a drawer; content keeps 2 columns.
 * Mobile  <768px  : bottom tab bar, single column, 16px gutters,
 *                   extra bottom padding so the tab bar never covers content.
 */
export function AppShell({ title, subtitle, activeId, onNavigate, children }: AppShellProps) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-canvas">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar activeId={activeId} onNavigate={onNavigate} />
      </div>

      <MobileNavDrawer
        open={navOpen}
        activeId={activeId}
        onClose={() => setNavOpen(false)}
        onNavigate={onNavigate} />
      

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} subtitle={subtitle} onOpenNav={() => setNavOpen(true)} />

        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-12 lg:pt-7">
          {children}
        </main>
      </div>

      <MobileTabBar activeId={activeId} onNavigate={onNavigate} />
    </div>);

}