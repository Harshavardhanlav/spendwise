import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, RefreshCw, X } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import TransactionForm from '../components/finance/TransactionForm';
import TransactionFilters from '../components/finance/TransactionFilters';
import TransactionTable from '../components/finance/TransactionTable';
import { getCategories } from '../services/categoryApi';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../services/transactionApi';

function TransactionsPage({ onUnauthorized, openCreateRequest = 0, onCreateRequestHandled }) {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({ type: '', categoryId: '', startDate: '', endDate: '' });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');

  const loadCategories = useCallback(async () => {
    const result = await getCategories();
    setCategories(result.categories || []);
  }, []);

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getTransactions(filters);
      setTransactions(result.transactions || []);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [filters, onUnauthorized]);

  useEffect(() => {
    Promise.all([loadCategories(), loadTransactions()]).catch((requestError) => {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError(requestError.message);
      setLoading(false);
    });
  }, [loadCategories, loadTransactions, onUnauthorized]);

  const visibleTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transactions;
    return transactions.filter((transaction) => [transaction.title, transaction.description, transaction.notes].some((value) => String(value || '').toLowerCase().includes(query)));
  }, [transactions, search]);

  const openCreate = () => { setEditingTransaction(null); setFormError(''); setFormOpen(true); };
  const openEdit = (transaction) => { setEditingTransaction(transaction); setFormError(''); setFormOpen(true); };
  const closeForm = () => { if (!formLoading) setFormOpen(false); };

  useEffect(() => {
    if (openCreateRequest > 0) {
      setEditingTransaction(null);
      setFormError('');
      setFormOpen(true);
      onCreateRequestHandled();
    }
  }, [openCreateRequest, onCreateRequestHandled]);

  const saveTransaction = async (payload) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editingTransaction) await updateTransaction(editingTransaction._id, payload);
      else await createTransaction(payload);
      setFormOpen(false);
      await loadTransactions();
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
      await deleteTransaction(deleteTarget._id);
      setDeleteTarget(null);
      await loadTransactions();
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError(requestError.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const currency = JSON.parse(localStorage.getItem('spendwiseUser') || '{}').currency || 'INR';

  return <div className="transactions-page">
    <div className="transactions-heading"><div><span className="eyebrow">Ledger</span><h2>Transactions</h2><p>Review and manage your real income and expenses.</p></div><Button icon={<Plus size={16} />} onClick={openCreate}>Add transaction</Button></div>
    <Card><CardHeader title="All activity" description={`${visibleTransactions.length} transaction${visibleTransactions.length === 1 ? '' : 's'} shown`} action={<Badge tone="neutral">Live data</Badge>} /><CardBody><TransactionFilters filters={filters} categories={categories} search={search} onSearch={setSearch} onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))} onReset={() => { setFilters({ type: '', categoryId: '', startDate: '', endDate: '' }); setSearch(''); }} />{error && <div className="auth-alert transaction-alert" role="alert">{error}<button type="button" onClick={loadTransactions}><RefreshCw size={14} /> Retry</button></div>}{loading ? <div className="transaction-state"><div className="dashboard-spinner" /><p>Loading transactions...</p></div> : visibleTransactions.length ? <TransactionTable transactions={visibleTransactions} categories={categories} currency={currency} onEdit={openEdit} onDelete={setDeleteTarget} /> : <div className="transaction-state"><h3>{search || Object.values(filters).some(Boolean) ? 'No matching transactions' : 'No transactions yet'}</h3><p>{search || Object.values(filters).some(Boolean) ? 'Try clearing a filter or changing your search.' : 'Add your first transaction to start building your ledger.'}</p></div>}</CardBody></Card>

    {formOpen && <div className="transaction-modal-layer"><button type="button" className="drawer-scrim" aria-label="Close transaction form" onClick={closeForm} /><section className="transaction-modal" role="dialog" aria-modal="true" aria-labelledby="transaction-modal-title"><div className="transaction-modal-header"><div><span className="eyebrow">Ledger</span><h2 id="transaction-modal-title">{editingTransaction ? 'Edit transaction' : 'Add transaction'}</h2></div><button type="button" className="icon-button" aria-label="Close transaction form" onClick={closeForm}><X size={18} /></button></div><TransactionForm transaction={editingTransaction} categories={categories} loading={formLoading} error={formError} onSubmit={saveTransaction} onCancel={closeForm} /></section></div>}
    {deleteTarget && <div className="transaction-modal-layer"><button type="button" className="drawer-scrim" aria-label="Cancel delete" onClick={() => setDeleteTarget(null)} /><section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-title"><h2 id="delete-title">Delete transaction?</h2><p>This will permanently remove “{deleteTarget.title}”.</p><div className="transaction-form-actions"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" disabled={deleteLoading} onClick={confirmDelete}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button></div></section></div>}
  </div>;
}

export default TransactionsPage;
