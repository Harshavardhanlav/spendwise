import React, { useState } from 'react';
import { cn } from '../../utils/cn';
import { formatCompact, formatCurrency } from '../../utils/format';
import type { MonthPoint } from '../../data/sampleFinance';

/**
 * Monthly income vs expense. Hand-built SVG rather than a chart library:
 * the design system needs exact control of tick weight, label size and
 * colour, and this chart has one job.
 */
export function MonthlyTrend({ data, height = 180 }: {data: MonthPoint[];height?: number;}) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.flatMap((point) => [point.income, point.expense]));
  const ticks = [0, max / 2, max];

  return (
    <div>
      <div className="flex gap-3">
        {/* Y axis */}
        <div
          className="flex shrink-0 flex-col justify-between pb-6 text-right"
          style={{ height: height + 24 }}
          aria-hidden="true">
          
          {[...ticks].reverse().map((tick) =>
          <span key={tick} className="tnum text-[11px] leading-none text-ink-400">
              {formatCompact(tick)}
            </span>
          )}
        </div>

        {/* Plot */}
        <div className="relative min-w-0 flex-1">
          <div className="absolute inset-x-0 top-0 flex flex-col justify-between" style={{ height }} aria-hidden="true">
            {ticks.map((tick) =>
            <div key={tick} className="h-px w-full bg-line-subtle" />
            )}
          </div>

          <div className="relative flex items-end justify-between gap-2" style={{ height }}>
            {data.map((point, index) =>
            <div
              key={point.month}
              className="group relative flex h-full flex-1 items-end justify-center gap-1"
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}>
              
                <div
                className={cn(
                  'w-full max-w-[14px] rounded-t-sm bg-income transition-opacity duration-120 ease-out',
                  active !== null && active !== index && 'opacity-40'
                )}
                style={{ height: `${point.income / max * 100}%` }} />
              
                <div
                className={cn(
                  'w-full max-w-[14px] rounded-t-sm bg-expense transition-opacity duration-120 ease-out',
                  active !== null && active !== index && 'opacity-40'
                )}
                style={{ height: `${point.expense / max * 100}%` }} />
              

                {active === index &&
              <div className="pointer-events-none absolute bottom-[calc(100%+8px)] z-10 w-max animate-fade-in rounded-md bg-ink-900 px-2.5 py-2 shadow-pop">
                    <p className="text-[11px] font-semibold text-white">{point.month} 2026</p>
                    <p className="tnum mt-1 text-[11px] text-white/80">
                      In {formatCurrency(point.income)}
                    </p>
                    <p className="tnum text-[11px] text-white/80">Out {formatCurrency(point.expense)}</p>
                  </div>
              }
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-between gap-2">
            {data.map((point) =>
            <span key={point.month} className="flex-1 text-center text-[11px] text-ink-500">
                {point.month}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-5 border-t border-line-subtle pt-3">
        <span className="flex items-center gap-1.5 text-caption text-ink-600">
          <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-income" /> Income
        </span>
        <span className="flex items-center gap-1.5 text-caption text-ink-600">
          <span aria-hidden="true" className="h-2 w-2 rounded-sm bg-expense" /> Expenses
        </span>
      </div>
    </div>);

}

/** Inline sparkline for compact trend cues inside cards and table rows. */
export function Sparkline({
  values,
  tone = 'accent',
  width = 96,
  height = 28





}: {values: number[];tone?: 'accent' | 'income' | 'expense';width?: number;height?: number;}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values.
  map((value, index) => {
    const x = index / (values.length - 1) * width;
    const y = height - (value - min) / range * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).
  join(' ');

  const stroke =
  tone === 'income' ? 'var(--sw-income)' : tone === 'expense' ? 'var(--sw-expense)' : 'var(--sw-accent)';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round" />
      
    </svg>);

}