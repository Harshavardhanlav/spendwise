import React from 'react';
import { AlertTriangle, CalendarRange, Pencil, Trash2 } from 'lucide-react';

const money = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

const formatDate = (value) => {
  if (!value) return '—';
  const safeDate = new Date(value.includes('T') ? value : `${value}T12:00:00`);
  if (Number.isNaN(safeDate.getTime())) return '—';
  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(safeDate);
};

const getStatus = (percentageUsed, isExceeded) => {
  if (isExceeded || percentageUsed >= 100) {
    return { label: 'Over Budget', tone: 'over' };
  }
  if (percentageUsed >= 80) {
    return { label: 'Near Limit', tone: 'near' };
  }
  return { label: 'On Track', tone: 'track' };
};

function BudgetCard({ budget, currency, onEdit, onDelete }) {
  const percentageUsed = Number.isFinite(Number(budget.percentageUsed)) ? Number(budget.percentageUsed) : 0;
  const spent = Number(budget.spent) || 0;
  const amount = Number(budget.amount) || 0;
  const remaining = Number(budget.remaining) || 0;
  const status = getStatus(percentageUsed, Boolean(budget.isExceeded || remaining < 0));
  const progress = Math.min(100, Math.max(0, percentageUsed));

  return (
    <article className="budget-card">
      <div className="budget-card-header">
        <div className="budget-card-title-wrap">
          <span className="budget-card-icon" aria-hidden="true">₹</span>
          <div>
            <h3>{budget.description || 'Budget'}</h3>
            <p>{formatDate(budget.startDate)} → {formatDate(budget.endDate)}</p>
          </div>
        </div>
        <span className={`budget-status budget-status-${status.tone}`}>{status.label}</span>
      </div>

      <div className="budget-card-metrics">
        <div>
          <span>Budget</span>
          <strong>{money(amount, currency)}</strong>
        </div>
        <div>
          <span>Spent</span>
          <strong>{money(spent, currency)}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{money(remaining, currency)}</strong>
        </div>
      </div>

      <div className="budget-progress-wrap">
        <div className="budget-progress-meta">
          <span>{money(spent, currency)} / {money(amount, currency)}</span>
          <strong>{Math.abs(percentageUsed).toFixed(1)}%</strong>
        </div>
        <div className="budget-progress-bar" aria-label={`Budget used ${percentageUsed.toFixed(1)} percent`}>
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      {budget.description ? <p className="budget-description">{budget.description}</p> : null}

      {remaining < 0 ? (
        <p className="budget-overage"><AlertTriangle size={14} aria-hidden="true" /> {money(Math.abs(remaining), currency)} over budget</p>
      ) : (
        <p className="budget-usage-label">{percentageUsed.toFixed(1)}% used</p>
      )}

      <div className="budget-card-actions">
        <button type="button" aria-label={`Edit ${budget.description || 'budget'}`} onClick={() => onEdit(budget)}>
          <Pencil size={14} aria-hidden="true" /> Edit
        </button>
        <button type="button" className="budget-delete-button" aria-label={`Delete ${budget.description || 'budget'}`} onClick={() => onDelete(budget)}>
          <Trash2 size={14} aria-hidden="true" /> Delete
        </button>
      </div>
    </article>
  );
}

export default BudgetCard;
