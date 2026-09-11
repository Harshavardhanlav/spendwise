import React from 'react';
import { Bell, Menu, UserRound } from 'lucide-react';

const pageMeta = {
  dashboard: { title: 'Dashboard', context: 'A clear view of your financial rhythm.' },
  transactions: { title: 'Transactions', context: 'Review and manage your money movement.' },
  categories: { title: 'Categories', context: 'Keep spending groups simple and useful.' },
  reports: { title: 'Reports', context: 'Patterns and summaries for better decisions.' },
  profile: { title: 'Profile', context: 'Your personal account details.' },
  settings: { title: 'Settings', context: 'Tune your SpendWise experience.' },
};

function Topbar({ activePage, onOpenMenu, onLogout }) {
  const meta = pageMeta[activePage] || pageMeta.dashboard;

  return (
    <header className="topbar">
      <button type="button" className="icon-button mobile-menu-button" aria-label="Open navigation" onClick={onOpenMenu}>
        <Menu size={19} aria-hidden="true" />
      </button>

      <div className="topbar-heading">
        <h1>{meta.title}</h1>
        <p>{meta.context}</p>
      </div>

      <div className="topbar-actions">
        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={18} aria-hidden="true" />
          <span className="notification-dot" />
        </button>
        <button type="button" className="user-menu-button" aria-label="Log out" onClick={onLogout}>
          <span className="avatar"><UserRound size={16} aria-hidden="true" /></span>
          <span className="user-menu-copy">
            <strong>SpendWise User</strong>
            <small>Personal account</small>
          </span>
        </button>
      </div>
    </header>
  );
}

export default Topbar;
