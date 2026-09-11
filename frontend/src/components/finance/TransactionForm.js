import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import AuthField from '../auth/AuthField';

const paymentMethods = ['Cash', 'UPI', 'Debit Card', 'Credit Card', 'Bank Transfer', 'Net Banking', 'Other'];

const emptyForm = {
  type: 'expense',
  categoryId: '',
  title: '',
  description: '',
  amount: '',
  date: new Date().toISOString().slice(0, 10),
  paymentMethod: 'UPI',
  notes: '',
};

function TransactionForm({ transaction, categories, loading, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        categoryId: String(transaction.categoryId),
        title: transaction.title || '',
        description: transaction.description || '',
        amount: String(transaction.amount),
        date: new Date(transaction.date).toISOString().slice(0, 10),
        paymentMethod: transaction.paymentMethod,
        notes: transaction.notes || '',
      });
    } else {
      setForm({ ...emptyForm, categoryId: categories[0]?._id ? String(categories[0]._id) : '' });
    }
  }, [transaction, categories]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    setValidationError('');
    if (!form.categoryId) return setValidationError('Choose a category.');
    if (!form.title.trim()) return setValidationError('Title is required.');
    if (!Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) return setValidationError('Amount must be greater than 0.');
    if (!form.date) return setValidationError('Date is required.');
    onSubmit({ ...form, title: form.title.trim(), amount: Number(form.amount) });
  };

  return <form className="transaction-form" onSubmit={submit} noValidate>
    <div className="transaction-form-grid">
      <div className="auth-field"><label htmlFor="transaction-type">Type</label><select id="transaction-type" value={form.type} onChange={(event) => update('type', event.target.value)}><option value="expense">Expense</option><option value="income">Income</option></select></div>
      <div className="auth-field"><label htmlFor="transaction-category">Category</label><select id="transaction-category" value={form.categoryId} onChange={(event) => update('categoryId', event.target.value)}><option value="">Select category</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.icon ? `${category.icon} ` : ''}{category.name}</option>)}</select></div>
      <AuthField label="Title" id="transaction-title" value={form.title} onChange={(event) => update('title', event.target.value)} placeholder="e.g. Lunch" />
      <AuthField label="Amount" id="transaction-amount" type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => update('amount', event.target.value)} placeholder="0.00" />
      <AuthField label="Date" id="transaction-date" type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
      <div className="auth-field"><label htmlFor="transaction-payment">Payment method</label><select id="transaction-payment" value={form.paymentMethod} onChange={(event) => update('paymentMethod', event.target.value)}>{paymentMethods.map((method) => <option key={method} value={method}>{method}</option>)}</select></div>
      <div className="auth-field transaction-form-wide"><label htmlFor="transaction-description">Description</label><textarea id="transaction-description" value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Add context" rows="2" /></div>
      <div className="auth-field transaction-form-wide"><label htmlFor="transaction-notes">Notes</label><textarea id="transaction-notes" value={form.notes} onChange={(event) => update('notes', event.target.value)} placeholder="Optional note" rows="2" /></div>
    </div>
    {(validationError || error) && <div className="auth-alert" role="alert">{validationError || error}</div>}
    <div className="transaction-form-actions"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? 'Saving...' : transaction ? 'Save changes' : 'Add transaction'}</Button></div>
  </form>;
}

export default TransactionForm;