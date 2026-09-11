import React, { useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, Wallet, X } from 'lucide-react';
import Card, { CardBody } from '../components/ui/Card';
import Button from '../components/ui/Button';
import BudgetCard from '../components/finance/BudgetCard';
import BudgetForm from '../components/finance/BudgetForm';
import { createBudget, deleteBudget, getBudgets, updateBudget } from '../services/budgetApi';

const money = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

function BudgetsPage({ onUnauthorized }) {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadBudgets = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getBudgets();
      setBudgets(result.budgets || []);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError('Unable to load budgets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBudgets().catch((requestError) => {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError('Unable to load budgets.');
      setLoading(false);
    });
  }, []);

  const openCreate = () => {
    setEditingBudget(null);
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (budget) => {
    setEditingBudget(budget);
    setFormError('');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (!formLoading) setFormOpen(false);
  };

  const saveBudget = async (payload) => {
    setFormLoading(true);
    setFormError('');
    try {
      const result = editingBudget ? await updateBudget(editingBudget.id || editingBudget._id, payload) : await createBudget(payload);
      const savedBudget = result.budget;
      setBudgets((current) => editingBudget
        ? current.map((budget) => (String((budget.id || budget._id)) === String(savedBudget.id || savedBudget._id) ? savedBudget : budget))
        : [savedBudget, ...current]);
      setFormOpen(false);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setFormError(requestError.message);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteBudget(deleteTarget.id || deleteTarget._id);
      setBudgets((current) => current.filter((budget) => String((budget.id || budget._id)) !== String(deleteTarget.id || deleteTarget._id)));
      setDeleteTarget(null);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError(requestError.message || 'Unable to delete budget.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const summary = useMemo(() => budgets.reduce((accumulator, budget) => {
    const amount = Number(budget.amount) || 0;
    const spent = Number(budget.spent) || 0;
    const remaining = Number(budget.remaining) || 0;

    accumulator.totalBudgets += 1;
    accumulator.totalBudgeted += amount;
    accumulator.totalSpent += spent;
    accumulator.totalRemaining += remaining;
    return accumulator;
  }, { totalBudgets: 0, totalBudgeted: 0, totalSpent: 0, totalRemaining: 0 }), [budgets]);

  const currency = JSON.parse(localStorage.getItem('spendwiseUser') || '{}').currency || 'INR';

  return (
    <div className="budgets-page">
      <div className="budgets-heading">
        <div>
          <span className="eyebrow">Planning</span>
          <h2>Budgets</h2>
          <p>Set spending limits and track your progress.</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={openCreate}>+ Add Budget</Button>
      </div>

      {error && (
        <div className="auth-alert category-alert" role="alert">
          {error}
          <button type="button" onClick={loadBudgets}><RefreshCw size={14} /> Retry</button>
        </div>
      )}

      {loading ? (
        <Card muted>
          <CardBody>
            <div className="budget-state">
              <div className="dashboard-spinner" />
              <p>Loading budgets...</p>
            </div>
          </CardBody>
        </Card>
      ) : budgets.length === 0 ? (
        <Card muted>
          <CardBody>
            <div className="budget-empty">
              <Wallet size={26} aria-hidden="true" />
              <h3>No budgets yet.</h3>
              <p>Create a budget to keep track of your spending.</p>
              <Button icon={<Plus size={15} />} onClick={openCreate}>Create Budget</Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        <>
          <div className="budget-summary-grid">
            <div className="budget-summary-card">
              <span>Total Budgets</span>
              <strong>{summary.totalBudgets}</strong>
            </div>
            <div className="budget-summary-card">
              <span>Total Budgeted</span>
              <strong>{money(summary.totalBudgeted, currency)}</strong>
            </div>
            <div className="budget-summary-card">
              <span>Total Spent</span>
              <strong>{money(summary.totalSpent, currency)}</strong>
            </div>
            <div className="budget-summary-card budget-summary-card-highlight">
              <span>Remaining</span>
              <strong>{money(summary.totalRemaining, currency)}</strong>
            </div>
          </div>

          <Card>
            <CardBody>
              <div className="budget-card-grid">
                {budgets.map((budget) => (
                  <BudgetCard
                    key={budget.id || budget._id}
                    budget={budget}
                    currency={currency}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {formOpen && (
        <div className="transaction-modal-layer">
          <button type="button" className="drawer-scrim" aria-label="Close budget form" onClick={closeForm} />
          <section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="budget-modal-title">
            <div className="transaction-modal-header">
              <div>
                <span className="eyebrow">Planning</span>
                <h2 id="budget-modal-title">{editingBudget ? 'Edit budget' : 'Add budget'}</h2>
              </div>
              <button type="button" className="icon-button" aria-label="Close budget form" onClick={closeForm}>
                <X size={18} />
              </button>
            </div>
            <BudgetForm
              budget={editingBudget}
              loading={formLoading}
              error={formError}
              onSubmit={saveBudget}
              onCancel={closeForm}
            />
          </section>
        </div>
      )}

      {deleteTarget && (
        <div className="transaction-modal-layer">
          <button type="button" className="drawer-scrim" aria-label="Cancel delete" onClick={() => setDeleteTarget(null)} />
          <section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-budget-title">
            <h2 id="delete-budget-title">Delete this budget?</h2>
            <p>This will remove the budget only. Your transactions will not be deleted.</p>
            <div className="transaction-form-actions">
              <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
              <Button variant="danger" disabled={deleteLoading} onClick={confirmDelete}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;
