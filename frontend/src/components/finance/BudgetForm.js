import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import AuthField from '../auth/AuthField';

const emptyForm = {
  amount: '',
  startDate: '',
  endDate: '',
  description: '',
};

const formatDateInput = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

function BudgetForm({ budget, loading, error, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setForm(
      budget
        ? {
            amount: String(budget.amount || ''),
            startDate: formatDateInput(budget.startDate),
            endDate: formatDateInput(budget.endDate),
            description: budget.description || '',
          }
        : { ...emptyForm }
    );
    setValidationError('');
  }, [budget]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const submit = (event) => {
    event.preventDefault();
    setValidationError('');

    if (!form.amount || !Number.isFinite(Number(form.amount)) || Number(form.amount) <= 0) {
      return setValidationError('Budget amount must be greater than 0.');
    }
    if (!form.startDate) return setValidationError('Start date is required.');
    if (!form.endDate) return setValidationError('End date is required.');
    if (new Date(form.endDate) < new Date(form.startDate)) {
      return setValidationError('End date cannot be before the start date.');
    }
    if (form.description.trim().length > 300) {
      return setValidationError('Description must be 300 characters or fewer.');
    }

    onSubmit({
      amount: Number(form.amount),
      startDate: form.startDate,
      endDate: form.endDate,
      description: form.description.trim(),
    });
  };

  return (
    <form className="budget-form" onSubmit={submit} noValidate>
      <div className="budget-form-grid">
        <AuthField
          label="Budget amount"
          id="budget-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={form.amount}
          onChange={(event) => update('amount', event.target.value)}
          placeholder="0.00"
        />

        <AuthField
          label="Start date"
          id="budget-start-date"
          type="date"
          value={form.startDate}
          onChange={(event) => update('startDate', event.target.value)}
        />

        <AuthField
          label="End date"
          id="budget-end-date"
          type="date"
          value={form.endDate}
          onChange={(event) => update('endDate', event.target.value)}
        />

        <div className="auth-field budget-form-wide">
          <label htmlFor="budget-description">Description</label>
          <textarea
            id="budget-description"
            rows="3"
            maxLength="300"
            placeholder="September spending limit"
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
          />
          <small className="field-hint">{form.description.length}/300</small>
        </div>
      </div>

      {(validationError || error) && <div className="auth-alert" role="alert">{validationError || error}</div>}

      <div className="transaction-form-actions">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading}>{loading ? (budget ? 'Updating...' : 'Creating...') : (budget ? 'Save changes' : 'Create budget')}</Button>
      </div>
    </form>
  );
}

export default BudgetForm;
