import React, { useEffect, useState } from 'react';
import { Plus, RefreshCw, Shapes, X } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import CategoryCard from '../components/finance/CategoryCard';
import CategoryForm from '../components/finance/CategoryForm';
import { createCategory, deleteCategory, getCategories, updateCategory } from '../services/categoryApi';

function CategoriesPage({ onUnauthorized }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await getCategories();
      setCategories(result.categories || []);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCategories(); }, []);

  const openCreate = () => { setEditingCategory(null); setFormError(''); setModalOpen(true); };
  const openEdit = (category) => { setEditingCategory(category); setFormError(''); setModalOpen(true); };
  const closeModal = () => { if (!formLoading) setModalOpen(false); };

  const saveCategory = async (data) => {
    setFormLoading(true);
    setFormError('');
    try {
      const result = editingCategory ? await updateCategory(editingCategory._id, data) : await createCategory(data);
      const savedCategory = result.category;
      setCategories((current) => editingCategory ? current.map((category) => category._id === savedCategory._id ? savedCategory : category) : [...current, savedCategory]);
      setModalOpen(false);
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
      await deleteCategory(deleteTarget._id);
      setCategories((current) => current.filter((category) => category._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) onUnauthorized();
      else setError(requestError.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="categories-page">
      <div className="categories-heading"><div><span className="eyebrow">Organization</span><h2>Categories</h2><p>Keep your personal spending groups clear and useful.</p></div><Button icon={<Plus size={16} />} onClick={openCreate}>Add category</Button></div>
      <Card><CardHeader title="Your categories" description={`${categories.length} categor${categories.length === 1 ? 'y' : 'ies'} available`} action={<Badge tone="neutral">Live data</Badge>} /><CardBody>
        {error && <div className="auth-alert category-alert" role="alert">{error}<button type="button" onClick={loadCategories}><RefreshCw size={14} /> Retry</button></div>}
        {loading ? <div className="category-state"><div className="dashboard-spinner" /><p>Loading categories...</p></div> : categories.length === 0 ? <div className="category-state"><Shapes size={26} aria-hidden="true" /><h3>No categories yet</h3><p>Create your first category to organize transactions.</p><Button icon={<Plus size={15} />} onClick={openCreate}>Add category</Button></div> : <div className="category-grid">{categories.map((category) => <CategoryCard key={category._id} category={category} onEdit={openEdit} onDelete={setDeleteTarget} />)}</div>}
      </CardBody></Card>

      {modalOpen && <div className="transaction-modal-layer"><button type="button" className="drawer-scrim" aria-label="Close category form" onClick={closeModal} /><section className="category-modal" role="dialog" aria-modal="true" aria-labelledby="category-modal-title"><div className="transaction-modal-header"><div><span className="eyebrow">Organization</span><h2 id="category-modal-title">{editingCategory ? 'Edit category' : 'Add category'}</h2></div><button type="button" className="icon-button" aria-label="Close category form" onClick={closeModal}><X size={18} /></button></div><CategoryForm category={editingCategory} loading={formLoading} error={formError} onSubmit={saveCategory} onCancel={closeModal} /></section></div>}
      {deleteTarget && <div className="transaction-modal-layer"><button type="button" className="drawer-scrim" aria-label="Cancel delete" onClick={() => setDeleteTarget(null)} /><section className="confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="delete-category-title"><h2 id="delete-category-title">Delete category?</h2><p>This will remove “{deleteTarget.name}” from your categories. Existing transactions keep their stored category ID.</p><div className="transaction-form-actions"><Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button><Button variant="danger" disabled={deleteLoading} onClick={confirmDelete}>{deleteLoading ? 'Deleting...' : 'Delete'}</Button></div></section></div>}
    </div>
  );
}

export default CategoriesPage;
