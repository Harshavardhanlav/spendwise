import React from 'react';
import { formatCurrency } from '../../utils/format';
import type { CategorySpend } from '../../data/sampleFinance';

/**
 * Category spending. A ranked bar list, not a pie chart: humans compare
 * lengths far more accurately than angles, and a list also carries the
 * exact amount and transaction count a pie cannot.
 */
export function CategorySpendList({ categories }: {categories: CategorySpend[];}) {
  const max = Math.max(...categories.map((category) => category.amount));

  return (
    <ul className="flex flex-col gap-3.5">
      {categories.map((category) =>
      <li key={category.id}>
          <div className="flex items-baseline justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rounded-sm"
              style={{ backgroundColor: category.color }} />
            
              <span className="truncate text-body text-ink-900">{category.name}</span>
              <span className="tnum shrink-0 text-caption text-ink-400">{category.transactions}</span>
            </div>
            <div className="flex shrink-0 items-baseline gap-2">
              <span className="tnum text-amount-sm text-ink-900">{formatCurrency(category.amount)}</span>
              <span className="tnum w-8 text-right text-caption text-ink-500">{category.share}%</span>
            </div>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
            <div
            className="h-full rounded-full"
            style={{ width: `${category.amount / max * 100}%`, backgroundColor: category.color }} />
          
          </div>
        </li>
      )}
    </ul>);

}

/**
 * Income vs expense for a single period. One bar, split — it reads as
 * "what came in, what stayed" at a glance, which two separate bars don't.
 */
export function IncomeExpenseBar({
  income,
  expense,
  currency = 'INR'




}: {income: number;expense: number;currency?: string;}) {
  const total = income + expense || 1;
  const incomeShare = income / total * 100;
  const savedRate = income > 0 ? Math.round((income - expense) / income * 100) : 0;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-label text-ink-600">Saved this month</p>
          <p className="tnum mt-1 text-amount-lg text-ink-900">
            {formatCurrency(income - expense, currency)}
          </p>
        </div>
        <p className="tnum text-caption text-ink-500">
          <span className="text-amount-sm text-income">{savedRate}%</span> of income
        </p>
      </div>

      <div
        className="mt-4 flex h-2.5 w-full overflow-hidden rounded-full bg-ink-100"
        role="img"
        aria-label={`Income ${formatCurrency(income, currency)}, expenses ${formatCurrency(expense, currency)}`}>
        
        <div className="h-full bg-income" style={{ width: `${incomeShare}%` }} />
        <div className="h-full bg-expense" style={{ width: `${100 - incomeShare}%` }} />
      </div>

      <div className="mt-3 flex items-center gap-5">
        <span className="flex items-center gap-1.5 text-caption text-ink-600">
          <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-income" />
          Income
          <span className="tnum font-medium text-ink-900">{formatCurrency(income, currency)}</span>
        </span>
        <span className="flex items-center gap-1.5 text-caption text-ink-600">
          <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-expense" />
          Expenses
          <span className="tnum font-medium text-ink-900">{formatCurrency(expense, currency)}</span>
        </span>
      </div>
    </div>);

}