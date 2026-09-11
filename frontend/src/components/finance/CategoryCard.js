import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <article className="category-card">
      <div className="category-card-icon" aria-hidden="true">{category.icon || '•'}</div>
      <div className="category-card-content">
        <h3>{category.name}</h3>
        <p>Personal category</p>
      </div>
      <div className="category-card-actions">
        <button type="button" aria-label={`Edit ${category.name}`} onClick={() => onEdit(category)}><Pencil size={15} /></button>
        <button type="button" aria-label={`Delete ${category.name}`} onClick={() => onDelete(category)}><Trash2 size={15} /></button>
      </div>
    </article>
  );
}

export default CategoryCard;