import { format, isValid } from "date-fns";

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  
  // Calculate difference in days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  if (diffDays === -1) return "yesterday";
  
  if (diffDays > 0) {
    if (diffDays < 30) return `in ${diffDays} days`;
    const diffMonths = Math.floor(diffDays / 30);
    return `in ${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
  } else {
    const pastDays = Math.abs(diffDays);
    if (pastDays < 30) return `${pastDays} days ago`;
    const pastMonths = Math.floor(pastDays / 30);
    return `${pastMonths} month${pastMonths > 1 ? 's' : ''} ago`;
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Deterministic formatting helpers — REQUIRED for anything rendered inside
 * client components. Bare `toLocaleDateString()` / `toLocaleString()` use
 * the runtime's default locale, so the server (Node) and the browser can
 * produce different strings ("31 Aug" vs "Aug 31") and crash hydration.
 * These pin the format explicitly, so SSR HTML and hydration always agree.
 */
export function formatMoney(amount: number | string | null | undefined): string {
  const n = typeof amount === "string" ? Number(amount) : (amount ?? 0);
  if (!Number.isFinite(n)) return "0";
  return new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(n);
}

function toDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return isValid(d) ? d : null;
}

/** "Aug 31" — same on server and client. Renders "—" when missing/invalid. */
export function formatDateShort(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  return d ? format(d, "MMM d") : "—";
}

/** "Aug 31, 2026" — same on server and client. Renders "—" when missing/invalid. */
export function formatDateLong(value: string | number | Date | null | undefined): string {
  const d = toDate(value);
  return d ? format(d, "MMM d, yyyy") : "—";
}
