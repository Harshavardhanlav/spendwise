import React, { useState } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { AppShell } from './components/navigation/AppShell';
import { DesignSystem } from './pages/DesignSystem';

interface AppProps {
  /** Which navigation destination reads as active in the shell preview. */
  activeNav?: 'dashboard' | 'transactions' | 'categories' | 'reports' | 'profile' | 'settings';
}

export function App({ activeNav = 'dashboard' }: AppProps) {
  const [active, setActive] = useState<string>(activeNav);

  return (
    <ToastProvider>
      <AppShell
        title="Design system"
        subtitle="Foundations, components and financial patterns"
        activeId={active}
        onNavigate={setActive}>
        
        <DesignSystem />
      </AppShell>
    </ToastProvider>);

}