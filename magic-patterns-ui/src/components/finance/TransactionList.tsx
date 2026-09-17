import React from 'react';
import {
  BriefcaseIcon,
  BusIcon,
  LaptopIcon,
  ShoppingBagIcon,
  UtensilsIcon,
  ZapIcon,
  CircleDollarSignIcon } from
'lucide-react';
import { cn } from '../../utils/cn';
import { formatRelativeDay } from '../../utils/format';
import type { SampleTransaction } from '../../data/sampleFinance';
import { AmountText } from './AmountText';
import { PaymentMethodTag, TransactionStatusBadge } from './PaymentMethodTag';
import { CategoryIcon } from '../ui/Avatar';

const iconMap: Record<string, React.ComponentType<{className?: string;}>> = {
  utensils: UtensilsIcon,
  briefcase: BriefcaseIcon,
  bus: BusIcon,
  zap: ZapIcon,
  laptop: LaptopIcon,
  'shopping-bag': ShoppingBagIcon
};

/**
 * Compact transaction row for the dashboard "Recent activity" panel.
 * The full Transactions page uses the Table primitive instead — a list on
 * desktop would waste the width, and a table on mobile would not fit.
 */
export function TransactionRow({
  transaction,
  showStatus = false,
  onClick




}: {transaction: SampleTransaction;showStatus?: boolean;onClick?: () => void;}) {
  const Icon = iconMap[transaction.categoryIcon] ?? CircleDollarSignIcon;

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 transition-colors duration-120 ease-out sm:px-5',
        onClick && 'cursor-pointer hover:bg-ink-50 focus-visible:focus-ring-inset'
      )}>
      
      <CategoryIcon
        icon={<Icon className="h-4 w-4" />}
        tone={transaction.type === 'income' ? 'income' : 'neutral'} />
      

      <div className="min-w-0 flex-1">
        <p className="truncate text-body font-medium text-ink-900">{transaction.title}</p>
        <div className="mt-0.5 flex items-center gap-2 text-caption text-ink-500">
          <span className="truncate">{transaction.category}</span>
          <span aria-hidden="true" className="h-0.5 w-0.5 rounded-full bg-ink-300" />
          <span className="whitespace-nowrap">{formatRelativeDay(transaction.date, new Date('2026-09-11'))}</span>
        </div>
      </div>

      <div className="hidden shrink-0 sm:block">
        <PaymentMethodTag method={transaction.paymentMethod} compact />
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <AmountText value={transaction.amount} type={transaction.type} size="sm" signed />
        {showStatus && transaction.status !== 'cleared' &&
        <TransactionStatusBadge status={transaction.status} />
        }
      </div>
    </div>);

}

export function TransactionList({
  transactions,
  showStatus



}: {transactions: SampleTransaction[];showStatus?: boolean;}) {
  return (
    <div className="divide-y divide-line-subtle">
      {transactions.map((transaction) =>
      <TransactionRow
        key={transaction.id}
        transaction={transaction}
        showStatus={showStatus}
        onClick={() => undefined} />

      )}
    </div>);

}