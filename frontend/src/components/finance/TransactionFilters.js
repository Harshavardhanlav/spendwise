import React from 'react';

function TransactionFilters({ filters, categories, search, onChange, onSearch, onReset }) {
  return <div className="transaction-filters">
    <div className="filter-tabs"><button type="button" className={filters.type === '' ? 'is-active' : ''} onClick={() => onChange('type', '')}>All</button><button type="button" className={filters.type === 'income' ? 'is-active' : ''} onClick={() => onChange('type', 'income')}>Income</button><button type="button" className={filters.type === 'expense' ? 'is-active' : ''} onClick={() => onChange('type', 'expense')}>Expenses</button></div>
    <input className="filter-search" type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" />
    <select value={filters.categoryId} onChange={(event) => onChange('categoryId', event.target.value)} aria-label="Filter by category"><option value="">All categories</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.icon ? `${category.icon} ` : ''}{category.name}</option>)}</select>
    <input type="date" value={filters.startDate} onChange={(event) => onChange('startDate', event.target.value)} aria-label="Start date" />
    <input type="date" value={filters.endDate} onChange={(event) => onChange('endDate', event.target.value)} aria-label="End date" />
    <button type="button" className="filter-reset" onClick={onReset}>Clear</button>
  </div>;
}

export default TransactionFilters;