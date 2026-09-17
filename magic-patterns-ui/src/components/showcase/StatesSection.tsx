import React from 'react';
import { InboxIcon, PlusIcon, SearchXIcon, ShapesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { Input } from '../ui/Input';
import { Field } from '../ui/Field';
import {
  EmptyState,
  ErrorState,
  InlineAlert,
  SkeletonStatCard,
  SkeletonTableRows,
  Spinner } from
'../ui/States';
import { DocBlock, DocSection } from './Showcase';

const interactionStates = [
{ name: 'Default', desc: 'Resting. Hairline border, surface fill.' },
{ name: 'Hover', desc: 'Fill darkens one step. 120ms, colours only.' },
{ name: 'Focus', desc: '2px accent ring, 2px offset. Keyboard-visible, always.' },
{ name: 'Active', desc: 'Fill returns to the base tone — a pressed feel.' },
{ name: 'Disabled', desc: '50% opacity, no pointer events, not focusable.' },
{ name: 'Loading', desc: 'Spinner replaces the leading icon; width is held.' }];


export function StatesSection() {
  return (
    <div className="flex flex-col gap-12">
      <DocSection
        title="Interaction states"
        description="Every interactive element implements the same six states with the same timings. Transitions name their properties and never exceed 300ms — press feedback is 120ms, overlays 160–240ms.">
        
        <DocBlock title="The six states">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {interactionStates.map((state) =>
            <div key={state.name} className="rounded-md border border-line-subtle bg-sunken p-4">
                <p className="text-label text-ink-900">{state.name}</p>
                <p className="mt-1 text-caption text-ink-600">{state.desc}</p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button variant="secondary">Default</Button>
            <Button variant="secondary" className="bg-ink-50 border-line-strong">
              Hover
            </Button>
            <Button variant="secondary" className="ring-2 ring-accent-500 ring-offset-2">
              Focus
            </Button>
            <Button variant="secondary" className="bg-ink-100">
              Active
            </Button>
            <Button variant="secondary" disabled>
              Disabled
            </Button>
            <Button variant="secondary" loading>
              Loading
            </Button>
          </div>
        </DocBlock>

        <DocBlock title="Form states" note="Validation is icon + colour + text. Never colour alone.">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="Default" htmlFor="s-1">
              <Input id="s-1" placeholder="Placeholder" />
            </Field>
            <Field label="Focused" htmlFor="s-2">
              <Input id="s-2" defaultValue="Groceries" className="border-accent-500 ring-2 ring-accent-100" />
            </Field>
            <Field label="Error" htmlFor="s-3" error="Enter an amount greater than 0.">
              <Input id="s-3" state="error" defaultValue="0" />
            </Field>
            <Field label="Disabled" htmlFor="s-4" hint="Set in Settings.">
              <Input id="s-4" disabled defaultValue="INR" />
            </Field>
          </div>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Loading"
        description="Skeletons mirror the exact shape of the content they replace, so nothing jumps when data lands. A loading state must be shorter than what it covers — no multi-second theatre.">
        
        <div className="grid gap-6 lg:grid-cols-2">
          <DocBlock title="Skeleton stat cards" bare>
            <div className="grid gap-4 sm:grid-cols-2">
              <SkeletonStatCard />
              <SkeletonStatCard />
            </div>
          </DocBlock>

          <DocBlock title="Skeleton table" bare>
            <Card className="overflow-hidden">
              <div className="flex items-center gap-4 border-b border-line bg-sunken px-4 py-2.5">
                {['Date', 'Transaction', 'Category', 'Amount'].map((heading) =>
                <span key={heading} className="flex-1 text-overline uppercase text-ink-500">
                    {heading}
                  </span>
                )}
              </div>
              <SkeletonTableRows rows={4} columns={4} />
            </Card>
          </DocBlock>
        </div>

        <DocBlock title="Inline loading">
          <div className="flex flex-wrap items-center gap-6">
            <span className="flex items-center gap-2 text-body text-ink-600">
              <Spinner size="sm" /> Refreshing summary
            </span>
            <Button loading>Saving transaction</Button>
            <span className="flex items-center gap-2 text-body text-ink-600">
              <Spinner /> Loading report
            </span>
          </div>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Empty and error"
        description="An empty state says what will appear here and offers the action that fills it. An error says what failed, in plain language, and offers a way forward — never a status code.">
        
        <div className="grid gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader title="First-run empty" />
            <EmptyState
              icon={<InboxIcon className="h-5 w-5" />}
              title="No transactions yet"
              description="Log your first income or expense and your balance, categories and trends will start filling in."
              action={<Button iconLeft={<PlusIcon className="h-4 w-4" />}>Add transaction</Button>} />
            
          </Card>

          <Card>
            <CardHeader title="No results" />
            <EmptyState
              icon={<SearchXIcon className="h-5 w-5" />}
              title="No transactions match"
              description="No entries between 1–30 Sep in “Transport” over ₹5,000. Try widening the date range."
              action={
              <Button variant="secondary" size="sm">
                  Clear filters
                </Button>
              } />
            
          </Card>

          <Card>
            <CardHeader title="Failed to load" />
            <ErrorState onRetry={() => undefined} />
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <InlineAlert tone="warning" title="You’re over your Food & Dining budget">
            ₹18,420 spent of a ₹15,000 limit, with 19 days left in the month.
          </InlineAlert>
          <InlineAlert
            tone="error"
            title="Couldn’t refresh your summary"
            action={
            <Button variant="secondary" size="sm">
                Retry
              </Button>
            }>
            
            Showing figures from 12 minutes ago.
          </InlineAlert>
        </div>

        <DocBlock title="Empty state, standalone" bare>
          <Card>
            <EmptyState
              icon={<ShapesIcon className="h-5 w-5" />}
              title="No categories yet"
              description="Categories group your spending so reports can tell you where the money actually goes. Start with a few broad ones — you can always split them later."
              action={<Button iconLeft={<PlusIcon className="h-4 w-4" />}>Create category</Button>}
              secondaryAction={<Button variant="secondary">Use suggested set</Button>} />
            
          </Card>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Accessibility rules"
        description="These are constraints the system enforces, not aspirations.">
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
          {
            title: 'Contrast',
            body: 'Body text is ink-900 (16:1) or ink-600 (5.6:1). ink-400 is placeholder-only and never carries content.'
          },
          {
            title: 'Never colour alone',
            body: 'Income/expense pair hue with a sign and an arrow. Status pairs hue with a dot and a word.'
          },
          {
            title: 'Focus is always visible',
            body: 'A 2px accent ring with 2px offset on every control. The UA outline is replaced, never removed.'
          },
          {
            title: 'Keyboard complete',
            body: 'Dialogs trap Tab and close on Escape, menus close on Escape and outside click, focus returns to the trigger.'
          },
          {
            title: 'Announced errors',
            body: 'Field errors use role="alert" and aria-invalid; toasts use role="status" with aria-live="polite".'
          },
          {
            title: 'Reduced motion',
            body: 'prefers-reduced-motion is honoured globally — all transitions collapse to near-zero.'
          }].
          map((rule) =>
          <div key={rule.title} className="rounded-lg border border-line-subtle bg-surface p-4 shadow-xs">
              <p className="text-cardtitle text-ink-900">{rule.title}</p>
              <p className="mt-1.5 text-body text-ink-600">{rule.body}</p>
            </div>
          )}
        </div>
      </DocSection>
    </div>);

}