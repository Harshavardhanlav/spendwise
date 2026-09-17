import React from 'react';
import {
  BanknoteIcon,
  BuildingIcon,
  CreditCardIcon,
  LandmarkIcon,
  MoreHorizontalIcon,
  SmartphoneIcon,
  WalletIcon } from
'lucide-react';
import { cn } from '../../utils/cn';
import type { PaymentMethod, TransactionStatus } from '../../types/finance';
import { Badge } from '../ui/Badge';

/** Icons map 1:1 to the backend paymentMethod enum — no extra values. */
const methodIcons: Record<PaymentMethod, React.ComponentType<{className?: string;}>> = {
  Cash: BanknoteIcon,
  UPI: SmartphoneIcon,
  'Debit Card': CreditCardIcon,
  'Credit Card': CreditCardIcon,
  'Bank Transfer': LandmarkIcon,
  'Net Banking': BuildingIcon,
  Other: MoreHorizontalIcon
};

export function PaymentMethodTag({
  method,
  compact = false,
  className




}: {method: PaymentMethod;compact?: boolean;className?: string;}) {
  const Icon = methodIcons[method] ?? WalletIcon;

  if (compact) {
    return (
      <span className={cn('inline-flex items-center gap-1.5 text-caption text-ink-600', className)}>
        <Icon className="h-3.5 w-3.5 text-ink-400" aria-hidden="true" />
        {method}
      </span>);

  }

  return (
    <Badge tone="neutral" variant="outline" icon={<Icon className="h-3.5 w-3.5 text-ink-400" />} className={className}>
      {method}
    </Badge>);

}

const statusConfig: Record<TransactionStatus, {label: string;tone: 'income' | 'info' | 'warning' | 'expense';}> = {
  cleared: { label: 'Cleared', tone: 'income' },
  scheduled: { label: 'Scheduled', tone: 'info' },
  pending: { label: 'Pending', tone: 'warning' },
  failed: { label: 'Failed', tone: 'expense' }
};

/**
 * Presentation-only status derived on the client (the Transaction model has
 * no status field). Uses a dot + word so it never depends on hue alone.
 */
export function TransactionStatusBadge({ status }: {status: TransactionStatus;}) {
  const config = statusConfig[status];
  return (
    <Badge tone={config.tone} variant="soft" size="sm" dot>
      {config.label}
    </Badge>);

}