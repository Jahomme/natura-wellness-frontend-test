/**
 * Formats an integer amount in cents as a standard USD currency string (e.g. 2995 -> "$29.95").
 */
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
}

/**
 * Formats an ISO date string into a friendly localized date (e.g. "Nov 7, 2026").
 */
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Adds a specific number of days to an ISO timestamp and returns a new ISO string.
 */
export function addDaysToIso(isoString: string, days: number): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  const dayMs = 24 * 60 * 60 * 1000;
  return new Date(date.getTime() + days * dayMs).toISOString();
}

/**
 * Calculates a friendly human-readable relative day distance from now (e.g. "In 6 days", "Tomorrow", "Today").
 */
export function formatRelativeDays(isoString: string): string {
  const targetDate = new Date(isoString);
  if (Number.isNaN(targetDate.getTime())) {
    return "";
  }

  const now = new Date();
  // Strip hours/minutes to compare calendar dates directly
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfTarget = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((startOfTarget - startOfToday) / dayMs);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  if (diffDays > 1) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}
