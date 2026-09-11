import React from 'react';
import {
  BarChart3,
  LayoutDashboard,
  Receipt,
  Settings,
  Shapes,
  UserRound,
  Wallet,
} from 'lucide-react';

const primaryItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: Receipt },
  { id: 'categories', label: 'Categories', icon: Shapes },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

const secondaryItems = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function NavItem({ item, activePage, onNavigate }) {
  const Icon = item.icon;
  const active = item.id === activePage;

  return (
    <button
      type="button"
      className={`sidebar-nav-item${active ? ' is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
      onClick={() => onNavigate(item.id)}
    >
      <Icon size={18} strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      <span>{item.label}</span>
    </button>
  );
}

function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <div className="brand-lockup">
        <span className="brand-mark"><Wallet size={18} aria-hidden="true" /></span>
        <span>SpendWise</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <p className="nav-group-label">Workspace</p>
          {primaryItems.map((item) => (
            <NavItem key={item.id} item={item} activePage={activePage} onNavigate={onNavigate} />
          ))}
        </div>

        <div className="nav-divider" />

        <div className="nav-group">
          <p className="nav-group-label">Account</p>
          {secondaryItems.map((item) => (
            <NavItem key={item.id} item={item} activePage={activePage} onNavigate={onNavigate} />
          ))}
        </div>
      </nav>

      <div className="sidebar-footnote">
        <span className="status-dot" />
        <span>Personal finance workspace</span>
      </div>
    </aside>
  );
}

export default Sidebar;
