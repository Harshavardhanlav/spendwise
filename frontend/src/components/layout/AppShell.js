import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import MobileNav from './MobileNav';

function AppShell({ activePage, onNavigate, onLogout, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="app-shell">
      <div className="desktop-sidebar-wrap">
        <Sidebar activePage={activePage} onNavigate={onNavigate} />
      </div>

      <MobileNav
        open={mobileMenuOpen}
        activePage={activePage}
        onClose={() => setMobileMenuOpen(false)}
        onNavigate={onNavigate}
      />

      <div className="app-main-column">
        <Topbar
          activePage={activePage}
          onOpenMenu={() => setMobileMenuOpen(true)}
          onLogout={onLogout}
        />
        <main className="app-content">{children}</main>
      </div>

      <div className="mobile-bottom-space" />
    </div>
  );
}

export default AppShell;
