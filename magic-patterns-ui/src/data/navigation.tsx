import React from 'react';
import {
  ChartPieIcon,
  LayoutDashboardIcon,
  ReceiptIcon,
  SettingsIcon,
  ShapesIcon,
  UserIcon } from
'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{className?: string;}>;
  badge?: string;
}

/** Primary destinations — the four things the product is for. */
export const primaryNav: NavItem[] = [
{ id: 'dashboard', label: 'Dashboard', href: '/', icon: LayoutDashboardIcon },
{ id: 'transactions', label: 'Transactions', href: '/transactions', icon: ReceiptIcon, badge: '128' },
{ id: 'categories', label: 'Categories', href: '/categories', icon: ShapesIcon },
{ id: 'reports', label: 'Reports', href: '/reports', icon: ChartPieIcon }];


/** Account-level destinations — separated so they never compete with the work. */
export const secondaryNav: NavItem[] = [
{ id: 'profile', label: 'Profile', href: '/profile', icon: UserIcon },
{ id: 'settings', label: 'Settings', href: '/settings', icon: SettingsIcon }];