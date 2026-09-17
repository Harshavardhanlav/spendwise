import React, { useState } from 'react';
import {
  ArrowUpRightIcon,
  DownloadIcon,
  FilterIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon } from
'lucide-react';
import { Button, IconButton } from '../ui/Button';
import { Field } from '../ui/Field';
import { AmountInput, Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { DateField, DateRangeField } from '../ui/DateField';
import { SearchInput } from '../ui/SearchInput';
import { Card, CardBody, CardFooter, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { Dropdown, MenuItem, MenuLabel, MenuSeparator } from '../ui/Dropdown';
import { Tabs } from '../ui/Tabs';
import { Modal } from '../ui/Modal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { ToastCard, useToast } from '../ui/Toast';
import { Tooltip } from '../ui/Tooltip';
import { Avatar } from '../ui/Avatar';
import { Pagination } from '../ui/Pagination';
import { AmountText } from '../finance/AmountText';
import { PaymentMethodTag, TransactionStatusBadge } from '../finance/PaymentMethodTag';
import { sampleTransactions } from '../../data/sampleFinance';
import { formatDateShort } from '../../utils/format';
import { PAYMENT_METHODS } from '../../types/finance';
import { DocBlock, DocSection, Row } from './Showcase';

export function ComponentsSection() {
  const { toast } = useToast();
  const [tab, setTab] = useState('all');
  const [segment, setSegment] = useState('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(2);

  return (
    <div className="flex flex-col gap-12">
      <DocSection
        title="Actions"
        description="One primary action per view, in near-black. Secondary actions are outlined, tertiary are ghosts. Destructive actions are red and always confirmed.">
        
        <DocBlock title="Buttons">
          <Row label="Variants">
            <Button>Add transaction</Button>
            <Button variant="secondary">Export</Button>
            <Button variant="ghost">Cancel</Button>
            <Button variant="danger">Delete</Button>
            <Button variant="link">View all</Button>
          </Row>
          <Row label="Sizes">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </Row>
          <Row label="With icons">
            <Button iconLeft={<PlusIcon className="h-4 w-4" />}>Add transaction</Button>
            <Button variant="secondary" iconLeft={<DownloadIcon className="h-4 w-4" />}>
              Export CSV
            </Button>
            <Button variant="secondary" iconRight={<ArrowUpRightIcon className="h-4 w-4" />}>
              Open report
            </Button>
          </Row>
          <Row label="States">
            <Button>Default</Button>
            <Button loading>Saving</Button>
            <Button disabled>Disabled</Button>
            <IconButton label="Edit" variant="secondary">
              <PencilIcon className="h-4 w-4" />
            </IconButton>
            <IconButton label="More options">
              <MoreVerticalIcon className="h-4 w-4" />
            </IconButton>
          </Row>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Inputs"
        description="Every control is 36px tall by default so rows of filters line up exactly. Labels sit above the field, validation sits below it, and errors are never communicated by a red border alone.">
        
        <DocBlock title="Text, amount and multiline">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Title" htmlFor="ds-title" required>
              <Input id="ds-title" placeholder="e.g. Blue Tokai Coffee" />
            </Field>
            <Field label="Amount" htmlFor="ds-amount" required hint="Numbers are right-aligned and tabular.">
              <AmountInput id="ds-amount" defaultValue="2,149" />
            </Field>
            <Field label="Date" htmlFor="ds-date" required>
              <DateField id="ds-date" defaultValue="2026-09-11" />
            </Field>
            <Field label="Category" htmlFor="ds-cat" required>
              <Select
                id="ds-cat"
                options={[
                { value: 'food', label: 'Food & Dining' },
                { value: 'transport', label: 'Transport' },
                { value: 'utilities', label: 'Utilities' }]
                }
                defaultValue="food" />
              
            </Field>
            <Field label="Payment method" htmlFor="ds-method" required>
              <Select
                id="ds-method"
                options={PAYMENT_METHODS.map((method) => ({ value: method, label: method }))}
                defaultValue="UPI" />
              
            </Field>
            <Field label="Notes" htmlFor="ds-notes" optional>
              <Input id="ds-notes" placeholder="Anything worth remembering" />
            </Field>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Error state" htmlFor="ds-err" error="Amount must be greater than 0.">
              <AmountInput id="ds-err" state="error" defaultValue="0" />
            </Field>
            <Field label="Success state" htmlFor="ds-ok" success="Category name is available.">
              <Input id="ds-ok" state="success" defaultValue="Groceries" />
            </Field>
            <Field label="Disabled" htmlFor="ds-dis" hint="Currency is set in Settings.">
              <Input id="ds-dis" disabled defaultValue="INR — Indian Rupee" />
            </Field>
          </div>

          <div className="mt-6 max-w-xl">
            <Field label="Description" htmlFor="ds-desc" optional>
              <Textarea id="ds-desc" placeholder="Add context for this transaction" />
            </Field>
          </div>
        </DocBlock>

        <DocBlock title="Search and date range" note="The filter bar pattern used on Transactions and Reports.">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="lg:w-80">
              <SearchInput
                placeholder="Search by title or note"
                value={search}
                shortcutHint="⌘K"
                onChange={(event) => setSearch(event.target.value)}
                onClear={() => setSearch('')} />
              
            </div>
            <DateRangeField from="2026-09-01" to="2026-09-30" />
            <Button variant="secondary" iconLeft={<FilterIcon className="h-4 w-4" />}>
              Filters
              <Badge tone="neutral" size="sm">
                2
              </Badge>
            </Button>
          </div>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Containers"
        description="Cards are used to hold a distinct answer, not to wrap everything. When content only needs separating, a heading and whitespace do it with less noise.">
        
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader
              title="Recent activity"
              description="Last 6 transactions"
              action={
              <Button variant="link" size="sm">
                  View all
                </Button>
              } />
            
            <CardBody>
              <p className="text-body text-ink-600">
                Card header, body and footer are separate primitives so footers can be pinned with
                <code className="mx-1 rounded bg-ink-100 px-1 font-mono text-[11px]">mt-auto</code>
                and stay aligned across a row.
              </p>
            </CardBody>
            <CardFooter>
              <span className="text-caption text-ink-500">Updated 2 min ago</span>
              <Button variant="secondary" size="sm">
                Refresh
              </Button>
            </CardFooter>
          </Card>

          <Card tone="flat" padding="md" className="flex flex-col">
            <p className="text-label text-ink-600">Flat</p>
            <p className="mt-2 text-body text-ink-600">
              No shadow. Used when cards sit inside another surface, such as inside a modal.
            </p>
          </Card>

          <Card tone="sunken" padding="md" className="flex flex-col">
            <p className="text-label text-ink-600">Sunken</p>
            <p className="mt-2 text-body text-ink-600">
              An inset well for secondary or read-only content — summaries, review steps, totals.
            </p>
          </Card>
        </div>
      </DocSection>

      <DocSection
        title="Badges, tabs and menus"
        description="Badges label; they never act. Tabs switch views within a page. Menus hold the actions that don't earn a permanent button.">
        
        <DocBlock title="Badges">
          <Row label="Soft">
            <Badge tone="neutral">Draft</Badge>
            <Badge tone="income" dot>
              Income
            </Badge>
            <Badge tone="expense" dot>
              Expense
            </Badge>
            <Badge tone="warning" dot>
              Pending
            </Badge>
            <Badge tone="info" dot>
              Scheduled
            </Badge>
          </Row>
          <Row label="Outline">
            <Badge variant="outline">UPI</Badge>
            <Badge variant="outline" tone="accent">
              Recurring
            </Badge>
            <PaymentMethodTag method="Credit Card" />
          </Row>
          <Row label="Solid">
            <Badge variant="solid">12</Badge>
            <Badge variant="solid" tone="expense">
              Over budget
            </Badge>
          </Row>
        </DocBlock>

        <div className="grid gap-6 lg:grid-cols-2">
          <DocBlock title="Tabs" note="Underline for page sections, segmented for in-card filters.">
            <Tabs
              items={[
              { id: 'all', label: 'All', count: 128 },
              { id: 'income', label: 'Income', count: 14 },
              { id: 'expense', label: 'Expenses', count: 114 }]
              }
              value={tab}
              onChange={setTab} />
            
            <div className="mt-5">
              <Tabs
                variant="segmented"
                items={[
                { id: 'week', label: 'Week' },
                { id: 'month', label: 'Month' },
                { id: 'year', label: 'Year' }]
                }
                value={segment}
                onChange={setSegment} />
              
            </div>
          </DocBlock>

          <DocBlock title="Dropdown, tooltip, avatar">
            <div className="flex flex-wrap items-center gap-4">
              <Dropdown
                trigger={
                <Button variant="secondary" iconRight={<MoreVerticalIcon className="h-4 w-4" />}>
                    Row actions
                  </Button>
                }>
                
                {(close) =>
                <>
                    <MenuLabel>Transaction</MenuLabel>
                    <MenuItem icon={<PencilIcon className="h-4 w-4" />} onClick={close}>
                      Edit
                    </MenuItem>
                    <MenuItem icon={<DownloadIcon className="h-4 w-4" />} onClick={close}>
                      Export receipt
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem icon={<TrashIcon className="h-4 w-4" />} danger onClick={close}>
                      Delete
                    </MenuItem>
                  </>
                }
              </Dropdown>

              <Tooltip content="Net of all income minus all expenses since you joined.">
                <Button variant="ghost" size="sm">
                  Hover or focus me
                </Button>
              </Tooltip>

              <div className="flex items-center gap-2">
                <Avatar name="Harsha Vardhan" size="sm" />
                <Avatar name="Priya Nair" />
                <Avatar name="Arjun Rao" size="lg" />
              </div>
            </div>
          </DocBlock>
        </div>
      </DocSection>

      <DocSection
        title="Ledger table"
        description="The workhorse of the Transactions screen. Amounts are right-aligned and tabular, the header is micro-caps, and rows are separated by hairlines — no zebra striping, which would fight the income/expense colour language.">
        
        <Card className="overflow-hidden">
          <Table>
            <THead>
              <TR>
                <TH sortable sortDirection="desc">
                  Date
                </TH>
                <TH>Transaction</TH>
                <TH>Category</TH>
                <TH className="hidden md:table-cell">Method</TH>
                <TH className="hidden sm:table-cell">Status</TH>
                <TH align="right" sortable>
                  Amount
                </TH>
                <TH align="right" className="w-12">
                  <span className="sr-only">Actions</span>
                </TH>
              </TR>
            </THead>
            <TBody>
              {sampleTransactions.map((transaction, index) =>
              <TR key={transaction.id} interactive selected={index === 1}>
                  <TD muted className="whitespace-nowrap tnum">
                    {formatDateShort(transaction.date)}
                  </TD>
                  <TD className="font-medium">{transaction.title}</TD>
                  <TD muted>{transaction.category}</TD>
                  <TD className="hidden md:table-cell">
                    <PaymentMethodTag method={transaction.paymentMethod} compact />
                  </TD>
                  <TD className="hidden sm:table-cell">
                    <TransactionStatusBadge status={transaction.status} />
                  </TD>
                  <TD align="right">
                    <AmountText value={transaction.amount} type={transaction.type} size="sm" signed />
                  </TD>
                  <TD align="right">
                    <IconButton label={`Actions for ${transaction.title}`} size="sm">
                      <MoreVerticalIcon className="h-4 w-4" />
                    </IconButton>
                  </TD>
                </TR>
              )}
            </TBody>
          </Table>
          <div className="border-t border-line-subtle">
            <Pagination page={page} pageCount={6} totalItems={128} onChange={setPage} />
          </div>
        </Card>
      </DocSection>

      <DocSection
        title="Overlays and feedback"
        description="Dialogs dock to the bottom of the screen on mobile and centre on desktop. Toasts confirm what happened and disappear; they never carry the only copy of important information.">
        
        <DocBlock title="Triggers">
          <Row>
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open form dialog
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
              Open confirmation
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
              toast({ tone: 'success', title: 'Transaction saved', description: '₹2,149 · Shopping · Credit Card' })
              }>
              
              Trigger toast
            </Button>
          </Row>
        </DocBlock>

        <DocBlock title="Toast tones" note="Static previews — all four variants side by side.">
          <div className="grid gap-3 lg:grid-cols-2">
            <ToastCard toast={{ tone: 'success', title: 'Transaction saved', description: '₹2,149 · Shopping' }} />
            <ToastCard
              toast={{ tone: 'error', title: 'Couldn’t save transaction', description: 'Check your connection and retry.' }} />
            
            <ToastCard toast={{ tone: 'warning', title: 'You’re over your Food budget', description: '₹18,420 of ₹15,000' }} />
            <ToastCard toast={{ tone: 'info', title: 'Session expires in 5 minutes' }} />
          </div>
        </DocBlock>
      </DocSection>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add transaction"
        description="Logged against your September ledger."
        footer={
        <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
            onClick={() => {
              setModalOpen(false);
              toast({ tone: 'success', title: 'Transaction saved' });
            }}>
            
              Save transaction
            </Button>
          </>
        }>
        
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Amount" htmlFor="m-amount" required>
              <AmountInput id="m-amount" placeholder="0" />
            </Field>
            <Field label="Date" htmlFor="m-date" required>
              <DateField id="m-date" defaultValue="2026-09-11" />
            </Field>
          </div>
          <Field label="Title" htmlFor="m-title" required>
            <Input id="m-title" placeholder="e.g. Metro card top-up" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" htmlFor="m-cat" required>
              <Select
                id="m-cat"
                options={[
                { value: 'transport', label: 'Transport' },
                { value: 'food', label: 'Food & Dining' }]
                }
                defaultValue="transport" />
              
            </Field>
            <Field label="Payment method" htmlFor="m-method" required>
              <Select
                id="m-method"
                options={PAYMENT_METHODS.map((method) => ({ value: method, label: method }))}
                defaultValue="UPI" />
              
            </Field>
          </div>
          <Field label="Notes" htmlFor="m-notes" optional>
            <Textarea id="m-notes" placeholder="Anything worth remembering" />
          </Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false);
          toast({ tone: 'success', title: 'Transaction deleted' });
        }}
        title="Delete this transaction?"
        message="“Amazon — desk lamp” (₹2,149) will be removed from your September ledger and your totals will be recalculated. This can’t be undone." />
      
    </div>);

}