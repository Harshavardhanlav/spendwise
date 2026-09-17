import React from 'react';
import {
  ArrowDownLeftIcon,
  ArrowUpRightIcon,
  ReceiptIcon,
  WalletMinimalIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { StatCard } from '../finance/StatCard';
import { AmountText } from '../finance/AmountText';
import { TransactionList } from '../finance/TransactionList';
import { CategorySpendList, IncomeExpenseBar } from '../finance/CategorySpendList';
import { MonthlyTrend, Sparkline } from '../finance/MonthlyTrend';
import { PaymentMethodTag, TransactionStatusBadge } from '../finance/PaymentMethodTag';
import {
  sampleCategorySpend,
  sampleMonthly,
  sampleSummary,
  sampleTransactions } from
'../../data/sampleFinance';
import { PAYMENT_METHODS } from '../../types/finance';
import { DocBlock, DocSection } from './Showcase';

export function PatternsSection() {
  return (
    <div className="flex flex-col gap-12">
      <DocSection
        title="Money, rendered"
        description="Income and expense are never separated by colour alone — every amount carries a hue, an explicit + or −, and a directional arrow. That keeps the ledger readable for colour-blind users and in greyscale.">
        
        <DocBlock title="Amount sizes and tones">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
            { label: 'Hero balance · xl', node: <AmountText value={486320} size="xl" /> },
            { label: 'Income · lg', node: <AmountText value={170000} type="income" size="lg" signed showIcon /> },
            { label: 'Expense · lg', node: <AmountText value={59100} type="expense" size="lg" signed showIcon /> },
            { label: 'Row amount · sm', node: <AmountText value={2149} type="expense" size="sm" signed /> }].
            map((item) =>
            <div key={item.label}>
                <p className="text-label text-ink-500">{item.label}</p>
                <div className="mt-1.5">{item.node}</div>
              </div>
            )}
          </div>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Summary metrics"
        description="A row of identically-weighted tiles is a filing cabinet, not a hierarchy. Exactly one metric per screen is primary — it gets the inverse surface and the largest figure. The rest support it.">
        
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total balance"
            value={sampleSummary.balance}
            emphasis="primary"
            delta={4.2}
            icon={<WalletMinimalIcon className="h-4 w-4" />} />
          
          <StatCard
            label="Income this month"
            value={sampleSummary.income}
            type="income"
            delta={11.8}
            icon={<ArrowDownLeftIcon className="h-4 w-4" />} />
          
          <StatCard
            label="Expenses this month"
            value={sampleSummary.expense}
            type="expense"
            delta={-11.4}
            icon={<ArrowUpRightIcon className="h-4 w-4" />} />
          
          <StatCard
            label="Transactions"
            value={84}
            unit="count"
            icon={<ReceiptIcon className="h-4 w-4" />}
            footer={<span className="text-caption text-ink-500">84 logged in September</span>} />
          
        </div>
      </DocSection>

      <DocSection
        title="Dashboard widgets"
        description="These are the reusable panels a dashboard is assembled from — each one answers a single question, sized according to how often it's asked.">
        
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
          <Card className="flex flex-col lg:col-span-2">
            <CardHeader
              title="Income vs expenses"
              description="Last 6 months"
              action={
              <Button variant="secondary" size="sm">
                  Full report
                </Button>
              } />
            
            <CardBody>
              <MonthlyTrend data={sampleMonthly} />
            </CardBody>
          </Card>

          <Card className="flex flex-col">
            <CardHeader title="This month" description="1–11 September" />
            <CardBody>
              <IncomeExpenseBar income={sampleSummary.income} expense={sampleSummary.expense} />
            </CardBody>
          </Card>

          <Card className="flex flex-col">
            <CardHeader
              title="Spending by category"
              description="September"
              action={
              <Button variant="link" size="sm">
                  View all
                </Button>
              } />
            
            <CardBody>
              <CategorySpendList categories={sampleCategorySpend} />
            </CardBody>
          </Card>

          <Card className="flex flex-col lg:col-span-2">
            <CardHeader
              title="Recent activity"
              description="Your last 6 transactions"
              action={
              <Button variant="link" size="sm">
                  View all
                </Button>
              } />
            
            <TransactionList transactions={sampleTransactions} showStatus />
          </Card>
        </div>
      </DocSection>

      <DocSection
        title="Trends, methods and status"
        description="Small reusable signals that appear across the dashboard, the ledger and reports.">
        
        <div className="grid gap-6 lg:grid-cols-3">
          <DocBlock title="Sparklines" note="Inline trend cue for cards and table rows.">
            <div className="flex flex-col gap-4">
              {[
              { label: 'Net worth', tone: 'accent' as const, values: [12, 18, 15, 22, 28, 26, 34] },
              { label: 'Income', tone: 'income' as const, values: [20, 22, 21, 24, 27, 31, 33] },
              { label: 'Expenses', tone: 'expense' as const, values: [30, 26, 29, 22, 24, 19, 17] }].
              map((item) =>
              <div key={item.label} className="flex items-center justify-between gap-4">
                  <span className="text-body text-ink-600">{item.label}</span>
                  <Sparkline values={item.values} tone={item.tone} />
                </div>
              )}
            </div>
          </DocBlock>

          <DocBlock title="Payment methods" note="Mapped 1:1 to the existing enum — no new values.">
            <div className="flex flex-wrap gap-2">
              {PAYMENT_METHODS.map((method) =>
              <PaymentMethodTag key={method} method={method} />
              )}
            </div>
          </DocBlock>

          <DocBlock title="Transaction status" note="Derived on the client for display; the model is unchanged.">
            <div className="flex flex-wrap gap-2">
              <TransactionStatusBadge status="cleared" />
              <TransactionStatusBadge status="scheduled" />
              <TransactionStatusBadge status="pending" />
              <TransactionStatusBadge status="failed" />
            </div>
            <p className="mt-4 text-caption text-ink-500">
              Each pairs a colour with a word and a dot, so status never depends on hue alone.
            </p>
          </DocBlock>
        </div>
      </DocSection>
    </div>);

}