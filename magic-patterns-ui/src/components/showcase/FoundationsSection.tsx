import React from 'react';
import { cn } from '../../utils/cn';
import { DocBlock, DocSection, Token } from './Showcase';

interface SwatchDef {
  name: string;
  value: string;
  usage: string;
  /** Text colour to render on top of the swatch for the contrast sample. */
  on?: 'light' | 'dark';
}

const groups: {title: string;note: string;swatches: SwatchDef[];}[] = [
{
  title: 'Surfaces',
  note: 'Three levels only. Depth comes from hairlines, not shadows.',
  swatches: [
  { name: 'canvas', value: '#F5F6F8', usage: 'App background', on: 'light' },
  { name: 'surface', value: '#FFFFFF', usage: 'Cards, menus, sheets', on: 'light' },
  { name: 'sunken', value: '#FAFBFC', usage: 'Table headers, wells', on: 'light' },
  { name: 'ink-900', value: '#0F1A2A', usage: 'Sidebar, primary stat', on: 'dark' }]

},
{
  title: 'Ink — text & primary action',
  note: 'Near-black is the brand colour. It carries primary buttons and the sidebar.',
  swatches: [
  { name: 'ink-900', value: '#0F1A2A', usage: 'Primary text · 16.1:1', on: 'dark' },
  { name: 'ink-600', value: '#5A6474', usage: 'Secondary text · 5.6:1', on: 'dark' },
  { name: 'ink-400', value: '#8B95A5', usage: 'Placeholder · 3.1:1 — never body copy', on: 'dark' },
  { name: 'line', value: '#E1E4E9', usage: 'Default hairline', on: 'light' },
  { name: 'line-subtle', value: '#EDEFF2', usage: 'Row dividers', on: 'light' }]

},
{
  title: 'Accent — interactive',
  note: 'Blue means "you can act on this". It is never used for money.',
  swatches: [
  { name: 'accent-500', value: '#2B5FD9', usage: 'Links, focus ring, selection', on: 'dark' },
  { name: 'accent-600', value: '#2350BC', usage: 'Hover', on: 'dark' },
  { name: 'accent-50', value: '#EEF3FE', usage: 'Selected row background', on: 'light' }]

},
{
  title: 'Money in / money out',
  note: 'Reserved exclusively for income and expense. Never decorative.',
  swatches: [
  { name: 'income', value: '#12734A', usage: 'Income amounts · 5.6:1', on: 'dark' },
  { name: 'income-bg', value: '#E9F5EF', usage: 'Income badge fill', on: 'light' },
  { name: 'expense', value: '#B42318', usage: 'Expense amounts · 5.9:1', on: 'dark' },
  { name: 'expense-bg', value: '#FDECEA', usage: 'Expense badge fill', on: 'light' }]

},
{
  title: 'Status',
  note: 'Warning and info never carry financial meaning — only system state.',
  swatches: [
  { name: 'warning', value: '#A15C07', usage: 'Pending, over budget', on: 'dark' },
  { name: 'warning-bg', value: '#FEF4E6', usage: 'Warning banner', on: 'light' },
  { name: 'info', value: '#1F5FA8', usage: 'Scheduled, informational', on: 'dark' },
  { name: 'info-bg', value: '#EAF2FB', usage: 'Info banner', on: 'light' }]

},
{
  title: 'Data visualisation',
  note: 'Muted categorical ramp — distinguishable without shouting.',
  swatches: [
  { name: 'viz-1', value: '#2B5FD9', usage: 'Series 1', on: 'dark' },
  { name: 'viz-2', value: '#0E8C7F', usage: 'Series 2', on: 'dark' },
  { name: 'viz-3', value: '#7A5AF8', usage: 'Series 3', on: 'dark' },
  { name: 'viz-4', value: '#C77700', usage: 'Series 4', on: 'dark' },
  { name: 'viz-5', value: '#B4477B', usage: 'Series 5', on: 'dark' },
  { name: 'viz-6', value: '#3F8A2E', usage: 'Series 6', on: 'dark' }]

}];


function Swatch({ swatch }: {swatch: SwatchDef;}) {
  return (
    <div className="min-w-0">
      <div
        className="flex h-16 items-end rounded-md border border-line-subtle p-2"
        style={{ backgroundColor: swatch.value }}>
        
        <span className={cn('text-[11px] font-medium', swatch.on === 'dark' ? 'text-white' : 'text-ink-600')}>
          {swatch.value}
        </span>
      </div>
      <p className="mt-2 font-mono text-[11px] text-ink-900">{swatch.name}</p>
      <p className="mt-0.5 text-[11px] leading-tight text-ink-500">{swatch.usage}</p>
    </div>);

}

const typeSpecs = [
{ token: 'text-display', sample: 'Total balance', className: 'text-display', spec: '32 / 38 · 600 · −0.022em' },
{ token: 'text-title', sample: 'Transactions', className: 'text-title', spec: '24 / 32 · 600' },
{ token: 'text-section', sample: 'Spending by category', className: 'text-section', spec: '18 / 28 · 600' },
{ token: 'text-cardtitle', sample: 'Recent activity', className: 'text-cardtitle', spec: '15 / 22 · 600' },
{ token: 'text-body', sample: 'Blue Tokai Coffee — paid via UPI', className: 'text-body', spec: '14 / 22 · 400' },
{ token: 'text-label', sample: 'Payment method', className: 'text-label text-ink-700', spec: '13 / 18 · 500' },
{ token: 'text-caption', sample: 'Updated 2 minutes ago', className: 'text-caption text-ink-500', spec: '12 / 16 · 400' },
{
  token: 'text-overline',
  sample: 'CATEGORY',
  className: 'text-overline uppercase text-ink-500',
  spec: '11 · 600 · table headers only'
}];


const amountSpecs = [
{ token: 'text-amount-xl', sample: '₹4,86,320', className: 'text-amount-xl', spec: 'Hero balance' },
{ token: 'text-amount-lg', sample: '₹1,70,000', className: 'text-amount-lg', spec: 'Stat cards' },
{ token: 'text-amount-md', sample: '₹59,100', className: 'text-amount-md', spec: 'Panel totals' },
{ token: 'text-amount-sm', sample: '₹2,149', className: 'text-amount-sm', spec: 'Table cells, rows' }];


const spacingScale = [
{ token: '1 · 4px', use: 'Icon-to-label nudges' },
{ token: '2 · 8px', use: 'Inside badges, chip gaps' },
{ token: '3 · 12px', use: 'Table cell padding (y)' },
{ token: '4 · 16px', use: 'Mobile page gutter, form field gap' },
{ token: '5 · 20px', use: 'Card padding' },
{ token: '6 · 24px', use: 'Dashboard widget gap, section gap' },
{ token: '8 · 32px', use: 'Desktop page gutter, gap between sections' },
{ token: '12 · 48px', use: 'Page-level separation on large screens' }];


export function FoundationsSection() {
  return (
    <div className="flex flex-col gap-12">
      <DocSection
        title="Colour"
        description="Near-black ink is the brand and the primary action colour. Blue means interactive. Green and red are spent only on money — the moment they decorate something, they stop meaning anything. Every pairing below meets at least 4.5:1 against its intended background.">
        
        {groups.map((group) =>
        <DocBlock key={group.title} title={group.title} note={group.note}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {group.swatches.map((swatch) =>
            <Swatch key={swatch.name} swatch={swatch} />
            )}
            </div>
          </DocBlock>
        )}
      </DocSection>

      <DocSection
        title="Typography"
        description="One typeface — Inter — across the whole product. Hierarchy comes from size, weight and colour, not from a second font competing for attention. Every financial figure uses tabular numerals so digits align down a column and don't jitter as values change.">
        
        <DocBlock title="Interface scale" note="14px body. This is a dense data product, not a marketing page.">
          <div className="divide-y divide-line-subtle">
            {typeSpecs.map((spec) =>
            <div
              key={spec.token}
              className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
              
                <span className="w-40 shrink-0 font-mono text-[11px] text-ink-400">{spec.token}</span>
                <span className={cn('flex-1 text-ink-900', spec.className)}>{spec.sample}</span>
                <span className="shrink-0 text-caption text-ink-500">{spec.spec}</span>
              </div>
            )}
          </div>
        </DocBlock>

        <DocBlock
          title="Financial amounts"
          note="Tighter tracking, heavier weight, tabular figures — money should read differently from prose.">
          
          <div className="divide-y divide-line-subtle">
            {amountSpecs.map((spec) =>
            <div
              key={spec.token}
              className="flex flex-col gap-1 py-3.5 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-6">
              
                <span className="w-40 shrink-0 font-mono text-[11px] text-ink-400">{spec.token}</span>
                <span className={cn('tnum flex-1 text-ink-900', spec.className)}>{spec.sample}</span>
                <span className="shrink-0 text-caption text-ink-500">{spec.spec}</span>
              </div>
            )}
          </div>
        </DocBlock>
      </DocSection>

      <DocSection
        title="Spacing, radius & elevation"
        description="A 4px base grid. Every gap in the product is a step on this scale — nothing is eyeballed.">
        
        <DocBlock title="Spacing scale">
          <div className="flex flex-col gap-3">
            {spacingScale.map((step, index) =>
            <div key={step.token} className="flex items-center gap-4">
                <span className="w-20 shrink-0 font-mono text-[11px] text-ink-500">{step.token}</span>
                <span
                className="h-3 shrink-0 rounded-sm bg-accent-100"
                style={{ width: [4, 8, 12, 16, 20, 24, 32, 48][index] }} />
              
                <span className="text-caption text-ink-600">{step.use}</span>
              </div>
            )}
          </div>
        </DocBlock>

        <div className="grid gap-6 lg:grid-cols-2">
          <DocBlock title="Radius" note="Restrained. Nothing is a pill except badges' dots and avatars.">
            <div className="flex flex-wrap gap-4">
              {[
              { label: 'sm · 4px', cls: 'rounded-sm' },
              { label: 'default · 6px', cls: 'rounded' },
              { label: 'md · 8px', cls: 'rounded-md' },
              { label: 'lg · 10px', cls: 'rounded-lg' },
              { label: 'xl · 12px', cls: 'rounded-xl' }].
              map((item) =>
              <div key={item.label} className="text-center">
                  <div className={cn('h-14 w-14 border border-line bg-sunken', item.cls)} />
                  <p className="mt-2 text-[11px] text-ink-500">{item.label}</p>
                </div>
              )}
            </div>
          </DocBlock>

          <DocBlock title="Elevation" note="Shadows are almost invisible by design. Borders do the work.">
            <div className="flex flex-wrap gap-4">
              {[
              { label: 'xs · cards', cls: 'shadow-xs' },
              { label: 'sm · raised', cls: 'shadow-sm' },
              { label: 'pop · menus', cls: 'shadow-pop' },
              { label: 'modal', cls: 'shadow-modal' }].
              map((item) =>
              <div key={item.label} className="text-center">
                  <div className={cn('h-14 w-20 rounded-lg border border-line-subtle bg-surface', item.cls)} />
                  <p className="mt-2 text-[11px] text-ink-500">{item.label}</p>
                </div>
              )}
            </div>
          </DocBlock>
        </div>

        <DocBlock title="Layout rhythm" bare>
          <div className="flex flex-wrap gap-2">
            <Token name="page gutter" value="16px → 24px → 32px" />
            <Token name="section gap" value="24px" />
            <Token name="widget gap" value="16px → 24px" />
            <Token name="card padding" value="20px (16px on mobile)" />
            <Token name="form field gap" value="16px" />
            <Token name="table cell" value="16px × 12px" />
            <Token name="nav item" value="12px × 8px" />
            <Token name="max content width" value="1440px" />
          </div>
        </DocBlock>
      </DocSection>
    </div>);

}