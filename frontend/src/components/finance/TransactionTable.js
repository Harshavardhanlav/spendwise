import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

const formatMoney = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value) || 0);
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

function TransactionTable({ transactions, categories, currency, onEdit, onDelete }) {
  const categoryMap = new Map(categories.map((category) => [String(category._id), category]));
  return <div className="transaction-table-wrap"><table className="transaction-table"><thead><tr><th>Date</th><th>Transaction</th><th>Category</th><th>Type</th><th>Payment</th><th className="amount-column">Amount</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{transactions.map((transaction) => { const category = categoryMap.get(String(transaction.categoryId)); return <tr key={transaction._id}><td data-label="Date">{formatDate(transaction.date)}</td><td data-label="Transaction"><strong>{transaction.title}</strong>{transaction.description && <small>{transaction.description}</small>}</td><td data-label="Category">{category?.icon || '•'} {category?.name || 'Unknown'}</td><td data-label="Type"><span className={`type-pill type-${transaction.type}`}>{transaction.type}</span></td><td data-label="Payment">{transaction.paymentMethod}</td><td data-label="Amount" className={`amount-column amount-${transaction.type}`}>{transaction.type === 'income' ? '+' : '-'}{formatMoney(transaction.amount, currency)}</td><td className="transaction-actions"><button type="button" aria-label={`Edit ${transaction.title}`} onClick={() => onEdit(transaction)}><Pencil size={15} /></button><button type="button" aria-label={`Delete ${transaction.title}`} onClick={() => onDelete(transaction)}><Trash2 size={15} /></button></td></tr>; })}</tbody></table></div>;
}

export default TransactionTable;