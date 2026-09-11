import React, { useEffect, useState } from 'react';
import Button from '../ui/Button';
import AuthField from '../auth/AuthField';

const iconOptions = ['🍔', '🏠', '🚗', '🛒', '💡', '🎓', '💊', '✈️', '🎁', '💼', '📱', '✨'];

function CategoryForm({ category, loading, error, onSubmit, onCancel }) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(iconOptions[0]);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setName(category?.name || '');
    setIcon(category?.icon || iconOptions[0]);
    setValidationError('');
  }, [category]);

  const submit = (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    setValidationError('');
    if (!trimmedName) return setValidationError('Category name is required.');
    if (trimmedName.length > 40) return setValidationError('Category name must be 40 characters or fewer.');
    onSubmit({ name: trimmedName, icon });
  };

  return (
    <form className="category-form" onSubmit={submit} noValidate>
      <AuthField label="Category name" id="category-name" maxLength="40" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Food" />
      <div className="category-icon-field">
        <span className="category-form-label">Icon</span>
        <div className="category-icon-options" role="radiogroup" aria-label="Choose category icon">
          {iconOptions.map((option) => <button key={option} type="button" role="radio" aria-checked={icon === option} className={icon === option ? 'is-selected' : ''} onClick={() => setIcon(option)}>{option}</button>)}
        </div>
      </div>
      {(validationError || error) && <div className="auth-alert" role="alert">{validationError || error}</div>}
      <div className="transaction-form-actions"><Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit" disabled={loading}>{loading ? 'Saving...' : category ? 'Save changes' : 'Add category'}</Button></div>
    </form>
  );
}

export default CategoryForm;