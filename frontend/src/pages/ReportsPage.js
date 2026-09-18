import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Download, RefreshCw, Wallet } from 'lucide-react';
import Card, { CardBody, CardHeader } from '../components/ui/Card';
import ReportStatCard from '../components/finance/ReportStatCard';
import CategoryReport from '../components/finance/CategoryReport';
import MonthlyReport from '../components/finance/MonthlyReport';
import { getCategories } from '../services/categoryApi';
import { getCategorySummary, getComparison, getMonthlySummary, getPaymentMethodSummary, getReportTransactions, getSummary } from '../services/reportApi';

const money = (value, currency = 'INR') => new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value) || 0);
const monthLabel = (date) => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date);
const dateValue = (date) => date.toISOString().slice(0, 10);
const periodFor = (date) => ({ startDate: dateValue(new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1))), endDate: dateValue(new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0))) });
const formatDate = (value) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));

function ReportsPage({ onUnauthorized }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [report, setReport] = useState(null);
  const [categories, setCategories] = useState([]);
  const [transactionType, setTransactionType] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const downloadMenuRef = useRef(null);

  const period = useMemo(() => periodFor(selectedDate), [selectedDate]);
  const loadReports = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [summary, categoryData, monthlyData, paymentData, comparison, transactions, userCategories] = await Promise.all([
        getSummary(period), getCategorySummary(period), getMonthlySummary(), getPaymentMethodSummary(period), getComparison(period),
        getReportTransactions({ ...period, type: transactionType, categoryId: categoryFilter }), getCategories(),
      ]);
      setReport({ summary, categories: categoryData.expenseCategories || categoryData.categories || [], incomeCategories: categoryData.incomeCategories || [], monthly: (monthlyData.monthly || []).slice(-6), paymentMethods: paymentData.paymentMethods || [], comparison: comparison || null, transactions: transactions.transactions || [] });
      setCategories(userCategories.categories || []);
    } catch (requestError) {
      if (requestError.status === 401 || requestError.status === 403) return onUnauthorized();
      setError('Unable to load report data.');
    } finally { setLoading(false); }
  }, [categoryFilter, onUnauthorized, period, transactionType]);

  useEffect(() => { loadReports(); }, [loadReports]);

  const visibleTransactions = report?.transactions || [];
  const currency = JSON.parse(localStorage.getItem('spendwiseUser') || '{}').currency || 'INR';
  const categoryMap = new Map(categories.map((category) => [String(category._id), category]));
  const insights = useMemo(() => {
    if (!report) return [];
    const items = [];
    const topCategory = report.categories[0];
    const topPayment = report.paymentMethods[0];
    if (topCategory) items.push(`${topCategory.categoryName} was your highest spending category this month.`);
    if (topPayment) items.push(`${topPayment.paymentMethod} was your largest payment method for expenses.`);
    const change = report.comparison?.changes?.expense;
    if (change && change.percentage !== null && change.percentage !== undefined) items.push(`Your expenses ${change.amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(change.percentage)}% compared with the previous month.`);
    return items;
  }, [report]);

  const downloadExcel = () => {
    if (!visibleTransactions.length) return;
    const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;
    const rows = [['Date', 'Title', 'Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Notes'], ...visibleTransactions.map((transaction) => [formatDate(transaction.date), transaction.title, transaction.description, categoryMap.get(String(transaction.categoryId))?.name || 'Unknown', transaction.type, transaction.amount, transaction.paymentMethod, transaction.notes])];
    const blob = new Blob([rows.map((row) => row.map(escape).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SpendWise_Report_${monthLabel(selectedDate).replace(' ', '_')}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    if (!report) return;

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const margin = 16;
    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 18;

    const addLine = (text, size = 10, bold = false) => {
      if (y > 276) {
        pdf.addPage();
        y = 18;
      }
      pdf.setFontSize(size);
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(String(text), pageWidth - margin * 2);
      pdf.text(lines, margin, y);
      y += lines.length * (size <= 10 ? 5 : 6) + 2;
    };

    pdf.setTextColor(15, 26, 42);
    addLine('SpendWise Report', 18, true);
    addLine(monthLabel(selectedDate), 11);
    addLine(`Period: ${period.startDate} to ${period.endDate}`);
    y += 3;
    addLine('Summary', 13, true);
    addLine(`Total income: ${money(report.summary.totalIncome, currency)}`);
    addLine(`Total expenses: ${money(report.summary.totalExpense, currency)}`);
    addLine(`Balance: ${money(report.summary.balance, currency)}`);
    addLine(`Transactions: ${report.summary.totalTransactions}`);

    addLine('Category analysis', 13, true);
    report.categories.forEach((item) => addLine(`${item.categoryName}: ${money(item.totalAmount, currency)} (${item.transactionCount} transactions)`));
    if (!report.categories.length) addLine('No category data available.');

    addLine('Payment method analysis', 13, true);
    report.paymentMethods.forEach((item) => addLine(`${item.paymentMethod}: ${money(item.totalAmount, currency)}`));
    if (!report.paymentMethods.length) addLine('No payment method data available.');

    addLine('Monthly trend', 13, true);
    report.monthly.forEach((item) => addLine(`${item.month}: income ${money(item.income, currency)}, expenses ${money(item.expense, currency)}, balance ${money((Number(item.income || 0) - Number(item.expense || 0)), currency)}`));

    if (insights.length) {
      addLine('Financial insights', 13, true);
      insights.forEach((insight) => addLine(insight));
    }

    addLine('Transactions', 13, true);
    visibleTransactions.forEach((transaction) => addLine(`${formatDate(transaction.date)} | ${transaction.title} | ${categoryMap.get(String(transaction.categoryId))?.name || 'Unknown'} | ${transaction.type} | ${money(transaction.amount, currency)} | ${transaction.paymentMethod}`));

    pdf.save(`SpendWise_Report_${monthLabel(selectedDate).replace(' ', '_')}.pdf`);
  };

  useEffect(() => {
    const closeMenu = (event) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target)) setDownloadMenuOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setDownloadMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    document.addEventListener('touchstart', closeMenu);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('mousedown', closeMenu);
      document.removeEventListener('touchstart', closeMenu);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, []);

  if (loading) return <div className="report-state"><div className="dashboard-spinner" /><h2>Loading your reports</h2><p>Preparing your selected period analysis.</p></div>;
  if (error) return <div className="report-state report-error"><h2>Unable to load report data.</h2><p>Try again to refresh this period.</p><button type="button" className="button button-secondary" onClick={loadReports}><RefreshCw size={15} /> Retry</button></div>;

  const hasTransactions = report.summary.totalTransactions > 0;
  const comparison = report.comparison?.changes;
  const currentMonth = new Date(); currentMonth.setDate(1);
  const canGoNext = selectedDate < currentMonth;

  return <div className="reports-page reports-detailed-page">
    <div className="reports-intro"><div><span className="eyebrow">Analysis</span><h2>Reports</h2><p>Understand your income, expenses, and spending patterns.</p></div><div className="report-period"><button type="button" aria-label="Previous month" onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}><ArrowLeft size={16} /></button><strong>{monthLabel(selectedDate)}</strong><button type="button" aria-label="Next month" disabled={!canGoNext} onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}><ArrowRight size={16} /></button></div></div>
    {!hasTransactions ? <Card muted><CardBody><div className="report-empty"><Wallet size={24} aria-hidden="true" /><h3>No transactions for this period.</h3><p>No financial data available yet for {monthLabel(selectedDate)}.</p></div></CardBody></Card> : <>
      <div className="report-stat-grid"><ReportStatCard label="Total income" value={money(report.summary.totalIncome, currency)} tone="income" detail="Selected month" /><ReportStatCard label="Total expenses" value={money(report.summary.totalExpense, currency)} tone="expense" detail="Selected month" /><ReportStatCard label="Balance" value={money(report.summary.balance, currency)} tone={report.summary.balance >= 0 ? 'balance' : 'negative'} detail="Income minus expenses" /><ReportStatCard label="Transactions" value={report.summary.totalTransactions} tone="neutral" detail="Selected month" /></div>
      <div className="comparison-section"><h3>Compared with Previous Month</h3><div className="comparison-grid">{[['Income', report.comparison?.current?.income, comparison?.income, 'income'], ['Expenses', report.comparison?.current?.expense, comparison?.expense, 'expense'], ['Balance', report.comparison?.current?.balance, comparison?.balance, 'balance']].map(([label, value, change, tone]) => <div className="comparison-card" key={label}><span>{label}</span><strong>{money(value, currency)}</strong>{change?.percentage !== null && change?.percentage !== undefined ? <small className={change.amount >= 0 ? `change-${tone}` : 'change-down'}>{change.amount >= 0 ? '↑' : '↓'} {Math.abs(change.percentage)}%</small> : <small>No previous baseline</small>}</div>)}</div></div>
      <div className="reports-grid"><Card><CardHeader title="Expense by category" description="Ranked spending for the selected month" /><CardBody><CategoryReport categories={report.categories.map((item) => ({ ...item, icon: categoryMap.get(String(item.categoryId))?.icon || item.icon }))} currency={currency} /></CardBody></Card><Card><CardHeader title="Spending by Payment Method" description="Expense totals by method" /><CardBody><div className="payment-report-list">{report.paymentMethods.length ? report.paymentMethods.map((item) => <div className="payment-report-row" key={item.paymentMethod}><span>{item.paymentMethod}</span><strong>{money(item.totalAmount, currency)}</strong><small>{report.summary.totalExpense ? Math.round((item.totalAmount / report.summary.totalExpense) * 100) : 0}%</small></div>) : <p className="report-muted">No payment method data available.</p>}</div></CardBody></Card></div>
      <Card><CardHeader title="Monthly trend" description="Historical income, expenses, and balance" /><CardBody><MonthlyReport monthly={report.monthly} currency={currency} /></CardBody></Card>
      {insights.length > 0 && <Card><CardHeader title="Financial Insights" description="Signals from your real report data" /><CardBody><div className="insight-list">{insights.map((insight) => <p key={insight}>{insight}</p>)}</div></CardBody></Card>}
      <Card><CardHeader title="Transaction report" description={`${visibleTransactions.length} transactions in ${monthLabel(selectedDate)}`} action={<div className="report-download-menu" ref={downloadMenuRef}><button type="button" className="button button-secondary" disabled={!visibleTransactions.length} onClick={() => setDownloadMenuOpen((open) => !open)} aria-expanded={downloadMenuOpen}><Download size={15} /> Download Report</button>{downloadMenuOpen && <div className="report-download-popover" role="menu"><button type="button" role="menuitem" onClick={() => { setDownloadMenuOpen(false); downloadExcel(); }}>Download Excel</button><button type="button" role="menuitem" onClick={() => { setDownloadMenuOpen(false); downloadPdf(); }}>Download PDF</button></div>}</div>} /><CardBody><div className="report-filters"><button type="button" className={!transactionType ? 'is-active' : ''} onClick={() => setTransactionType('')}>All</button><button type="button" className={transactionType === 'income' ? 'is-active' : ''} onClick={() => setTransactionType('income')}>Income</button><button type="button" className={transactionType === 'expense' ? 'is-active' : ''} onClick={() => setTransactionType('expense')}>Expense</button><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter report by category"><option value="">All categories</option>{categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}</select></div>{visibleTransactions.length ? <div className="report-transaction-table"><table><thead><tr><th>Date</th><th>Title</th><th>Category</th><th>Type</th><th>Payment</th><th>Amount</th></tr></thead><tbody>{visibleTransactions.map((transaction) => <tr key={transaction._id}><td>{formatDate(transaction.date)}</td><td>{transaction.title}</td><td>{categoryMap.get(String(transaction.categoryId))?.name || 'Unknown'}</td><td><span className={`type-pill type-${transaction.type}`}>{transaction.type}</span></td><td>{transaction.paymentMethod}</td><td className={transaction.type === 'income' ? 'amount-income' : 'amount-expense'}>{transaction.type === 'income' ? '+' : '-'}{money(transaction.amount, currency)}</td></tr>)}</tbody></table></div> : <p className="report-muted">No transactions for this period.</p>}</CardBody></Card>
    </>}
  </div>;
}

export default ReportsPage;
