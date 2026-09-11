import React, { useEffect, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, ChevronRight, RefreshCw, Wallet } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { getCategorySummary, getMonthlySummary, getTransactionSummary, getTransactions, getUserCategories } from '../services/transactionApi';

const formatMoney = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value) || 0);
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

function StatBlock({ label, value, tone, icon: Icon }) {
  return <div className={`dashboard-stat dashboard-stat-${tone}`}><div className="dashboard-stat-label"><span>{label}</span><span className="dashboard-stat-icon"><Icon size={16} aria-hidden="true" /></span></div><strong>{value}</strong></div>;
}

function DashboardPage({ onUnauthorized }) {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [summary, categorySummary, monthly, transactions, userCategories] = await Promise.all([getTransactionSummary(), getCategorySummary(), getMonthlySummary(), getTransactions(), getUserCategories()]);
      setData({ summary, categorySummary: categorySummary.categories || [], monthly: monthly.monthly || [], transactions: transactions.transactions || [] });
      setCategories(userCategories.categories || []);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) {
        onUnauthorized();
        return;
      }
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboard(); }, []);

  if (loading) return <div className="dashboard-state"><div className="dashboard-spinner" /><h2>Loading your dashboard</h2><p>Gathering your latest financial activity.</p></div>;
  if (error) return <div className="dashboard-state dashboard-error"><h2>We could not load your dashboard</h2><p>{error}</p><button type="button" className="button button-secondary" onClick={loadDashboard}><RefreshCw size={15} /> Try again</button></div>;

  const { summary, categorySummary, monthly, transactions } = data;
  const hasTransactions = summary.totalTransactions > 0;
  const currency = JSON.parse(localStorage.getItem('spendwiseUser') || '{}').currency || 'INR';
  const categoryMap = new Map(categories.map((category) => [String(category._id), category]));
  const maxCategoryAmount = Math.max(...categorySummary.map((item) => item.totalAmount), 0);
  const maxMonthlyAmount = Math.max(...monthly.flatMap((item) => [item.income, item.expense]), 0);

  return <div className="dashboard-page">
    <div className="dashboard-intro"><div><span className="eyebrow">Overview</span><h2>Your money, at a glance.</h2><p>Real-time totals from your SpendWise transactions.</p></div><Badge tone={hasTransactions ? 'income' : 'neutral'}>{hasTransactions ? `${summary.totalTransactions} transactions` : 'No transactions yet'}</Badge></div>
    {!hasTransactions ? <Card muted><CardBody><div className="dashboard-empty"><Wallet size={24} aria-hidden="true" /><h3>Your dashboard is ready</h3><p>Add your first transaction to see balances, trends, and category spending here.</p></div></CardBody></Card> : <>
      <div className="dashboard-stats"><StatBlock label="Total balance" value={formatMoney(summary.balance, currency)} tone="balance" icon={Wallet} /><StatBlock label="Total income" value={formatMoney(summary.totalIncome, currency)} tone="income" icon={ArrowDownLeft} /><StatBlock label="Total expenses" value={formatMoney(summary.totalExpense, currency)} tone="expense" icon={ArrowUpRight} /></div>
      <div className="dashboard-grid">
        <Card className="dashboard-panel dashboard-monthly-panel"><CardHeader title="Monthly trend" description="Income and expenses over time" /><CardBody><div className="monthly-chart">{monthly.map((item) => <div className="monthly-column" key={item.month}><div className="monthly-bars" style={{ height: `${Math.max((Math.max(item.income, item.expense) / maxMonthlyAmount) * 100, 3)}%` }}><span className="monthly-bar monthly-income" style={{ height: `${item.income / Math.max(item.income, item.expense) * 100}%` }} /><span className="monthly-bar monthly-expense" style={{ height: `${item.expense / Math.max(item.income, item.expense) * 100}%` }} /></div><span>{item.month}</span></div>)}</div><div className="chart-legend"><span><i className="legend-income" />Income</span><span><i className="legend-expense" />Expenses</span></div></CardBody></Card>
        <Card className="dashboard-panel"><CardHeader title="Spending by category" description="Your expense distribution" /><CardBody><div className="category-list">{categorySummary.length === 0 ? <p className="muted-copy">No expense categories yet.</p> : categorySummary.map((item) => { const category = categoryMap.get(String(item.categoryId)); return <div className="category-row" key={item.categoryId}><div className="category-row-heading"><span className="category-name">{category?.icon || '•'} {item.categoryName}</span><span>{formatMoney(item.totalAmount, currency)}</span></div><div className="category-bar"><span style={{ width: `${maxCategoryAmount ? (item.totalAmount / maxCategoryAmount) * 100 : 0}%` }} /></div><small>{item.transactionCount} transaction{item.transactionCount === 1 ? '' : 's'}</small></div>; })}</div></CardBody></Card>
      </div>
      <Card className="dashboard-panel"><CardHeader title="Recent transactions" description="Your latest recorded activity" action={<span className="dashboard-count">{transactions.length} shown</span>} /><CardBody><div className="recent-list">{transactions.slice(0, 6).map((transaction) => <div className="recent-row" key={transaction._id}><div><strong>{transaction.title}</strong><span>{formatDate(transaction.date)} · {transaction.paymentMethod}</span></div><strong className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}>{transaction.type === 'income' ? '+' : '-'}{formatMoney(transaction.amount, currency)}</strong></div>)}</div>{transactions.length === 0 && <p className="muted-copy">No transactions found.</p>}<button type="button" className="dashboard-link">View all activity <ChevronRight size={15} /></button></CardBody></Card>
    </>}
  </div>;
}

export default DashboardPage;
