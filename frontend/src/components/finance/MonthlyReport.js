import React from 'react';

const formatMoney = (value, currency) => new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency,
  maximumFractionDigits: 0,
}).format(Number(value) || 0);

function MonthlyReport({ monthly, currency }) {
  const maximum = Math.max(...monthly.flatMap((item) => [Number(item.income || 0), Number(item.expense || 0)]), 0);

  return (
    <div className="monthly-report">
      {monthly.length === 0 ? <p className="report-muted">No monthly data available yet.</p> : <>
        <div className="monthly-report-chart" aria-label="Monthly income and expense chart">
          {monthly.map((item) => {
            const income = Number(item.income || 0);
            const expense = Number(item.expense || 0);
            const balance = income - expense;
            return <div className="monthly-report-column" key={item.month}>
              <div className="monthly-report-bars"><span className="monthly-report-income" style={{ height: `${maximum ? (income / maximum) * 100 : 0}%` }} /><span className="monthly-report-expense" style={{ height: `${maximum ? (expense / maximum) * 100 : 0}%` }} /></div>
              <span className="monthly-report-month">{item.month}</span>
              <small>{formatMoney(balance, currency)}</small>
            </div>;
          })}
        </div>
        <div className="report-legend"><span><i className="legend-income" />Income</span><span><i className="legend-expense" />Expenses</span><span>Labels show monthly balance</span></div>
        <div className="monthly-report-table">{monthly.map((item) => { const balance = Number(item.income || 0) - Number(item.expense || 0); return <div className="monthly-report-row" key={`${item.month}-detail`}><strong>{item.month}</strong><span className="amount-income">+{formatMoney(item.income, currency)}</span><span className="amount-expense">-{formatMoney(item.expense, currency)}</span><span className={balance >= 0 ? 'amount-income' : 'amount-expense'}>{formatMoney(balance, currency)}</span></div>; })}</div>
      </>}
    </div>
  );
}

export default MonthlyReport;
