import React from 'react';
import { ChevronDownIcon, LogOutIcon, SettingsIcon, UserIcon } from 'lucide-react';
import { Avatar } from '../ui/Avatar';
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from '../ui/Dropdown';

interface UserMenuProps {
  name: string;
  email: string;
  currency?: string;
  onSignOut?: () => void;
}

/**
 * The backend issues a stateless 1h JWT and exposes no logout endpoint,
 * so "Sign out" is a client-side token discard. No auth logic changes.
 */
export function UserMenu({ name, email, currency = 'INR', onSignOut }: UserMenuProps) {
  return (
    <Dropdown
      align="end"
      width="w-60"
      trigger={
      <button
        type="button"
        className="flex items-center gap-2 rounded-md py-1 pl-1 pr-2 transition-colors duration-120 ease-out hover:bg-ink-100 focus-visible:focus-ring">
        
          <Avatar name={name} size="sm" />
          <span className="hidden text-body font-medium text-ink-900 sm:block">{name.split(' ')[0]}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
        </button>
      }>
      
      {(close) =>
      <>
          <div className="flex items-center gap-2.5 px-2.5 py-2.5">
            <Avatar name={name} size="md" />
            <div className="min-w-0">
              <p className="truncate text-body font-medium text-ink-900">{name}</p>
              <p className="truncate text-caption text-ink-500">{email}</p>
            </div>
          </div>

          <MenuSeparator />
          <MenuLabel>Account</MenuLabel>
          <MenuItem icon={<UserIcon className="h-4 w-4" />} onClick={close}>
            Profile
          </MenuItem>
          <MenuItem icon={<SettingsIcon className="h-4 w-4" />} onClick={close} shortcut={currency}>
            Settings
          </MenuItem>

          <MenuSeparator />
          <MenuItem
          icon={<LogOutIcon className="h-4 w-4" />}
          danger
          onClick={() => {
            onSignOut?.();
            close();
          }}>
          
            Sign out
          </MenuItem>
        </>
      }
    </Dropdown>);

}