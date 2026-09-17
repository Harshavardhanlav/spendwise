/**
 * Frontend-facing types mirrored from the existing backend Mongoose models.
 * These are read-only mirrors — the backend schemas are the source of truth
 * and are not modified by the design system.
 */

/** Transaction.paymentMethod enum, backend/models/transaction.js */
export type PaymentMethod =
'Cash' |
'UPI' |
'Debit Card' |
'Credit Card' |
'Bank Transfer' |
'Net Banking' |
'Other';

export const PAYMENT_METHODS: PaymentMethod[] = [
'Cash',
'UPI',
'Debit Card',
'Credit Card',
'Bank Transfer',
'Net Banking',
'Other'];


/** Transaction.type enum */
export type TransactionType = 'income' | 'expense';

/** Embedded categorySchema on the User document */
export interface Category {
  _id: string;
  name: string;
  icon: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  type: TransactionType;
  categoryId: string;
  title: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  currency: string;
}

/**
 * Presentation-only status. The backend stores no status field, so this is
 * derived on the client (e.g. a future-dated transaction is "Scheduled").
 * It exists as a visual pattern, not as new business logic.
 */
export type TransactionStatus = 'cleared' | 'scheduled' | 'pending' | 'failed';