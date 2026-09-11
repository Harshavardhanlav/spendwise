import React from 'react';
import { BarChart3, LayoutDashboard, Menu, Plus, Receipt, Shapes, X } from 'lucide-react';

const mobileItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'transactions', label: 'Activity', icon: Receipt },
  { id: 'categories', label: 'Categories', icon: Shapes },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];

function MobileNav({ open, activePage, onClose, onNavigate }) {
  return (
    <>
      {open && (
        <div className="mobile-drawer-layer">
          <button type="button" className="drawer-scrim" aria-label="Close navigation" onClick={onClose} />
          <aside className="mobile-drawer" aria-label="Mobile navigation">
            <div className="drawer-header">
              <span className="drawer-title">SpendWise</span>
              <button type="button" className="icon-button drawer-close" aria-label="Close navigation" onClick={onClose}>
                <X size={18} aria-hidden="true" />
              </button>
            </div>
            <div className="drawer-links">
              {['dashboard', 'transactions', 'categories', 'reports', 'profile', 'settings'].map((id) => (
                <button
                  type="button"
                  key={id}
                  className={`drawer-link${activePage === id ? ' is-active' : ''}`}
                  onClick={() => { onNavigate(id); onClose(); }}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <nav className="mobile-bottom-nav" aria-label="Primary mobile navigation">
        {mobileItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          return (
            <button type="button" key={item.id} className={`mobile-nav-item${activePage === item.id ? ' is-active' : ''}`} onClick={() => onNavigate(item.id)}>
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" className="mobile-add-button" aria-label="Add transaction">
          <Plus size={21} aria-hidden="true" />
        </button>
        {mobileItems.slice(2).map((item) => {
          const Icon = item.icon;
          return (
            <button type="button" key={item.id} className={`mobile-nav-item${activePage === item.id ? ' is-active' : ''}`} onClick={() => onNavigate(item.id)}>
              <Icon size={18} aria-hidden="true" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button type="button" className="mobile-nav-item" aria-label="More navigation" onClick={() => onNavigate('settings')}>
          <Menu size={18} aria-hidden="true" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}

export default MobileNav;
