/**
 * Formatting helpers. The backend User model defaults `currency` to "INR",
 * so en-IN grouping (1,20,000) is the default presentation everywhere.
 */

export function formatCurrency(
amount: number,
currency = 'INR',
options: {decimals?: boolean;sign?: boolean;} = {})
: string {
  const { decimals = false, sign = false } = options;

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0
  }).format(Math.abs(amount));

  if (!sign) return amount < 0 ? `-${formatted}` : formatted;
  return `${amount < 0 ? '−' : '+'}${formatted}`;
}

/** Compact form for chart axes and tight cells: ₹1.2L, ₹84K. */
export function formatCompact(amount: number, currency = 'INR'): string {
  const symbol = currency === 'INR' ? '₹' : '';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) return `${sign}${symbol}${(abs / 10000000).toFixed(1)}Cr`;
  if (abs >= 100000) return `${sign}${symbol}${(abs / 100000).toFixed(1)}L`;
  if (abs >= 1000) return `${sign}${symbol}${Math.round(abs / 1000)}K`;
  return `${sign}${symbol}${abs}`;
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value > 0 ? '+' : value < 0 ? '−' : ''}${Math.abs(value).toFixed(decimals)}%`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDate(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateShort(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** Groups transactions under "Today" / "Yesterday" / date headers. */
export function formatRelativeDay(value: string | Date, today = new Date()): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  const diff = Math.floor(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
    86400000
  );
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return formatDate(d);
}

export function initials(name: string): string {
  return name.
  trim().
  split(/\s+/).
  slice(0, 2).
  map((part) => part.charAt(0).toUpperCase()).
  join('');
}