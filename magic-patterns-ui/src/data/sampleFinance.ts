import type { PaymentMethod, TransactionStatus, TransactionType } from '../types/finance';

/**
 * Illustrative data for the design system showcase only.
 * Shapes mirror the backend models so screens can swap in real API data
 * without changing any component contract.
 */

export interface SampleTransaction {
  id: string;
  title: string;
  category: string;
  categoryIcon: string;
  type: TransactionType;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
}

export const sampleTransactions: SampleTransaction[] = [
{
  id: 't1',
  title: 'Blue Tokai Coffee',
  category: 'Food & Dining',
  categoryIcon: 'utensils',
  type: 'expense',
  amount: 640,
  date: '2026-09-11',
  paymentMethod: 'UPI',
  status: 'cleared'
},
{
  id: 't2',
  title: 'September salary',
  category: 'Salary',
  categoryIcon: 'briefcase',
  type: 'income',
  amount: 142000,
  date: '2026-09-10',
  paymentMethod: 'Bank Transfer',
  status: 'cleared'
},
{
  id: 't3',
  title: 'Metro card top-up',
  category: 'Transport',
  categoryIcon: 'bus',
  type: 'expense',
  amount: 1200,
  date: '2026-09-10',
  paymentMethod: 'Debit Card',
  status: 'cleared'
},
{
  id: 't4',
  title: 'Electricity bill',
  category: 'Utilities',
  categoryIcon: 'zap',
  type: 'expense',
  amount: 3480,
  date: '2026-09-09',
  paymentMethod: 'Net Banking',
  status: 'pending'
},
{
  id: 't5',
  title: 'Freelance retainer',
  category: 'Side income',
  categoryIcon: 'laptop',
  type: 'income',
  amount: 28000,
  date: '2026-09-08',
  paymentMethod: 'Bank Transfer',
  status: 'scheduled'
},
{
  id: 't6',
  title: 'Amazon — desk lamp',
  category: 'Shopping',
  categoryIcon: 'shopping-bag',
  type: 'expense',
  amount: 2149,
  date: '2026-09-07',
  paymentMethod: 'Credit Card',
  status: 'cleared'
}];


export interface CategorySpend {
  id: string;
  name: string;
  amount: number;
  share: number;
  color: string;
  transactions: number;
}

export const sampleCategorySpend: CategorySpend[] = [
{ id: 'c1', name: 'Food & Dining', amount: 18420, share: 31, color: 'var(--sw-viz-1)', transactions: 42 },
{ id: 'c2', name: 'Rent & Housing', amount: 16000, share: 27, color: 'var(--sw-viz-2)', transactions: 1 },
{ id: 'c3', name: 'Transport', amount: 8650, share: 15, color: 'var(--sw-viz-3)', transactions: 23 },
{ id: 'c4', name: 'Shopping', amount: 7310, share: 12, color: 'var(--sw-viz-4)', transactions: 11 },
{ id: 'c5', name: 'Utilities', amount: 5240, share: 9, color: 'var(--sw-viz-5)', transactions: 6 },
{ id: 'c6', name: 'Health', amount: 3480, share: 6, color: 'var(--sw-viz-6)', transactions: 4 }];


export interface MonthPoint {
  month: string;
  income: number;
  expense: number;
}

export const sampleMonthly: MonthPoint[] = [
{ month: 'Apr', income: 138000, expense: 61200 },
{ month: 'May', income: 138000, expense: 72400 },
{ month: 'Jun', income: 141500, expense: 58900 },
{ month: 'Jul', income: 140000, expense: 81300 },
{ month: 'Aug', income: 152000, expense: 66700 },
{ month: 'Sep', income: 170000, expense: 59100 }];


export const sampleSummary = {
  balance: 486320,
  income: 170000,
  expense: 59100,
  currency: 'INR'
};