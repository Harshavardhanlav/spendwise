import React from 'react';

const formatMoney = (value, currency) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

function CategoryReport({ categories, currency }) {
  const totalExpenses = categories.reduce((sum, category) => sum + Number(category.totalAmount || 0), 0);
  const maximum = Math.max(...categories.map((category) => Number(category.totalAmount || 0)), 0);

  return (
    <div className="report-category-list">
      {categories.length === 0 ? <p className="report-muted">No expense category data available yet.</p> : categories.map((category) => {
        const amount = Number(category.totalAmount || 0);
        const percentage = totalExpenses ? Math.round((amount / totalExpenses) * 100) : 0;
        return (
          <div className="report-category-row" key={category.categoryId}>
            <div className="report-category-heading">
              <span className="report-category-name"><span className="report-category-icon">{category.icon || '•'}</span>{category.categoryName}</span>
              <span className="report-category-amount">{formatMoney(amount, currency)} <small>{percentage}%</small></span>
            </div>
            <div className="report-progress" aria-label={`${category.categoryName}: ${percentage}% of expenses`}><span style={{ width: `${maximum ? (amount / maximum) * 100 : 0}%` }} /></div>
            <small className="report-category-count">{category.transactionCount} transaction{category.transactionCount === 1 ? '' : 's'}</small>
          </div>
        );
      })}
    </div>
  );
}

export default CategoryReport;
